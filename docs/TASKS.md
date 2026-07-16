# Task Breakdown

**Project:** Middleman Commerce — Trusted Marketplace Platform  
**Version:** 1.0  

> Each task is scoped to roughly one commit. Check off tasks as they are completed.

---

## Phase 1: MVP

### 1. Project Scaffolding & Config

- [ ] Initialize Vite + React project in `/client` with Tailwind CSS and lucide-react
- [ ] Initialize Node.js + Express project in `/server` with ES modules or CommonJS
- [ ] Add `.env.example` to `/server` with all required environment variable keys
- [ ] Configure `dotenv` + Zod env validation in `server/src/config/env.js`
- [ ] Configure MongoDB connection with Mongoose in `server/src/config/db.js`
- [ ] Configure Cloudinary SDK in `server/src/config/cloudinary.js`
- [ ] Set up Express app with JSON body parser, CORS, and cookie-parser in `app.js`
- [ ] Create global async error handler middleware in `errorHandler.js`
- [ ] Create `ApiError` custom class with statusCode, message, and code
- [ ] Create `asyncHandler` wrapper utility for controller functions
- [ ] Create `paginate` utility helper for MongoDB queries
- [ ] Configure `express-rate-limit` middleware for auth and general routes
- [ ] Add `/server/uploads` directory with `.gitkeep` and add to `.gitignore`
- [ ] Configure multer middleware for `memoryStorage` (Cloudinary) and `diskStorage` (fallback)
- [ ] Set up Tailwind config with custom color palette and font settings
- [ ] Configure Vite proxy to forward `/api` requests to Express in development
- [ ] Add `concurrently` script to run client and server together from root


### 2. Database & Models

- [ ] Create `User` Mongoose schema with all fields, enums, and validations
- [ ] Add indexes to User model: unique on `email`
- [ ] Create `Product` Mongoose schema with all fields, enums, and validations
- [ ] Add indexes to Product model: `sellerId`, `category`, `status`, full-text on `title/description/tags`
- [ ] Create `Order` Mongoose schema with embedded `items[]` and `timeline[]`
- [ ] Add indexes to Order model: `buyerId`, `sellerId`, `status`
- [ ] Create `Conversation` Mongoose schema with embedded `messages[]`
- [ ] Create `Review` Mongoose schema with unique constraint on `orderId`
- [ ] Create `Dispute` Mongoose schema with evidence array and status enum
- [ ] Add Mongoose `pre('save')` hook on Product to auto-set `out_of_stock` when stock reaches 0
- [ ] Add Mongoose `pre('save')` hook on User to update `updatedAt` on save


### 3. Auth (Backend)

- [ ] Create Zod schema for registration input validation (`auth.schema.js`)
- [ ] Create Zod schema for login input validation
- [ ] Implement `POST /api/auth/register` — hash password, save user, return tokens
- [ ] Implement `POST /api/auth/login` — compare hash, return access + refresh tokens
- [ ] Implement `POST /api/auth/refresh` — verify refresh token cookie, return new access token
- [ ] Implement `POST /api/auth/logout` — clear refresh token cookie
- [ ] Write `generateAccessToken(user)` helper in `auth.service.js`
- [ ] Write `generateRefreshToken(user)` helper in `auth.service.js`
- [ ] Write `verifyToken` middleware that validates `Authorization: Bearer` header
- [ ] Write `requireRoles(roles[])` middleware for role-based access control
- [ ] Wire auth routes to `app.js` with rate limiter applied


### 4. Auth (Frontend)

- [ ] Create `AuthContext` with state: `user`, `accessToken`, `login()`, `logout()`, `refreshToken()`
- [ ] Configure `axiosInstance.js` with base URL and request interceptor to attach `Bearer` token
- [ ] Add Axios response interceptor to auto-refresh access token on 401 and retry request
- [ ] Build `RegisterForm` component with name, email, password fields and Zod client validation
- [ ] Build `LoginForm` component with email, password fields and error display
- [ ] Create `LoginPage` and `RegisterPage` using the form components
- [ ] Create `ProtectedRoute` component that redirects to `/login` if unauthenticated
- [ ] Create `RoleRoute` component that renders 403 fallback if user lacks required role
- [ ] Add `useAuth` custom hook to access `AuthContext` from any component
- [ ] Implement logout button in `Navbar` that calls `logout()` and redirects


### 5. Product CRUD (Backend)

- [ ] Create Zod schema for product creation and update (`product.schema.js`)
- [ ] Implement `GET /api/seller/listings` — return own listings with pagination
- [ ] Implement `POST /api/seller/listings` — create new listing for authenticated seller
- [ ] Implement `PUT /api/seller/listings/:id` — update listing, enforce ownership
- [ ] Implement `DELETE /api/seller/listings/:id` — soft-delete (set status to `inactive`)
- [ ] Implement `POST /api/seller/listings/:id/images` — upload up to 5 images via `upload.service.js`
- [ ] Implement `DELETE /api/seller/listings/:id/images/:imageIndex` — remove image from listing
- [ ] Write `upload.service.js` with Cloudinary upload logic and local fallback
- [ ] Implement `GET /api/seller/earnings` — calculate total from completed orders
- [ ] Add `POST /api/users/me/become-seller` endpoint to append `seller` to user roles


### 6. Product CRUD (Frontend — Seller)

- [ ] Build `ProductForm` component with fields: title, description, price, category, condition, stock, tags
- [ ] Add image upload section to `ProductForm` with drag-and-drop and preview (max 5 images)
- [ ] Create `SellerCreateListingPage` using `ProductForm` in create mode
- [ ] Create `SellerEditListingPage` using `ProductForm` pre-filled with existing data
- [ ] Build `SellerListingTable` component showing title, price, status, stock, and actions
- [ ] Create `SellerListingsPage` with listing table, pagination, and Create Listing button
- [ ] Add toggle to `SellerListingTable` row to flip listing between active/inactive
- [ ] Add delete confirmation modal before soft-deleting a listing
- [ ] Create `SellerDashboardPage` with earnings summary widget and recent order count
- [ ] Build `EarningsSummary` component that fetches and displays seller earnings


### 7. Browse & Search (Backend)

- [ ] Implement `GET /api/products` — paginated list of active products with filters
- [ ] Add query param support: `?category=`, `?condition=`, `?minPrice=`, `?maxPrice=`, `?sort=`
- [ ] Implement `GET /api/products/search` — full-text search using MongoDB `$text` index
- [ ] Implement `GET /api/products/:id` — return single product with seller info populated
- [ ] Implement `GET /api/storefront/:sellerId` — return seller profile + their active listings
- [ ] Add validation middleware for query params (Zod)

