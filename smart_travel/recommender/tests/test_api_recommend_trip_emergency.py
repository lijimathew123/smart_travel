from unittest.mock import patch

import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_recommend_trip_includes_emergency_places():
    client = APIClient()

    payload = {
        "destination": "Kakkanad, Ernakulam",
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
        "budget": "medium",
        "travel_type": "family",
        "interests": ["sightseeing"],
    }

    with patch("recommender.api.views.get_weather", return_value={"temperature": 30, "conditions": "Clear", "humidity": 40, "feels_like": 31, "wind_speed": 5}), \
         patch("recommender.api.views.get_city_coords", return_value=(10.0, 20.0)), \
         patch("recommender.api.views.get_geoapify_places", return_value=[{"name": "P1", "category": ["tourism.attraction"], "address": "A", "lat": 1, "lon": 2, "rating": None}]), \
         patch("recommender.api.views.rank_places", return_value=[{"name": "P1", "category": ["tourism.attraction"], "address": "A", "lat": 1, "lon": 2, "score": 1.0}]), \
         patch("recommender.api.views.generate_itinerary", return_value={"summary": "ok", "days": [], "estimated_budget": "", "best_time_to_visit": "", "safety_tips": []}), \
         patch("recommender.api.views.get_nearest_airports", return_value=[{"name": "A1", "type": "airport", "address": "X", "phone": None, "lat": 1, "lon": 2}]), \
         patch("recommender.api.views.get_nearest_hospitals", return_value=[{"name": "H1", "type": "hospital", "address": "Y", "phone": None, "lat": 3, "lon": 4}]), \
         patch("recommender.api.views.get_nearest_police_stations", return_value=[{"name": "PS1", "type": "police_station", "address": "Z", "phone": None, "lat": 5, "lon": 6}]), \
         patch("recommender.api.views.get_nearest_fire_stations", return_value=[{"name": "FS1", "type": "fire_station", "address": "W", "phone": None, "lat": 7, "lon": 8}]), \
         patch("recommender.api.views.get_nearest_ambulance_services", return_value=[{"name": "AM1", "type": "ambulance_service", "address": "Q", "phone": None, "lat": 9, "lon": 10}]):

        resp = client.post("/api/recommend-trip/", payload, format="json")

    assert resp.status_code == 200
    data = resp.json()

    assert "emergency_places" in data
    ep = data["emergency_places"]
    assert set(ep.keys()) == {
        "airports",
        "hospitals",
        "police_stations",
        "fire_stations",
        "ambulance_services",
    }
    assert len(ep["airports"]) == 1
    assert len(ep["hospitals"]) == 1
    assert len(ep["police_stations"]) == 1

