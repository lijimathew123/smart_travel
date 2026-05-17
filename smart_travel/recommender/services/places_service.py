import requests
from django.conf import settings

def get_geoapify_places(lat, lon, radius=5000, limit=10):
    api_key = settings.GEOAPIFY_API_KEY
    url = (
        f"https://api.geoapify.com/v2/places"
        f"?categories=tourism.attraction"
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
                "category": prop.get("categories"),
                "address": prop.get("formatted"),
                "rating": prop.get("rate"),
                "lat": prop.get("lat"),
                "lon": prop.get("lon"),
            })
        return places
    except Exception as e:
        return {"error": str(e)}
    



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

