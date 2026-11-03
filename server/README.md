# StudioSpace — Server

Express + MongoDB API for **StudioSpace**, a peer-to-peer creative studio booking platform.

- Live API: _add your deployed server URL here_
- Client repo: _add your client repo URL here_

## Features
- Studio CRUD with ownership checks (only the owner can edit or delete)
- Search, category filter, sort and `limit` for featured studios
- Booking requests saved as `Pending`; host can confirm, complete or decline
- Double-booking prevention: overlapping times against `Confirmed` bookings return `409` with a clear message
- JWT in HTTPOnly cookie (`ss_token`); unauthenticated mutations return `401`
- Reviews with automatic average rating

## Tech stack
Node.js, Express 4, MongoDB driver, jsonwebtoken, cookie-parser, cors

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in the values (`JWT_SECRET` must match the client)
3. `npm run dev` (runs on http://localhost:5000)

## Endpoints
| Method | Path | Auth |
|---|---|---|
| GET | /api/studios?search&category&sort&limit | public |
| GET | /api/studios/:id | public |
| GET | /api/studios/mine | yes |
| POST / PATCH / DELETE | /api/studios(/:id) | yes (owner) |
| POST | /api/studios/:id/reviews | yes |
| GET | /api/bookings/availability/:studioId?date= | public |
| GET | /api/bookings/mine, /api/bookings/incoming | yes |
| POST | /api/bookings | yes |
| PATCH | /api/bookings/:id/cancel, /api/bookings/:id/status | yes |
