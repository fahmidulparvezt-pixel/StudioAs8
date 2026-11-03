# StudioSpace — Client

Peer-to-peer creative workspace and production studio sharing platform.

- **Live site:** _add your deployed URL here_
- **Server repo:** _add your server repo URL here_

## Features
- Hero slider (Swiper), featured studios (`limit(6)` from MongoDB) and category browsing that pre-selects filters on `/studios`
- Studio CRUD: add, explore (search, category, sort), details with gallery carousel, update, delete with confirmation modal
- Booking modal with live price total, `Pending` status, My Bookings with status badges and cancel for pending slots
- Host dashboard to confirm, decline or complete booking requests
- Double-booking prevention: overlapping `Confirmed` slots are rejected with a clear message
- JWT in HTTPOnly cookie for protected mutations (401 when missing); BetterAuth email/password and Google sign-in
- Light/dark theme toggle, skeleton loaders, empty states, custom 404, toast notifications (react-hot-toast), fully responsive

## Tech stack
Next.js 15 (App Router), Tailwind CSS 4 + DaisyUI 5, BetterAuth (MongoDB adapter), JWT, Swiper, react-hot-toast, react-icons

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values (`JWT_SECRET` must match the server)
3. Start the Express server (see the server repo), then run `npm run dev`
4. Open http://localhost:3000

## Examiner test credentials
- Email: _add test email_
- Password: _add test password_

## Blank asset slots
Logo file: `components/Logo.jsx` (`LOGO_SRC`). Hero images: `components/HeroSlider.jsx` (`SLIDES[].image`). 404 art: `app/not-found.js`. Studio images come from the add/edit form. Drop files into `public/assets`.
