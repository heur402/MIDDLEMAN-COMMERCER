# Software Requirements Document

**Project:** Middleman Commerce — Trusted Marketplace Platform  
**Version:** 1.0  
**Date:** 2025  
**Status:** Draft

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Functional Requirements](#functional-requirements)
   - [Unauthenticated Users](#unauthenticated-users)
   - [Buyers](#buyers)
   - [Sellers](#sellers)
   - [Admins](#admins)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [Authentication Requirements](#authentication-requirements)
6. [API Contract Conventions](#api-contract-conventions)
7. [Pagination Requirements](#pagination-requirements)
8. [Rate Limiting Requirements](#rate-limiting-requirements)
9. [Out of Scope](#out-of-scope)

---

## 1. Overview

Middleman Commerce is a full-stack marketplace web application where the platform owns the transaction lifecycle. Buyers browse and purchase products, sellers list and fulfill orders, and the platform mediates orders, messaging, and disputes. The platform acts as the trusted middleman ensuring both buyer protection and seller accountability.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS + lucide-react |
| Backend | Node.js + Express (REST API) |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) + bcrypt |
| Real-time | Socket.IO |
| File Uploads | Cloudinary (fallback: local `/uploads`) |
| Validation | Zod (all API inputs) |

---

## 2. User Roles

| Role | Description |
|---|---|
| **Buyer** | Can browse, search, and purchase products; message sellers; track orders; leave reviews; raise disputes |
| **Seller** | Can create and manage a storefront and product listings; fulfill orders; message buyers; view earnings |
| **Admin** | Can moderate listings; manage users; resolve disputes; access analytics dashboard |

> A single user account may hold both `buyer` and `seller` roles simultaneously. Role assignment is stored in a `roles[]` array on the User model.

---

## 3. Functional Requirements

### Unauthenticated Users

| ID | Requirement |
|---|---|
| UNAUTH-01 | Users can browse the product listing page with pagination |
| UNAUTH-02 | Users can view an individual product detail page |
| UNAUTH-03 | Users can search products by keyword |
| UNAUTH-04 | Users can filter products by category, condition, and price range |
| UNAUTH-05 | Users can view a seller's public storefront page |
| UNAUTH-06 | Users can register a new account with name, email, and password |
| UNAUTH-07 | Users can log in with email and password |
| UNAUTH-08 | The platform returns meaningful validation error messages for invalid inputs |

---

### Buyers

#### Account & Profile

| ID | Requirement |
|---|---|
| BUY-01 | Buyer can view and edit their profile (name, phone, avatar) |
| BUY-02 | Buyer can manage saved addresses (add, edit, delete) |
| BUY-03 | Buyer can view their order history with status |

#### Browse & Search

| ID | Requirement |
|---|---|
| BUY-04 | Buyer can browse paginated product listings |
| BUY-05 | Buyer can search products by keyword across title, description, and tags |
| BUY-06 | Buyer can filter products by category, price range, and condition |
| BUY-07 | Buyer can sort products by price (asc/desc), date added, and relevance |
| BUY-08 | Buyer can view a seller's storefront with all their active listings |

#### Cart

| ID | Requirement |
|---|---|
| BUY-09 | Buyer can add items to a shopping cart |
| BUY-10 | Buyer can update item quantities in the cart |
| BUY-11 | Buyer can remove items from the cart |
| BUY-12 | Cart persists across sessions (stored server-side or in localStorage) |
| BUY-13 | Cart displays per-seller groupings when items span multiple sellers |
| BUY-14 | Cart displays total price per seller group and overall total |

#### Checkout & Orders

| ID | Requirement |
|---|---|
| BUY-15 | Buyer can proceed to checkout from cart |
| BUY-16 | Buyer can select or enter a shipping address at checkout |
| BUY-17 | Buyer can confirm and place an order |
| BUY-18 | Upon placing an order, `paymentStatus` is set to `paid` (simulated; no real gateway) |
| BUY-19 | Multi-seller carts are split into separate sub-orders, one per seller |
| BUY-20 | Buyer receives an order confirmation with order ID(s) |
| BUY-21 | Buyer can view current order status and status timeline |
| BUY-22 | Buyer can view tracking number once seller marks as shipped |
| BUY-23 | Buyer can mark an order as `delivered` (triggers transition to `completed` after review period) |

#### Messaging *(Phase 2)*

| ID | Requirement |
|---|---|
| BUY-24 | Buyer can initiate a message thread with a seller, optionally linked to an order |
| BUY-25 | Buyer can send and receive real-time messages |
| BUY-26 | Buyer can attach images to messages |

#### Reviews *(Phase 2)*

| ID | Requirement |
|---|---|
| BUY-27 | Buyer can leave a review for a completed order (rating 1–5 + comment) |
| BUY-28 | A buyer may only review an order once |

#### Disputes *(Phase 2)*

| ID | Requirement |
|---|---|
| BUY-29 | Buyer can raise a dispute on a delivered or completed order |
| BUY-30 | Buyer can provide a reason and upload evidence for the dispute |
| BUY-31 | Buyer can view the status and resolution of their dispute |

---

### Sellers

#### Storefront & Profile

| ID | Requirement |
|---|---|
| SEL-01 | Seller can activate the seller role from their account settings |
| SEL-02 | Seller can view their public storefront page |
| SEL-03 | Seller can view aggregate earnings summary |

#### Listings

| ID | Requirement |
|---|---|
| SEL-04 | Seller can create a new product listing (title, description, price, category, condition, images, stock, tags) |
| SEL-05 | Seller can edit any field of an existing listing |
| SEL-06 | Seller can delete a listing (soft-delete: set status to `inactive`) |
| SEL-07 | Seller can toggle a listing between `active` and `inactive` status |
| SEL-08 | Seller can upload up to 5 images per listing via Cloudinary |
| SEL-09 | Seller can only manage their own listings — no access to other sellers' listings |
| SEL-10 | Newly created listings default to `active` status |
| SEL-11 | Stock is decremented when a buyer places an order; if stock reaches 0, listing status auto-updates to `out_of_stock` |

#### Order Fulfillment

| ID | Requirement |
|---|---|
| SEL-12 | Seller can view all incoming orders for their products |
| SEL-13 | Seller can confirm a pending order (status: `pending` → `confirmed`) |
| SEL-14 | Seller can mark an order as shipped and enter a tracking number (status: `confirmed` → `shipped`) |
| SEL-15 | Seller cannot skip order status steps (must progress sequentially) |
| SEL-16 | Seller can view order detail including buyer's shipping address |

#### Messaging *(Phase 2)*

| ID | Requirement |
|---|---|
| SEL-17 | Seller can view and reply to message threads from buyers |
| SEL-18 | Seller can receive real-time message notifications |

---

### Admins

#### User Management

| ID | Requirement |
|---|---|
| ADM-01 | Admin can view a paginated list of all users |
| ADM-02 | Admin can view a single user's profile and activity |
| ADM-03 | Admin can ban or suspend a user account |
| ADM-04 | Admin can restore a banned user account |

#### Listing Moderation

| ID | Requirement |
|---|---|
| ADM-05 | Admin can view all listings, including inactive ones |
| ADM-06 | Admin can remove or deactivate any listing regardless of seller |
| ADM-07 | Admin can flag listings for policy violations |

#### Dispute Resolution *(Phase 2)*

| ID | Requirement |
|---|---|
| ADM-08 | Admin can view all open disputes |
| ADM-09 | Admin can add internal notes to a dispute |
| ADM-10 | Admin can resolve a dispute with an outcome (refund, close, escalate) |
| ADM-11 | Admin can update a dispute's status |

#### Analytics *(Phase 2)*

| ID | Requirement |
|---|---|
| ADM-12 | Admin can view total GMV (gross merchandise value) over time |
| ADM-13 | Admin can view new user registrations over time |
| ADM-14 | Admin can view order volume and status breakdown |
| ADM-15 | Admin can view top sellers by order volume |

---

## 4. Non-Functional Requirements

### Security

| ID | Requirement |
|---|---|
| SEC-01 | All passwords must be hashed with bcrypt (minimum 10 salt rounds) |
| SEC-02 | JWTs must be signed with a secret of at least 32 characters; access tokens expire in 15 minutes |
| SEC-03 | Refresh tokens expire in 7 days and are stored securely (HttpOnly cookie or secure localStorage) |
| SEC-04 | All protected routes must validate the access token before processing |
| SEC-05 | Users can only modify resources they own; ownership is enforced server-side |
| SEC-06 | All API inputs are validated with Zod schemas before processing |
| SEC-07 | File uploads are validated for MIME type and size (max 5MB per image) |
| SEC-08 | CORS is configured to allow only approved origins |
| SEC-09 | Admin routes are protected by both JWT auth and role check middleware |
| SEC-10 | Rate limiting is applied to auth and messaging endpoints (see Section 8) |

### Performance

| ID | Requirement |
|---|---|
| PERF-01 | Product listing queries must respond in under 500ms for up to 10,000 products |
| PERF-02 | MongoDB indexes must be defined on: `Product.sellerId`, `Product.category`, `Product.status`, `Order.buyerId`, `Order.status`, `User.email` |
| PERF-03 | Images are served via Cloudinary CDN; local uploads are served as static files |
| PERF-04 | API responses for list endpoints are paginated; full collection scans are avoided |

### Scalability

| ID | Requirement |
|---|---|
| SCALE-01 | The backend is stateless; session state is stored in JWT claims, not server memory |
| SCALE-02 | Socket.IO is configured to support horizontal scaling via Redis adapter (stub acceptable for MVP) |
| SCALE-03 | The application can be containerized with Docker (Dockerfile optional for Phase 1) |

### Responsiveness & Accessibility

| ID | Requirement |
|---|---|
| UX-01 | The frontend is fully responsive across mobile (375px+), tablet (768px+), and desktop (1280px+) |
| UX-02 | All interactive elements must have accessible labels and keyboard navigation support |
| UX-03 | Loading states are shown for all async operations |
| UX-04 | Error messages are displayed inline near the relevant field or as toast notifications |

### Error Handling

| ID | Requirement |
|---|---|
| ERR-01 | All unhandled server errors return a standardized JSON error response (see Section 6) |
| ERR-02 | 404 responses are returned for unknown routes |
| ERR-03 | 401 responses are returned for missing or invalid tokens |
| ERR-04 | 403 responses are returned for valid tokens with insufficient permissions |
| ERR-05 | Validation errors return 422 with per-field error details |
| ERR-06 | The server must not expose stack traces or internal error details in production |

---

## 5. Authentication Requirements

| ID | Requirement |
|---|---|
| AUTH-01 | Registration requires: `name` (string, 2–60 chars), `email` (valid email), `password` (min 8 chars, 1 uppercase, 1 number) |
| AUTH-02 | Login returns an access token (JWT, 15 min TTL) and a refresh token (JWT, 7 days TTL) |
| AUTH-03 | The access token is returned in the response body; the refresh token is set as an HttpOnly cookie |
| AUTH-04 | `POST /api/auth/refresh` accepts the refresh token and returns a new access token |
| AUTH-05 | `POST /api/auth/logout` invalidates the refresh token (server-side blacklist or cookie clear) |
| AUTH-06 | All protected routes require the `Authorization: Bearer <token>` header |
| AUTH-07 | Token payload includes: `userId`, `roles[]`, `iat`, `exp` |
| AUTH-08 | Role-based middleware enforces access by checking `roles[]` in the token payload |

---

## 6. API Contract Conventions

All API endpoints follow a consistent JSON response shape.

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
```

For paginated lists:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK — successful GET, PUT, PATCH |
| 201 | Created — successful POST that creates a resource |
| 204 | No Content — successful DELETE |
| 400 | Bad Request — malformed request body |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — authenticated but insufficient permissions |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — duplicate resource (e.g., email already registered) |
| 422 | Unprocessable Entity — Zod validation failure |
| 429 | Too Many Requests — rate limit exceeded |
| 500 | Internal Server Error — unhandled exception |

### Request Conventions

- All request bodies use `Content-Type: application/json`
- File upload endpoints use `Content-Type: multipart/form-data`
- All list endpoints accept `?page=` and `?limit=` query params
- Dates are returned as ISO 8601 strings

---

## 7. Pagination Requirements

| ID | Requirement |
|---|---|
| PAG-01 | All list endpoints support `?page=1&limit=20` query parameters |
| PAG-02 | Default `page` is `1`; default `limit` is `20` |
| PAG-03 | Maximum `limit` is `100` to prevent large response payloads |
| PAG-04 | Responses include a `pagination` object with `page`, `limit`, `total`, and `totalPages` |
| PAG-05 | Out-of-range page numbers return an empty `data` array, not a 404 |

Endpoints requiring pagination include: product listings, seller listings, order history, user list (admin), dispute list (admin), conversation list.

---

## 8. Rate Limiting Requirements

| ID | Endpoint Group | Limit | Window |
|---|---|---|---|
| RATE-01 | `POST /api/auth/register` | 10 requests | 15 minutes per IP |
| RATE-02 | `POST /api/auth/login` | 10 requests | 15 minutes per IP |
| RATE-03 | `POST /api/auth/refresh` | 30 requests | 15 minutes per IP |
| RATE-04 | Messaging (send message) | 60 requests | 1 minute per user |
| RATE-05 | General API | 300 requests | 15 minutes per IP |

Rate limit responses use HTTP 429 with a `Retry-After` header.

---

## 9. Out of Scope

The following items are explicitly excluded from both Phase 1 and Phase 2:

| Item | Notes |
|---|---|
| Real payment gateway | `paymentStatus` field only: `unpaid`, `paid`, `refunded`. Checkout simulates payment. |
| Shipping carrier API integration | Tracking number is a plain string entered manually by the seller. |
| Email notifications | Stubbed with `console.log`. No SMTP or third-party email service. |
| SMS notifications | Out of scope entirely. |
| OAuth / social login | Only email + password authentication. |
| Mobile native app | Web responsive only. |
| Multi-currency support | All prices in a single currency (USD). |
| Product variants (size/color) | Single SKU per listing. |
| Seller subscription tiers / fees | No commission or fee logic. |
| Inventory batch import | Manual listing creation only. |
| Two-factor authentication | Not included. |
