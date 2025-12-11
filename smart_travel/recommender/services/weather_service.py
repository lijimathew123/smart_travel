import requests
from django.conf import settings


def get_weather(destination):
    """
    Fetch current weather info using OpenWeather API.
    """
    api_key = settings.OPENWEATHER_API_KEY

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={destination}&appid={api_key}&units=metric"
    )

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code != 200:
            return {"error": data.get("message", "Error fetching weather")}

        # Prepare clean summary
        weather_info = {
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "conditions": data["weather"][0]["description"].title(),
            "wind_speed": data["wind"]["speed"],
        }

        return weather_info

    except Exception as e:
        return {"error": str(e)}
