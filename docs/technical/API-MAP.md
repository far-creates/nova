# API Map

## Auth

- `POST /api/auth/signup`
- `POST /api/auth/login/password`
- `POST /api/auth/login/phone/request`
- `POST /api/auth/login/phone/verify`
- `POST /api/auth/login/google`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/merge-guest`

## Guest

- `POST /api/guest/session`
- `POST /api/guest/sync`

## Practice

- `GET /api/tracks/random`
- `GET /api/tracks`
- `GET /api/topics`
- `POST /api/attempts`
- `POST /api/practice/session/start`
- `POST /api/practice/session/end`

## Review

- `GET /api/review/queue`
- `POST /api/review/refresh`

## Profile

- `GET /api/profile/summary`
- `GET /api/profile/attempts`
- `GET /api/profile/activity`
- `GET /api/profile/contribution`

## Admin / Creator

- `POST /api/admin/tracks`
- `PATCH /api/admin/tracks/:id`
- `DELETE /api/admin/tracks/:id`
- `POST /api/admin/uploads`
- `GET /api/admin/uploads`
- `POST /api/admin/creators/:userId/verify`
