# TODO (Smart Travel) — Login & UI Fixes

## 1) Backend: add missing login route
- [x] Ensure `POST /api/login/` exists in `smart_travel/urls.py`.
- [ ] Restart backend server so the route change takes effect.

## 2) Frontend: fix auth state so navbar shows after login
- [x] Update `frontend/src/context/AuthContext.jsx` to reliably initialize `token`/`user` from localStorage.
- [ ] Verify login flow stores `localStorage.token` and `localStorage.user`.
- [ ] Ensure authenticated routes (`/personalized`, `/history`) render instead of redirecting to `/login`.

## 3) Investigate blank UI on initial load
- [ ] Reproduce and capture console error (browser devtools) when UI becomes blank.
- [ ] If needed, remove/adjust React StrictMode or fix any runtime crash in auth context/router.
