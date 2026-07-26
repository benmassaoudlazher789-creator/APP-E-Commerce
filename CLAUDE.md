# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A MERN e-commerce app split into two independent, unconnected npm projects:

- `backend/` — Express 5 + MongoDB (Mongoose) REST API, auth via JWT, image uploads via Multer + Cloudinary.
- `frontend/` — React 19 + Vite, React Router v7, Redux (classic `redux` + `redux-thunk`, not Redux Toolkit), React-Bootstrap for UI.

There is no root `package.json` — always `cd` into `backend/` or `frontend/` before running npm commands.

## Commands

Backend (run from `backend/`):
- `npm run dev` — start the API with nodemon (auto-restart), reads `backend/.env`
- `npm start` — start the API once with node

Frontend (run from `frontend/`):
- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build

There are no test scripts/frameworks configured in either project.

## Architecture

### Backend (`backend/`)

Layering is `routes/` → `middlewares/` (validation/auth) → `controller/` → `model/`:

- `server.js` — express app entry point. Loads `.env`, calls `connectDB()`, mounts `/api/auth` and `/api/product` routers, listens on `process.env.PORT`.
- `config/connectDB.js` — single Mongoose connection using `process.env.MONGODB_URI`.
- `model/User.js`, `model/Product.js` — Mongoose schemas. `Product.createdBy` references the `User` collection (string ref `"user"`, lowercase) to scope products to their owner.
- `routes/auth.routes.js`, `routes/prod.routes.js` — route definitions, wiring middleware before controllers.
- `controller/auth.controller.js` — `register`/`login`. Passwords hashed with bcrypt; on success returns a JWT (`SECRET_KEY`, 2h expiry) plus a trimmed-down user object.
- `controller/product.controller.js` — CRUD for products. Update/delete handlers check `req.user._id` against `Product.createdBy` and 403 if the requester doesn't own the product.
- `middlewares/isAuth.js` — reads the JWT from the raw `authorization` header (no `Bearer ` prefix), verifies it, loads the user, and attaches it as `req.user`. Used to protect product write routes and `/api/auth/current`.
- `middlewares/validator.js` — `express-validator` chains (`registerValidation`, `loginValidation`) plus a shared `validation` middleware that 400s on the first failures.
- `util/cloudinary.js` — Cloudinary SDK v2 configured from env vars (`CLOUD_NAME`, `API_KEY`, `API_SECRET`).
- `util/multer.js` — disk-storage Multer instance restricted to `.jpg`/`.jpeg`/`.png`; uploaded files are pushed to Cloudinary in the controller, not served from disk.

Required `backend/.env` keys: `PORT`, `MONGODB_URI`, `SECRET_KEY`, `CLOUD_NAME`, `API_KEY`, `API_SECRET` (gitignored, never commit real values).

### Frontend (`frontend/`)

- `src/main.jsx` — mounts `App` inside `BrowserRouter` and a Redux `Provider`.
- `src/App.jsx` — top-level route table (`/`, `/register`, `/login`, `/profile`, catch-all `Error` page). On mount, dispatches `current()` to restore the logged-in user from the stored JWT.
- `src/JS/` — Redux layer, organized by feature (`actions/`, `actionsType/`, `reducers/`, `store/`):
  - `store/store.js` — classic `createStore` + `redux-thunk`, with Redux DevTools support.
  - `reducers/index.js` — `combineReducers`; currently only registers `authReducer`. **There is no product reducer wired up yet** even though `JS/actions/Prod.action.js` and `JS/actionsType/Prod.actionType.js` exist — `Prod.action.js` is incomplete (references an undefined `API_URL` and unimported `axios`, and dispatches action types that don't match those defined in `Prod.actionType.js`). Treat the product Redux slice as a stub to be finished, not a working reference.
  - `actions/auth.action.js` — thunks for `register`, `login`, `current`, `logout`. The JWT is stored in `localStorage` under `token` and sent back as a raw `authorization` header (matching `isAuth.js` on the backend, which does *not* expect a `Bearer ` prefix).
- `vite.config.js` — dev server proxies `/api/*` to `http://localhost:1980` (must match backend's `PORT`), so frontend API calls use relative paths like `axios.post("/api/auth/register", ...)`.
- `src/pages/` — route-level components (`Home`, `Login`, `Register`, `Profile`, `Error`); `src/components/` — shared UI (`BarNav`, `Footer`).

### Cross-cutting conventions

- Comments and some user-facing strings/messages are written in French; match this style when editing existing files in `backend/`.
- Auth token flow: backend issues a JWT on register/login → frontend stores it in `localStorage` → frontend sends it back verbatim (no `Bearer` prefix) in the `authorization` header → `isAuth` middleware verifies and loads `req.user` for protected routes.
