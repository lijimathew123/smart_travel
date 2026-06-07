# Smart Travel - TODO

## Emergency contacts feature
- [x] Extend backend `/api/recommend-trip/` response with `emergency_places` (airports, hospitals, police stations, fire stations, ambulance services)
- [x] Add Geoapify category queries for each emergency category
- [x] Improve hospital matching with category fallbacks
- [x] Increase emergency search radius to improve coverage
- [x] Add frontend UI section + highlighted contact cards for emergency places

## Redis cache roadmap
- [ ] Install and run Redis locally on Windows (since Redis is currently not running)
- [ ] Update `smart_travel/smart_travel/settings.py` `CACHES` backend to Redis (`django-redis`)
- [ ] Update `requirements.txt` with `django-redis`
- [ ] Run server + basic cache verification

