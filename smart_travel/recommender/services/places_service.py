import requests
from django.conf import settings

def get_geoapify_places(lat, lon, radius=5000, limit=10):
    """Existing helper: tourism attractions."""
    return get_geoapify_places_by_category(
        lat=lat,
        lon=lon,
        category="tourism.attraction",
        radius=radius,
        limit=limit,
    )


def get_geoapify_places_by_category(lat, lon, category, radius=5000, limit=10):
    api_key = settings.GEOAPIFY_API_KEY
    url = (
        f"https://api.geoapify.com/v2/places"
        f"?categories={category}"
        f"&filter=circle:{lon},{lat},{radius}"
        f"&limit={limit}"
        f"&apiKey={api_key}"
    )
    try:
        resp = requests.get(url)
        data = resp.json().get("features", [])
        places = []
        for feature in data:
            prop = feature.get("properties", {})
            places.append({
                "name": prop.get("name"),
                # Geoapify may return a list in `categories`
                "category": prop.get("categories"),
                "address": prop.get("formatted"),
                "phone": prop.get("phone"),
                "lat": prop.get("lat"),
                "lon": prop.get("lon"),
            })
        return places
    except Exception as e:
        return {"error": str(e)}


def _normalize_phone(phone):
    if phone is None:
        return None
    if isinstance(phone, str):
        return phone.strip() or None
    return None


def get_nearest_airports(lat, lon, limit=2, radius=50000):
    """Nearest airports around the destination coordinates."""
    raw = get_geoapify_places_by_category(
        lat=lat,
        lon=lon,
        category="aeroway.airport",
        radius=radius,
        limit=limit,
    )
    if isinstance(raw, dict) and raw.get("error"):
        return []

    normalized = []
    for p in raw:
        if not isinstance(p, dict):
            continue
        normalized.append(
            {
                "name": p.get("name"),
                "type": "airport",
                "category": p.get("category"),
                "address": p.get("address"),
                "phone": _normalize_phone(p.get("phone")),
                "lat": p.get("lat"),
                "lon": p.get("lon"),
            }
        )
    return normalized[:limit]


def get_nearest_hospitals(lat, lon, limit=2, radius=50000):
    """Nearest hospitals around the destination coordinates.

    Geoapify categories can vary; try specific first, then broaden.
    """
    categories_to_try = [
        "healthcare.hospital",
        "healthcare",
    ]

    for cat in categories_to_try:
        raw = get_geoapify_places_by_category(
            lat=lat,
            lon=lon,
            category=cat,
            radius=radius,
            limit=limit,
        )
        if isinstance(raw, dict) and raw.get("error"):
            return []
        if isinstance(raw, list) and len(raw) > 0:
            normalized = []
            for p in raw:
                if not isinstance(p, dict):
                    continue
                normalized.append(
                    {
                        "name": p.get("name"),
                        "type": "hospital",
                        "category": p.get("category"),
                        "address": p.get("address"),
                        "phone": _normalize_phone(p.get("phone")),
                        "lat": p.get("lat"),
                        "lon": p.get("lon"),
                    }
                )

            return normalized[:limit]

    return []


def get_nearest_police_stations(lat, lon, limit=2, radius=50000):
    """Nearest police stations around the destination coordinates."""
    categories_to_try = [
        "public_services.police",
        "public_services",
    ]

    for cat in categories_to_try:
        raw = get_geoapify_places_by_category(
            lat=lat,
            lon=lon,
            category=cat,
            radius=radius,
            limit=limit,
        )
        if isinstance(raw, dict) and raw.get("error"):
            return []
        if isinstance(raw, list) and len(raw) > 0:
            normalized = []
            for p in raw:
                if not isinstance(p, dict):
                    continue
                normalized.append(
                    {
                        "name": p.get("name"),
                        "type": "police_station",
                        "category": p.get("category"),
                        # In some Geoapify responses we get `formatted` not `address`
                        "address": p.get("address") or p.get("formatted"),
                        "phone": _normalize_phone(p.get("phone")),
                        "lat": p.get("lat"),
                        "lon": p.get("lon"),
                    }
                )
            return normalized[:limit]

    return []


def get_nearest_fire_stations(lat, lon, limit=2, radius=50000):
    """Nearest fire stations around the destination coordinates."""
    categories_to_try = [
        "public_services.fire_station",
        "public_services",
    ]

    for cat in categories_to_try:
        raw = get_geoapify_places_by_category(
            lat=lat,
            lon=lon,
            category=cat,
            radius=radius,
            limit=limit,
        )
        if isinstance(raw, dict) and raw.get("error"):
            return []
        if isinstance(raw, list) and len(raw) > 0:
            normalized = []
            for p in raw:
                if not isinstance(p, dict):
                    continue
                normalized.append(
                    {
                        "name": p.get("name"),
                        "type": "fire_station",
                        "category": p.get("category"),
                        "address": p.get("address"),
                        "phone": _normalize_phone(p.get("phone")),
                        "lat": p.get("lat"),
                        "lon": p.get("lon"),
                    }
                )
            return normalized[:limit]

    return []


def get_nearest_ambulance_services(lat, lon, limit=2, radius=50000):
    """Nearest ambulance/medical emergency services around the destination coordinates."""
    categories_to_try = [
        "healthcare.ambulance",
        "healthcare",
    ]

    for cat in categories_to_try:
        raw = get_geoapify_places_by_category(
            lat=lat,
            lon=lon,
            category=cat,
            radius=radius,
            limit=limit,
        )
        if isinstance(raw, dict) and raw.get("error"):
            return []
        if isinstance(raw, list) and len(raw) > 0:
            normalized = []
            for p in raw:
                if not isinstance(p, dict):
                    continue
                normalized.append(
                    {
                        "name": p.get("name"),
                        "type": "ambulance_service",
                        "category": p.get("category"),
                        "address": p.get("address"),
                        "phone": _normalize_phone(p.get("phone")),
                        "lat": p.get("lat"),
                        "lon": p.get("lon"),
                    }
                )
            return normalized[:limit]

    return []




    



def get_city_coords(city):
    api_key = settings.GEOAPIFY_API_KEY
    url = (
        f"https://api.geoapify.com/v1/geocode/search"
        f"?text={city}"
        f"&apiKey={api_key}"
    )
    resp = requests.get(url).json()
    if resp.get("features"):
        coords = resp["features"][0]["properties"]
        return coords["lat"], coords["lon"]
    return None, None

