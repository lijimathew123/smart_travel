from typing import List, Dict, Any

CATEGORY_WEIGHTS = {
    "tourism.attraction": 5,
    "tourism.sights": 4,
    "leisure.park": 3,
    "natural": 3,
    "building.historic": 2
}

EXCLUDED_KEYWORDS = (
    "station",
    "terminus",
    "railway",
    "jail"
)


def _extract_categories(place: Dict[str, Any]) -> List[str]:
    """
    Normalize possible category fields into a list of lowercase strings.
    Supports: 'category', 'categories', 'types' and list-of-dict items.
    """
    raw = place.get("category") or place.get("categories") or place.get("types") or []
    cats: List[str] = []
    if not isinstance(raw, list):
        return cats
    for c in raw:
        if isinstance(c, str):
            cats.append(c.lower())
        elif isinstance(c, dict):
            # try common keys inside category dict
            for key in ("id", "name", "category", "type", "label"):
                v = c.get(key)
                if v:
                    cats.append(str(v).lower())
                    break
    return cats


def rank_places(places: List[Dict[str, Any]], limit: int = 10) -> List[Dict[str, Any]]:
    """
    Safely rank places:
    - skip non-dict / None entries
    - skip places with excluded keywords in name
    - normalize categories and score using CATEGORY_WEIGHTS (supports partial matches)
    - return top `limit` places sorted by score desc
    """
    if not places or not isinstance(places, list):
        return []

    cleaned: List[Dict[str, Any]] = [p for p in places if isinstance(p, dict)]
    ranked: List[Dict[str, Any]] = []

    for place in cleaned:
        name = (place.get("name") or "")
        if not isinstance(name, str):
            name = str(name)
        name_l = name.lower()

        # exclude noisy places
        if any(word in name_l for word in EXCLUDED_KEYWORDS):
            continue

        categories = _extract_categories(place)

        score = 0
        # Score based on exact or partial category matches
        for cat in categories:
            # exact key match
            if cat in CATEGORY_WEIGHTS:
                score += CATEGORY_WEIGHTS[cat]
                continue
            # partial match (e.g., "tourism.attraction" contained in longer string)
            for weight_key, weight in CATEGORY_WEIGHTS.items():
                if weight_key in cat:
                    score += weight
                    break

        # small heuristic: boost if interest-like words appear in name
        for weight_key, weight in CATEGORY_WEIGHTS.items():
            key_part = weight_key.split(".")[-1]
            if key_part and key_part in name_l:
                score += 0.5  # small boost

        place["score"] = score
        ranked.append(place)

    ranked.sort(key=lambda x: x.get("score", 0), reverse=True)
    return ranked[:max(0, int(limit))]


def personalize_score(place: Dict[str, Any], user_profile: Dict[str, Any]) -> float:
    """
    Compute personalized score based on precomputed place['score'] and user profile.
    user_profile expected shape:
      {
        "interest_count": {"shopping": 3, "sightseeing": 2, ...},
        "recent_destination": "Kochi",
        "top_travel_type": "couple" | "family" | "solo" | ...
      }
    """
    base = float(place.get("score", 0))
    categories_text = " ".join(_extract_categories(place)).lower()
    name = (place.get("name") or "").lower()

    score = base

    interests = user_profile.get("interest_count", {})
    if isinstance(interests, dict):
        for interest, weight in interests.items():
            if not isinstance(interest, str):
                continue
            if interest.lower() in categories_text or interest.lower() in name:
                try:
                    score += 2 * float(weight)
                except Exception:
                    pass

    recent = user_profile.get("recent_destination")
    if isinstance(recent, str) and recent.lower() in name:
        score += 3

    travel_type = user_profile.get("top_travel_type")
    if travel_type == "couple":
        if "romantic" in categories_text or "beach" in categories_text:
            score += 2
    elif travel_type == "family":
        if "park" in categories_text or "zoo" in categories_text:
            score += 2
    elif travel_type == "solo":
        if "museum" in categories_text or "historic" in categories_text:
            score += 2

    return score
