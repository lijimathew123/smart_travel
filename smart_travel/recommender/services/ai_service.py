from groq import Groq
from django.conf import settings
import json
from recommender.utils import extract_json_from_ai

client = Groq(api_key=settings.GROQ_API_KEY)


def _empty_emergency_places():
    return {
        "airports": [],
        "hospitals": [],
        "police_stations": [],
        "fire_stations": [],
        "ambulance_services": [],
    }


def generate_emergency_places(destination, lat, lon, user_input, limit=2):
    """Generate emergency contact/place details using Groq.

    Output must match the frontend expected structure.
    """

    prompt = f"""
You are an assistant that provides emergency contact information for travelers.

Generate the NEAREST emergency facilities for the following destination:
- Destination: {destination}
- Destination coordinates: lat={lat}, lon={lon}

Constraints:
- Return EXACTLY {limit} items for EACH category.
- Use the following categories and output schema:

Return STRICT JSON only (no markdown, no extra text) with this exact structure:
{{
  "airports": [
    {{"name":"", "type":"airport", "address":"", "phone":"", "lat":0.0, "lon":0.0}}
  ],
  "hospitals": [
    {{"name":"", "type":"hospital", "address":"", "phone":"", "lat":0.0, "lon":0.0}}
  ],
  "police_stations": [
    {{"name":"", "type":"police_station", "address":"", "phone":"", "lat":0.0, "lon":0.0}}
  ],
  "fire_stations": [
    {{"name":"", "type":"fire_station", "address":"", "phone":"", "lat":0.0, "lon":0.0}}
  ],
  "ambulance_services": [
    {{"name":"", "type":"ambulance_service", "address":"", "phone":"", "lat":0.0, "lon":0.0}}
  ]
}}

Data quality rules:
- Prefer real names of facilities and plausible addresses.
- If phone is unknown, return an empty string "".
- lat/lon must be real numeric coordinates.
- Keep text concise.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    ai_text = response.choices[0].message.content
    data = extract_json_from_ai(ai_text)
    if not isinstance(data, dict):
        return _empty_emergency_places()

    # Ensure keys exist
    for k in _empty_emergency_places().keys():
        if k not in data or not isinstance(data[k], list):
            data[k] = []

    # Ensure item shape and enforce limit
    def normalize_item(itm, expected_type):
        if not isinstance(itm, dict):
            return {"name": "", "type": expected_type, "address": "", "phone": "", "lat": lat, "lon": lon}
        return {
            "name": itm.get("name") or "",
            "type": itm.get("type") or expected_type,
            "address": itm.get("address") or "",
            "phone": itm.get("phone") or "",
            "lat": itm.get("lat") if isinstance(itm.get("lat"), (int, float)) else lat,
            "lon": itm.get("lon") if isinstance(itm.get("lon"), (int, float)) else lon,
        }

    type_map = {
        "airports": "airport",
        "hospitals": "hospital",
        "police_stations": "police_station",
        "fire_stations": "fire_station",
        "ambulance_services": "ambulance_service",
    }

    out = _empty_emergency_places()
    for cat, expected_type in type_map.items():
        normalized = [normalize_item(x, expected_type) for x in data.get(cat, [])]
        out[cat] = normalized[:limit]

        # If model returned fewer than limit, pad with blanks but keep coords
        while len(out[cat]) < limit:
            out[cat].append(
                {
                    "name": "",
                    "type": expected_type,
                    "address": "",
                    "phone": "",
                    "lat": lat,
                    "lon": lon,
                }
            )

    return out


def generate_itinerary(destination, weather, places, user_input):

    """
    Generate a 3–5 day travel itinerary using LLaMA-3 via Groq
    """

    places_text = "\n".join(
        [f"- {p['name']} ({', '.join(p['category'][:3])})" for p in places[:8]]
    )

    prompt = f"""
    You are a professional travel planner.

    Create a detailed travel itinerary.

    Destination: {destination}

    Trip Details:
    - Travel dates: {user_input['start_date']} to {user_input['end_date']}
    - Budget: {user_input['budget']}
    - Travel type: {user_input['travel_type']}
    - Interests: {', '.join(user_input['interests'])}

    Weather Summary:
    - Temperature: {weather.get('temperature')}°C
    - Conditions: {weather.get('conditions')}
    - Humidity: {weather.get('humidity')}%

    Popular Places:
    {places_text}

    Instructions:
    - Create a day-wise itinerary (Day 1, Day 2, etc.)
    - Include morning, afternoon, and evening plans
    - Suggest restaurants or local food experiences
    - Add travel tips based on weather
    - Provide an estimated daily budget
    - Keep tone friendly and professional
    -Do NOT mention exact prices or entry fees unless you are certain.
    -Use approximate or avoid numbers.

    Return response strictly in JSON with this structure:

    {{
    "summary": "",
    "days": [
        {{
        "day": "Day 1",
        "morning": "",
        "afternoon": "",
        "evening": "",
        "food": "",
        "tips": ""
        }}
    ],
    "estimated_budget": "",
    "best_time_to_visit": "",
    "safety_tips": []
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    ai_text = response.choices[0].message.content
    itinerary = extract_json_from_ai(ai_text)
    return itinerary or {
    "error": "Failed to parse AI itinerary"
}
