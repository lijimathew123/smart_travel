import json
from unittest.mock import patch

import pytest

from recommender.services import places_service


@pytest.mark.parametrize(
    "returned_first_category, returned_second_category, expected_count",
    [
        ([], [{"name": "H1", "phone": "123", "formatted": "Addr", "lat": 1.0, "lon": 2.0}], 1),
        ([], [], 0),
    ],
)
def test_get_nearest_hospitals_fallback_categories(returned_first_category, returned_second_category, expected_count):
    # Geoapify wrapper returns list of normalized places with keys
    first_raw = [
        {
            "name": "X",
            "categories": "healthcare.hospital",
            "formatted": "Addr",
            "phone": "111",
            "lat": 0.0,
            "lon": 0.0,
        }
        for _ in returned_first_category
    ]

    second_raw = [
        {
            "name": "H1",
            "categories": "healthcare",
            "formatted": "Addr",
            "phone": "123",
            "lat": 1.0,
            "lon": 2.0,
        }
        for _ in returned_second_category
    ]

    # Patch the underlying category fetch so we control behavior.
    with patch(
        "recommender.services.places_service.get_geoapify_places_by_category",
        side_effect=[first_raw, second_raw],
    ):
        results = places_service.get_nearest_hospitals(lat=0.0, lon=0.0, limit=2)

    assert isinstance(results, list)
    assert len(results) == expected_count
    for r in results:
        assert "name" in r
        assert r.get("type") == "hospital"


def test_get_nearest_police_stations_maps_fields():
    raw = [
        {
            "name": "PS 1",
            "categories": "public_services.police",
            "formatted": "Station address",
            "phone": "555",
            "lat": 10.0,
            "lon": 20.0,
        }
    ]

    with patch(
        "recommender.services.places_service.get_geoapify_places_by_category",
        return_value=raw,
    ):
        results = places_service.get_nearest_police_stations(lat=10.0, lon=20.0, limit=2)

    assert len(results) == 1
    assert results[0]["name"] == "PS 1"
    assert results[0]["type"] == "police_station"
    # in our normalization we map address from `formatted`
    assert results[0]["address"] is not None


