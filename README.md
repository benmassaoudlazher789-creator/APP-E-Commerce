# Red Store — Shoe E-Commerce Platform

Red Store is a full-stack **MERN** e-commerce platform for selling shoes. It features a Men / Women / Kids catalog with filters, live search, a wishlist, a per-user persistent cart, a multi-step checkout with **Stripe** payments, and an **admin dashboard** for managing products and orders.

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?style=flat&logo=antdesign&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic_Claude-191919?style=flat&logo=anthropic&logoColor=white)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Useful Scripts](#useful-scripts)
- [Screenshots](#screenshots)
- [Author](#author)

---

## Tech Stack

### Frontend (`frontend/`)

| Category | Libraries |
|---|---|
| Core | React 19, Vite 8, React Router 7 |
| State management | Redux 5 + Redux Thunk (classic `createStore`, not Redux Toolkit), React Redux |
| UI | Ant Design 6, React-Bootstrap / Bootstrap 5, Tailwind CSS 3, Lucide icons |
| Animation | Framer Motion |
| Payments | Stripe.js + React Stripe.js (Card Element) |
| Misc | Axios, React Hot Toast |

### Backend (`backend/`)

| Category | Libraries |
|---|---|
| Server | Node.js, Express 5 |
| Database | MongoDB with Mongoose 9 |
| Auth & security | JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `express-validator`, `express-rate-limit` |
| Payments | Stripe (Payment Intents) |
| Media | Multer (uploads) + Cloudinary (image hosting) |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) for product description generation |

---

## Features

- **JWT authentication with roles**: register / login, a `client` role by default and a single `admin` role, route guards on both the API (`isAuth` + `isRole`) and the UI. Login is rate-limited, and there is a password reset flow via a hashed one-time token.
- **Product catalog** split into Men / Women / Kids, with filters for **brand**, **size** and **max price**, sorting, and dedicated *New Arrivals* and *Sale* pages.
- **Live search** in the navbar, with debounced, cancellable requests to a server-side search endpoint (title, description, category, brand).
- **Wishlist** stored per user in MongoDB.
- **Persistent cart per user**, stored in MongoDB (`carts` collection) so it survives logout/login and syncs across devices. Stock is validated server-side on every change.
- **Multi-step checkout** (Shipping → Payment → Review) with **Stripe** Payment Intents.
- **User profile** with personal info, saved addresses and order history.
- **Admin dashboard** (`/dashboard/admin`):
  - Overview: total orders, products, users and revenue, plus recent orders with inline status updates.
  - Products (`/dashboard/admin/products`): paginated table with search, edit (price, category, sizes/stock) and delete with confirmation.
  - Add-product form with image uploads to Cloudinary (`/admin/products`).
- **AI-assisted product descriptions**: an admin-only endpoint (`POST /api/product/generate-description`) generates a product description with Anthropic's Claude API.

---

## Project Structure

The repository contains **two independent npm projects**. There is no root `package.json`.

```
.
├── backend/
│   ├── server.js          # Express entry point: CORS, JSON, DB connection, route mounting
│   ├── config/            # MongoDB connection (with DNS fallback + retries)
│   ├── controller/        # Request handlers: auth, product, cart, order, payment, admin
│   ├── middlewares/       # isAuth (JWT), isRole (RBAC), optionalAuth, express-validator chains
│   ├── model/             # Mongoose schemas: User, Product, Cart, Order, PaymentIntent
│   ├── routes/            # Routers mounted under /api/auth, /product, /cart, /order, /payment, /admin
│   ├── scripts/           # One-off / seed scripts for the database (see below)
│   └── util/              # Cloudinary, Multer and Anthropic client helpers
│
└── frontend/
    ├── vite.config.js     # Vite config (dev proxy /api -> backend)
    └── src/
        ├── main.jsx       # App bootstrap: Router, Redux Provider, Ant Design theme
        ├── App.jsx        # Route table
        ├── pages/         # Route-level pages (Shop, ProductDetail, Cart, Checkout, Profile, ...)
        │   ├── checkout/  # Checkout steps: Shipping, Payment (Stripe), Review
        │   └── dashboard/ # Admin dashboard: overview + product management
        ├── components/    # Shared UI (navbar, footer, product cards, home sections, profile widgets)
        ├── JS/            # Redux layer: actions/, actionsType/, reducers/, store/
        ├── styles/        # Theme tokens, shared CSS, Ant Design theme
        └── utils/         # API helpers, formatting, validators
```

---

## Installation & Setup

### Prerequisites

- Node.js 20.19+ (or 22.12+) and npm (required by Vite 8)
- A MongoDB database (e.g. MongoDB Atlas)
- A Cloudinary account (image uploads)
- A Stripe account in test mode (payments)
- An Anthropic API key (optional, only needed for AI description generation)

### 1. Clone the repository

```bash
git clone https://github.com/benmassaoudlazher789-creator/APP-E-Commerce.git
cd APP-E-Commerce
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
```

Environment variables (`backend/.env`, see `backend/.env.example`):

| Variable | Description |
|---|---|
| `PORT` | API port (the frontend expects `1980` by default) |
| `MONGODB_URI` | MongoDB connection string |
| `SECRET_KEY` | Secret used to sign JWTs |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | Cloudinary API key |
| `API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `ANTHROPIC_API_KEY` | Anthropic API key (AI product descriptions) |
| `FRONTEND_URL` | *(optional)* Base URL used in password-reset links. Defaults to `http://localhost:5173` |

> **Note:** `.env` files are git-ignored. Never commit real credentials.

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:1980` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) |

### 4. Run in development

Open two terminals:

```bash
# Terminal 1: API (nodemon, auto-restart)
cd backend
npm run dev
```

```bash
# Terminal 2: React app (Vite)
cd frontend
npm run dev
```

The app runs at `http://localhost:5173` and the API at `http://localhost:<PORT>`.

### 5. (Optional) Seed data and create an admin

```bash
cd backend
npm run seed:products                            # insert the product catalog
npm run seed:sale                                # mark a selection of products as on sale
node scripts/setUserRole.js you@example.com admin  # promote your account to admin
```

### Available npm scripts

| Location | Command | Description |
|---|---|---|
| `backend/` | `npm run dev` | Start the API with nodemon |
| `backend/` | `npm start` | Start the API with node |
| `backend/` | `npm run seed:products` | Seed the product catalog |
| `backend/` | `npm run seed:sale` | Flag selected products as on sale |
| `frontend/` | `npm run dev` | Start the Vite dev server |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run preview` | Preview the production build |
| `frontend/` | `npm run lint` | Run ESLint |

---

## Useful Scripts

Located in `backend/scripts/` and run from the `backend/` folder:

- **`seedRealProducts.js`**: seeds the Red Store shoe catalog (Men / Women / Kids). It is idempotent, so re-running it never creates duplicates (`npm run seed:products`).
- **`setUserRole.js`**: changes a user's role by email, e.g. to promote an account to `admin` (`node scripts/setUserRole.js <email> <role>`).
- **`markProductsOnSale.js`**: marks a selection of products as on sale, with an original price and a discount percentage, to populate the *Sale* page (`npm run seed:sale`).

The other files in this folder are one-off data-maintenance scripts (image and category fixes).

---

## Screenshots

> _Screenshots coming soon._

<!--
| Home | Shop |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Shop](docs/screenshots/shop.png) |

| Checkout | Admin Dashboard |
|---|---|
| ![Checkout](docs/screenshots/checkout.png) | ![Admin](docs/screenshots/admin-dashboard.png) |
-->

---

## Author

**Lazher Ben Massaoud**

- GitHub: [@benmassaoudlazher789-creator](https://github.com/benmassaoudlazher789-creator)
- LinkedIn: [Lazher Ben Massaoud](https://www.linkedin.com/in/ben-massaoud-lazher/) <!-- TODO: replace with your LinkedIn URL -->
