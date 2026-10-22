# DriveEasy Car Rental System

A React and Express car rental demo for the ITUE301 Set E practical. It includes protected customer pages, a lazy loaded admin page, MongoDB/Mongoose models, and a REST API.

## Requirements

- Node.js 18 or newer and npm
- MongoDB locally or a MongoDB Atlas connection string

## Setup

1. Copy `.env.example` to `backend/.env` and set `MONGO_URI` and a private `JWT_SECRET`.
2. Install dependencies from the project root with `npm install`, then run `npm install --prefix backend` and `npm install --prefix frontend`.
3. Start the backend with `node server.js` from `backend/` or run `npm start` from the project root.
4. Start the React app in another terminal with `npm run dev --prefix frontend` and open the URL Vite prints (normally `http://localhost:5173`).

For both apps at once after installing the root dependencies, use `npm run dev` from the root.

## Demo login

Register/create a customer using `POST /api/v1/auth/register` (name, email, phone, licenseNumber, password), then sign in at `/`. The development seed inserts sample vehicles when the vehicle collection is empty. Admin demo access is controlled by setting `role: "admin"` on a customer document; fleet manager users can be assigned `role: "fleetManager"`.

## API

- `POST /api/v1/auth/register` and `POST /api/v1/auth/login`
- `GET /api/v1/vehicles` (public)
- `POST /api/v1/bookings`, `GET /api/v1/bookings/my`, `PATCH /api/v1/bookings/:id/status` (Bearer token)
- `GET /api/v1/admin/summary` (admin only)

Booking creation checks vehicle availability, validates the date range, creates the booking, then marks the vehicle unavailable. Booking listings populate customer and vehicle details. The API reports structured JSON errors.

## Folder layout

`frontend/` contains the React app and reusable components. `backend/` contains the Express server, middleware, Mongoose models, and routes. Never commit `.env`; `.env.example` is safe to share.
