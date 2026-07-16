# System Design Document

**Project:** Middleman Commerce — Trusted Marketplace Platform  
**Version:** 1.0  
**Date:** 2025  
**Status:** Draft

---

## Table of Contents

1. [Project Folder Structure](#1-project-folder-structure)
2. [Data Models](#2-data-models)
3. [REST API Endpoints](#3-rest-api-endpoints)
4. [Frontend Page & Component Hierarchy](#4-frontend-page--component-hierarchy)
5. [Auth Flow](#5-auth-flow)
6. [Order Lifecycle State Machine](#6-order-lifecycle-state-machine)
7. [Cart Architecture](#7-cart-architecture)
8. [Socket.IO Events](#8-socketio-events)
9. [Cloudinary Upload Strategy](#9-cloudinary-upload-strategy)

---

## 1. Project Folder Structure


### /server

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection (Mongoose)
│   │   ├── cloudinary.js          # Cloudinary SDK config
│   │   └── env.js                 # Validated env vars (dotenv + Zod)
│   ├── middleware/
│   │   ├── auth.js                # verifyToken middleware
│   │   ├── requireRoles.js        # Role-based access control
│   │   ├── validate.js            # Zod request validation middleware
│   │   ├── rateLimiter.js         # express-rate-limit configs
│   │   ├── upload.js              # multer config for file uploads
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Conversation.js
│   │   ├── Review.js
│   │   └── Dispute.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── seller.routes.js
│   │   ├── conversation.routes.js
│   │   ├── review.routes.js
│   │   ├── dispute.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── seller.controller.js
│   │   ├── conversation.controller.js
│   │   ├── review.controller.js
│   │   ├── dispute.controller.js
│   │   └── admin.controller.js
│   ├── services/
│   │   ├── auth.service.js        # Token generation, hashing helpers
│   │   ├── upload.service.js      # Cloudinary + local fallback logic
│   │   └── notification.service.js # Stub: console.log notifications
│   ├── schemas/                   # Zod validation schemas
│   │   ├── auth.schema.js
│   │   ├── product.schema.js
│   │   ├── order.schema.js
│   │   ├── review.schema.js
│   │   └── dispute.schema.js
│   ├── sockets/
│   │   ├── index.js               # Socket.IO server init & namespace
│   │   ├── chat.socket.js         # Chat event handlers
│   │   └── order.socket.js        # Order status event emitters
│   ├── utils/
│   │   ├── ApiError.js            # Custom error class
│   │   ├── asyncHandler.js        # Async try/catch wrapper
│   │   └── paginate.js            # Pagination helper
│   ├── seed/
│   │   └── seed.js                # DB seed script
│   └── app.js                     # Express app setup
├── server.js                      # HTTP + Socket.IO server entry
├── .env.example
├── .gitignore
└── package.json
```


### /client

```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── axiosInstance.js       # Axios base config + interceptors
│   │   ├── auth.api.js
│   │   ├── products.api.js
│   │   ├── orders.api.js
│   │   ├── seller.api.js
│   │   ├── conversations.api.js
│   │   ├── reviews.api.js
│   │   └── disputes.api.js
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductSearchBar.jsx
│   │   │   ├── ProductImageGallery.jsx
│   │   │   └── ProductForm.jsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   ├── checkout/
│   │   │   ├── AddressSelector.jsx
│   │   │   └── OrderSummary.jsx
│   │   ├── orders/
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   └── OrderStatusBadge.jsx
│   │   ├── seller/
│   │   │   ├── SellerListingTable.jsx
│   │   │   ├── SellerOrderTable.jsx
│   │   │   └── EarningsSummary.jsx
│   │   ├── chat/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── MessageThread.jsx
│   │   │   └── MessageInput.jsx
│   │   ├── reviews/
│   │   │   ├── ReviewForm.jsx
│   │   │   └── ReviewList.jsx
│   │   └── disputes/
│   │       ├── DisputeForm.jsx
│   │       └── DisputeCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx        # Auth state + token management
│   │   └── CartContext.jsx        # Cart state management
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js
│   │   ├── useOrders.js
│   │   └── useSocket.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProductListingPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── buyer/
│   │   │   ├── BuyerDashboardPage.jsx
│   │   │   ├── BuyerOrdersPage.jsx
│   │   │   └── BuyerOrderDetailPage.jsx
│   │   ├── seller/
│   │   │   ├── SellerDashboardPage.jsx
│   │   │   ├── SellerListingsPage.jsx
│   │   │   ├── SellerCreateListingPage.jsx
│   │   │   ├── SellerEditListingPage.jsx
│   │   │   └── SellerOrdersPage.jsx
│   │   ├── storefront/
│   │   │   └── StorefrontPage.jsx
│   │   ├── chat/
│   │   │   └── MessagesPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminUsersPage.jsx
│   │   │   ├── AdminListingsPage.jsx
│   │   │   └── AdminDisputesPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx
│   ├── store/                     # (Optional Zustand store if preferred over Context)
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── cn.js                  # Tailwind className merge utility
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 2. Data Models


### User

```js
{
  _id: ObjectId,
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], enum: ['buyer', 'seller', 'admin'], default: ['buyer'] },
  avatar: { type: String, default: null },          // Cloudinary URL or null
  phone: { type: String, default: null },
  addresses: [
    {
      label: String,                                 // e.g. "Home", "Work"
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      isDefault: Boolean
    }
  ],
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
// Indexes: email (unique)
```

### Product

```js
{
  _id: ObjectId,
  sellerId: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 5000 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },        // e.g. 'electronics', 'clothing'
  condition: { type: String, enum: ['new', 'like_new', 'good', 'fair', 'poor'], required: true },
  images: [{ type: String }],                        // Array of Cloudinary URLs (max 5)
  stock: { type: Number, required: true, min: 0, default: 1 },
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
// Indexes: sellerId, category, status, { title: 'text', description: 'text', tags: 'text' }
```

### Order

```js
{
  _id: ObjectId,
  buyerId: { type: ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: ObjectId, ref: 'Product', required: true },
      sellerId: { type: ObjectId, ref: 'User', required: true },
      title: String,                                 // snapshot at time of purchase
      price: Number,                                 // snapshot at time of purchase
      qty: { type: Number, required: true, min: 1 },
      image: String                                  // snapshot
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  trackingNumber: { type: String, default: null },
  sellerId: { type: ObjectId, ref: 'User', required: true }, // single seller per order (post-split)
  totalAmount: { type: Number, required: true },
  timeline: [
    {
      status: String,
      note: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
}
// Indexes: buyerId, sellerId, status
```

### Conversation

```js
{
  _id: ObjectId,
  participants: [{ type: ObjectId, ref: 'User' }],  // exactly 2 participants
  orderId: { type: ObjectId, ref: 'Order', default: null },
  messages: [
    {
      senderId: { type: ObjectId, ref: 'User' },
      text: { type: String, maxlength: 2000 },
      attachments: [{ type: String }],               // Cloudinary URLs
      readBy: [{ type: ObjectId, ref: 'User' }],
      createdAt: { type: Date, default: Date.now }
    }
  ],
  lastMessageAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}
// Indexes: participants, orderId
```

### Review

```js
{
  _id: ObjectId,
  orderId: { type: ObjectId, ref: 'Order', required: true, unique: true },
  reviewerId: { type: ObjectId, ref: 'User', required: true },
  revieweeId: { type: ObjectId, ref: 'User', required: true },  // seller being reviewed
  productId: { type: ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
}
// Indexes: orderId (unique), revieweeId, productId
```

### Dispute

```js
{
  _id: ObjectId,
  orderId: { type: ObjectId, ref: 'Order', required: true },
  raisedBy: { type: ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, maxlength: 2000 },
  evidence: [{ type: String }],                      // Cloudinary URLs
  status: {
    type: String,
    enum: ['open', 'under_review', 'resolved', 'closed'],
    default: 'open'
  },
  resolution: { type: String, default: null },       // 'refund_issued', 'closed_no_action', etc.
  adminNotes: { type: String, default: null },
  resolvedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}
// Indexes: orderId, raisedBy, status
```

---

## 3. REST API Endpoints

> **Auth legend:** `—` = public, `🔒` = any authenticated user, `🛒` = buyer role, `🏪` = seller role, `🛡️` = admin role


### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login; returns access + refresh tokens |
| POST | `/api/auth/refresh` | — | Exchange refresh token for new access token |
| POST | `/api/auth/logout` | 🔒 | Invalidate refresh token |

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | 🔒 | Get current user profile |
| PUT | `/api/users/me` | 🔒 | Update profile (name, phone, avatar) |
| POST | `/api/users/me/addresses` | 🔒 | Add a new address |
| PUT | `/api/users/me/addresses/:addressId` | 🔒 | Update an address |
| DELETE | `/api/users/me/addresses/:addressId` | 🔒 | Delete an address |
| POST | `/api/users/me/become-seller` | 🔒 | Add seller role to own account |

### Products (Public Browse)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | — | List all active products (paginated, filterable) |
| GET | `/api/products/:id` | — | Get single product detail |
| GET | `/api/products/search` | — | Search products by keyword + filters |

### Products (Seller CRUD)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/seller/listings` | 🏪 | Get own listings (all statuses) |
| POST | `/api/seller/listings` | 🏪 | Create new product listing |
| PUT | `/api/seller/listings/:id` | 🏪 | Update own listing |
| DELETE | `/api/seller/listings/:id` | 🏪 | Soft-delete listing (set inactive) |
| POST | `/api/seller/listings/:id/images` | 🏪 | Upload images to listing |
| DELETE | `/api/seller/listings/:id/images/:imageIndex` | 🏪 | Remove an image from listing |

### Seller Dashboard

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/seller/orders` | 🏪 | Get all orders for seller's products (paginated) |
| GET | `/api/seller/orders/:id` | 🏪 | Get single order detail (seller view) |
| PATCH | `/api/seller/orders/:id/status` | 🏪 | Advance order status (confirm/ship) |
| GET | `/api/seller/earnings` | 🏪 | Get earnings summary |

### Storefront (Public)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/storefront/:sellerId` | — | Get seller public profile + active listings |

### Orders (Buyer)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | 🛒 | Place order(s) from cart |
| GET | `/api/orders` | 🛒 | Get buyer's order history (paginated) |
| GET | `/api/orders/:id` | 🛒 | Get single order detail (buyer view) |
| PATCH | `/api/orders/:id/deliver` | 🛒 | Buyer marks order as delivered |

### Conversations & Messages *(Phase 2)*

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/conversations` | 🔒 | List all conversations for current user |
| POST | `/api/conversations` | 🔒 | Start new conversation (with optional orderId) |
| GET | `/api/conversations/:id` | 🔒 | Get conversation with messages |
| POST | `/api/conversations/:id/messages` | 🔒 | Send a message in a conversation |

### Reviews *(Phase 2)*

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/reviews` | 🛒 | Create review for a completed order |
| GET | `/api/reviews/seller/:sellerId` | — | Get reviews for a seller (paginated) |
| GET | `/api/reviews/product/:productId` | — | Get reviews for a product (paginated) |

### Disputes *(Phase 2)*

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/disputes` | 🛒 | Raise a new dispute |
| GET | `/api/disputes` | 🛒 | Get disputes raised by buyer |
| GET | `/api/disputes/:id` | 🛒 | Get single dispute detail |
| POST | `/api/disputes/:id/evidence` | 🛒 | Upload additional evidence |

### Admin *(Phase 2)*

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | 🛡️ | List all users (paginated) |
| GET | `/api/admin/users/:id` | 🛡️ | Get user detail |
| PATCH | `/api/admin/users/:id/ban` | 🛡️ | Ban or unban a user |
| GET | `/api/admin/listings` | 🛡️ | List all listings (all statuses) |
| PATCH | `/api/admin/listings/:id/deactivate` | 🛡️ | Deactivate any listing |
| GET | `/api/admin/disputes` | 🛡️ | List all disputes (paginated, filterable by status) |
| PATCH | `/api/admin/disputes/:id` | 🛡️ | Update dispute (notes, status, resolution) |
| GET | `/api/admin/analytics` | 🛡️ | Get platform analytics summary |

---

## 4. Frontend Page & Component Hierarchy

```
AppRouter
├── Public Routes
│   ├── HomePage              → Navbar, ProductGrid, ProductFilters, Pagination
│   ├── ProductListingPage    → ProductSearchBar, ProductFilters, ProductGrid, Pagination
│   ├── ProductDetailPage     → ProductImageGallery, ProductCard (detail), ReviewList, Button (add to cart)
│   ├── StorefrontPage        → Seller public info, ProductGrid (seller's active listings)
│   ├── LoginPage             → LoginForm
│   └── RegisterPage          → RegisterForm
│
├── Protected Routes (🔒 any authenticated user)
│   ├── CartPage              → CartDrawer/CartPage, CartItem x N, CartSummary
│   ├── CheckoutPage          → AddressSelector, OrderSummary, Button (place order)
│   └── OrderConfirmationPage → success message, link to orders
│
├── Buyer Routes (🛒)
│   ├── BuyerDashboardPage    → profile summary, recent orders
│   ├── BuyerOrdersPage       → OrderCard x N, Pagination
│   └── BuyerOrderDetailPage  → OrderTimeline, OrderStatusBadge, tracking info
│
├── Seller Routes (🏪)
│   ├── SellerDashboardPage   → EarningsSummary, recent orders snapshot
│   ├── SellerListingsPage    → SellerListingTable, Pagination
│   ├── SellerCreateListingPage → ProductForm (create mode)
│   ├── SellerEditListingPage  → ProductForm (edit mode, pre-filled)
│   └── SellerOrdersPage      → SellerOrderTable (with status actions), Pagination
│
├── Chat Routes (Phase 2) (🔒)
│   └── MessagesPage          → ConversationList, MessageThread, MessageInput
│
└── Admin Routes (Phase 2) (🛡️)
    ├── AdminDashboardPage    → analytics charts/stats
    ├── AdminUsersPage        → user table with ban/unban actions
    ├── AdminListingsPage     → listing table with deactivate action
    └── AdminDisputesPage     → dispute table with resolve workflow
```

---

## 5. Auth Flow


### Registration

```
Client                          Server
  │                               │
  ├─── POST /api/auth/register ──►│
  │    { name, email, password }  │
  │                               ├─ Zod validate input
  │                               ├─ Check email not taken (409 if exists)
  │                               ├─ bcrypt.hash(password, 10)
  │                               ├─ Save User to DB (roles: ['buyer'])
  │                               ├─ Generate accessToken (15min JWT)
  │                               ├─ Generate refreshToken (7d JWT)
  │◄── 201 { accessToken, user } ─┤
  │    Set-Cookie: refreshToken   │
```

### Login

```
Client                          Server
  │                               │
  ├─── POST /api/auth/login ─────►│
  │    { email, password }        │
  │                               ├─ Find user by email
  │                               ├─ bcrypt.compare(password, hash)
  │                               ├─ Generate accessToken + refreshToken
  │◄── 200 { accessToken, user } ─┤
  │    Set-Cookie: refreshToken   │
```

### Token Refresh

```
Client                          Server
  │                               │
  ├─── POST /api/auth/refresh ───►│
  │    Cookie: refreshToken       │
  │                               ├─ Verify refreshToken signature + expiry
  │                               ├─ Look up user by id in payload
  │                               ├─ Generate new accessToken
  │◄── 200 { accessToken } ───────┤
```

### Authenticated Request

```
Client                          Server
  │                               │
  ├─── GET /api/orders ──────────►│
  │    Authorization: Bearer xxx  │
  │                               ├─ auth middleware: verify JWT
  │                               ├─ Attach req.user = { userId, roles }
  │                               ├─ requireRoles(['buyer']) check
  │                               ├─ Controller logic
  │◄── 200 { data, pagination } ──┤
```

### Logout

```
Client                          Server
  │                               │
  ├─── POST /api/auth/logout ────►│
  │    Authorization: Bearer xxx  │
  │                               ├─ Clear refreshToken cookie
  │                               ├─ (Optionally add token to blacklist)
  │◄── 200 { success: true } ─────┤
```

### Axios Interceptor (Frontend)

1. Every request attaches `Authorization: Bearer <accessToken>` from memory/context.
2. On 401 response, the interceptor calls `POST /api/auth/refresh` once.
3. If refresh succeeds, retry the original request with the new token.
4. If refresh fails (expired or invalid), clear auth state and redirect to `/login`.

---

## 6. Order Lifecycle State Machine

```
                    ┌──────────┐
         checkout   │  pending │  buyer cancels
        ──────────► │          │ ─────────────► cancelled
                    └────┬─────┘
                         │ seller confirms
                         ▼
                    ┌──────────┐
                    │confirmed │
                    └────┬─────┘
                         │ seller ships + adds tracking number
                         ▼
                    ┌──────────┐
                    │ shipped  │
                    └────┬─────┘
                         │ buyer marks delivered
                         ▼
                    ┌──────────┐
                    │delivered │
                    └────┬─────┘
                         │ buyer leaves review OR 7-day auto-complete
                         ▼
                    ┌──────────┐
                    │completed │
                    └──────────┘
```

**Rules:**
- Status can only advance forward (no rollbacks) except to `cancelled` from `pending`.
- Only the seller can transition: `pending → confirmed`, `confirmed → shipped`.
- Only the buyer can transition: `shipped → delivered`.
- `delivered → completed` happens when the buyer submits a review, or automatically after 7 days (background job stub).
- Each status change appends an entry to `order.timeline[]`.
- The seller provides `trackingNumber` when transitioning to `shipped`.
- `paymentStatus` is set to `paid` when the order is created (checkout simulates payment).

---

## 7. Cart Architecture

The cart is managed client-side in `CartContext` (React Context + localStorage persistence). It is a flat array of cart items.

### Cart Item Shape

```js
{
  productId: string,
  sellerId: string,
  sellerName: string,
  title: string,
  price: number,
  image: string,
  stock: number,
  qty: number
}
```

### Multi-Seller Cart Splitting

At checkout, items are grouped by `sellerId`. Each group becomes a separate `Order` document. A single `POST /api/orders` call receives an array of order payloads, one per seller group.

```
Cart: [
  { sellerId: "A", productId: "p1", qty: 2, price: 20 },
  { sellerId: "A", productId: "p2", qty: 1, price: 10 },
  { sellerId: "B", productId: "p3", qty: 1, price: 50 },
]

Grouped:
  Seller A → items: [p1 x2, p2 x1], total: $50
  Seller B → items: [p3 x1], total: $50

POST /api/orders → creates 2 Order documents
Returns: [{ orderId: "order1", sellerId: "A" }, { orderId: "order2", sellerId: "B" }]
```

**Stock check:** The server validates that `qty <= product.stock` for each item before creating orders. If any item fails the check, the entire request is rejected with 422.

**Stock decrement:** After order creation, each product's `stock` is decremented atomically. Products reaching `stock === 0` have their `status` set to `out_of_stock`.

---

## 8. Socket.IO Events

The Socket.IO server uses the default namespace (`/`). Clients authenticate by passing the access token in the `auth` handshake:

```js
const socket = io(SERVER_URL, { auth: { token: accessToken } });
```

The server validates the token in the `connection` middleware and attaches `socket.userId`.

### Chat Events *(Phase 2)*

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join:conversation` | Client → Server | `{ conversationId }` | Join a conversation room |
| `leave:conversation` | Client → Server | `{ conversationId }` | Leave a conversation room |
| `message:send` | Client → Server | `{ conversationId, text, attachments? }` | Send a chat message |
| `message:new` | Server → Client | `{ conversationId, message }` | Broadcast new message to room |
| `message:read` | Client → Server | `{ conversationId, messageId }` | Mark message as read |
| `typing:start` | Client → Server | `{ conversationId }` | User started typing |
| `typing:stop` | Client → Server | `{ conversationId }` | User stopped typing |
| `typing:indicator` | Server → Client | `{ conversationId, userId }` | Broadcast typing indicator to room |

### Order Status Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `order:statusUpdate` | Server → Client | `{ orderId, status, timestamp }` | Notify buyer/seller of status change |
| `order:join` | Client → Server | `{ orderId }` | Join order-specific room for live updates |

### Connection Events

| Event | Direction | Description |
|---|---|---|
| `connect` | Server → Client | Socket connected successfully |
| `disconnect` | Server → Client | Socket disconnected |
| `error` | Server → Client | `{ message }` — auth failure or room error |

---

## 9. Cloudinary Upload Strategy

### Upload Flow

```
Client                      Server                    Cloudinary
  │                             │                          │
  ├── POST multipart/form-data ►│                          │
  │   (image file)              ├─ multer memoryStorage    │
  │                             ├─ validate MIME + size    │
  │                             ├─ uploadService.upload() ►│
  │                             │                          ├─ Store in CDN
  │                             │◄── { secure_url, ... } ──┤
  │◄── 200 { imageUrl } ────────┤                          │
```

### Configuration

```js
// Cloudinary folders by resource type
products/     → listing images
avatars/      → user profile pictures
evidence/     → dispute evidence uploads
attachments/  → chat message attachments

// Upload options
folder: dynamic based on resource type
allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
max_bytes: 5_242_880  // 5MB
transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }]
```

### Local Fallback

If `CLOUDINARY_CLOUD_NAME` is not set in environment variables, `upload.service.js` falls back to local disk storage via multer:

```
server/uploads/
  ├── products/
  ├── avatars/
  ├── evidence/
  └── attachments/
```

Local files are served as static assets from `GET /uploads/:folder/:filename`.

The `imageUrl` returned is a relative path (`/uploads/products/filename.jpg`) when using local storage, and an absolute Cloudinary URL (`https://res.cloudinary.com/...`) when using Cloudinary.

All image references in the database store the full URL string — the application code is agnostic to which storage backend was used.
