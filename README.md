# MiddleMan Commerce

A full-stack marketplace where the platform acts as a **trusted middleman** between buyers and sellers. Buyers browse and purchase without creating an account — sellers manage listings and fulfil orders through a dedicated dashboard.

---

## Architecture

```
MIDDLEMAN-COMMERCER/
├── client/          React + Vite + Tailwind CSS (buyer storefront + seller/admin apps)
├── server/          Node.js + Express REST API + Socket.IO
└── docs/            Requirements, design, and task breakdown
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, lucide-react |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Real-time | Socket.IO |
| File uploads | Cloudinary (local `/uploads` fallback) |
| Validation | Zod |

---

## User Roles

| Role | Account Required | Description |
|---|---|---|
| **Buyer** | ❌ No | Browse, add to cart, checkout as guest, track orders by email |
| **Seller** | ✅ Yes | Manage storefront, create listings, fulfil orders |
| **Admin** | ✅ Yes | Moderate listings, manage users, resolve disputes, analytics |

> A single account can hold both **seller** and **admin** roles.

---

## Features

### Phase 1 (MVP) ✅
- Guest checkout — no account needed to buy
- Guest order tracking by Order ID + email
- Product browse/search with filters (category, price, condition, sort)
- Product detail page with image gallery and seller info card
- Multi-seller cart — splits into one sub-order per seller at checkout
- Order lifecycle: `pending → confirmed → shipped → delivered → completed`
- Seller dashboard — listings CRUD, order fulfilment, earnings summary
- Public seller storefront page

### Phase 2 (Trust & Communication)
- Real-time chat (Socket.IO) tied to product/order threads
- Reviews: buyer reviews seller + product after order completes
- Disputes: raise, evidence upload, admin resolution
- Admin dashboard — analytics, user ban, listing moderation
- In-app notification center

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone https://github.com/heur402/MIDDLEMAN-COMMERCER.git
cd MIDDLEMAN-COMMERCER

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

**Server** — copy and edit:
```bash
cd server
cp .env.example .env
```

Required variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/middleman_db
JWT_ACCESS_SECRET=your_32_char_secret_here
JWT_REFRESH_SECRET=your_32_char_secret_here
CLIENT_ORIGIN=http://localhost:5173
```

Optional (leave blank to use local `/uploads` fallback):
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Client** — copy and edit:
```bash
cd client
cp .env.example .env
```
```
VITE_API_URL=          # leave blank — Vite proxy handles /api → :5000
VITE_SOCKET_URL=       # leave blank — defaults to window.location.origin
```

### 3. Seed demo data

```bash
cd server
npm run seed
```

Demo accounts (password: `Password123!`):

| Role | Email |
|---|---|
| Admin | admin@seed.middleman.com |
| Seller | alice@seed.middleman.com |
| Seller | bob@seed.middleman.com |

### 4. Run dev servers

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000/api/health

---

## API Overview

| Group | Base Path | Auth |
|---|---|---|
| Auth | `/api/auth` | Public |
| Products | `/api/products` | Public |
| Storefront | `/api/storefront/:id` | Public |
| Orders | `POST /api/orders` | Guest or logged-in |
| Order tracking | `GET /api/orders/track` | Guest (email + orderId) |
| Seller | `/api/seller/*` | Seller role |
| Conversations | `/api/conversations` | Any logged-in |
| Reviews | `/api/reviews` | Buyer for create; public for reads |
| Disputes | `/api/disputes` | Any logged-in |
| Admin | `/api/admin/*` | Admin role |

---

## Project Structure

```
server/src/
├── config/         DB, Cloudinary, env validation
├── controllers/    Request handlers (one per resource)
├── middleware/     auth, optionalAuth, requireRoles, validate, rateLimiter, upload
├── models/         Mongoose schemas
├── routes/         Express routers
├── schemas/        Zod validation schemas
├── seed/           Demo data seed script
├── services/       auth, upload, notification
└── utils/          ApiError, asyncHandler, paginate

client/src/
├── api/            Axios API modules
├── components/     Reusable UI components
├── context/        AuthContext, CartContext
├── hooks/          useAuth, useCart, useProducts, useOrders, useSocket
├── pages/          All page components
│   ├── buyer/      Dashboard, orders
│   ├── seller/     Dashboard, listings, orders
│   ├── admin/      Dashboard
│   ├── chat/       Messages
│   └── static/     FAQ, Contact, Privacy, Terms
├── router/         AppRouter, ProtectedRoute
└── utils/          cn, formatCurrency, formatDate
```

---

## Git Workflow

- All work is committed directly to `main` with descriptive conventional commit messages.
- Branch naming convention: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`
- Every logical change (file creation, config update, bug fix) gets its own commit.

---

## Out of Scope (stubbed)

- Payment processing — `paymentStatus` field only (`unpaid` / `paid` / `refunded`)
- Shipping carrier API — sellers enter tracking numbers manually
- Email/SMS delivery — notifications log to console

---

## License

MIT
