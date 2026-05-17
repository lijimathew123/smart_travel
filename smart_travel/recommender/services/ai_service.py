from groq import Groq
from django.conf import settings
import json
from recommender.utils import extract_json_from_ai

client = Groq(api_key=settings.GROQ_API_KEY)



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
