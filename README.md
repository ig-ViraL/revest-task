# revest.shop — Full-Stack E-Commerce Prototype

A monorepo containing a Next.js storefront and two NestJS microservices communicating over gRPC.

---

### Architecture

```
packages/
├── client/           # Next.js 14 + MUI — storefront & admin UI  (port 3000)
├── product-service/  # NestJS — product catalog REST + gRPC       (port 3001 / 50051)
└── order-service/    # NestJS — order management REST              (port 3002)

proto/
└── product.proto     # gRPC contract between order-service → product-service
```

The order-service calls product-service over **gRPC** to check stock availability and decrement stock when an order is placed. The client communicates with both services through **Next.js API route proxies** (never directly from the browser).

---

### Features

#### Storefront (`/home`)

- Browse 10 seeded products across 5 categories
- Search by name / description, filter by category and price range — **all filtering is done on the backend**
- Filters are reflected in the URL as query params (`?name=keyboard&category=Electronics&minPrice=50`) — fully shareable and bookmark-able
- 300 ms debounce on text/price inputs; category syncs immediately

#### Authentication (`/login`)

- Unified login / register flow — email lookup determines the path
- Profile info (name, gender, etc.) stored in `localStorage`
- Session persisted via `localStorage` key `revest_current_user`

#### Cart (`/cart`)

- Add / remove / update quantity — cart persisted in `localStorage`
- Checkout flow: select or add a delivery address, review order summary, place order
- Addresses saved per user in `localStorage`

#### My Orders (`/my-orders`)

- Lists all orders for the logged-in user
- Expandable order detail with item image, name, quantity, and line total
- Order status chip (PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED)

#### Profile (`/profile`)

- View account info (name, email, phone, gender)
- **Edit profile** — inline dialog reuses the same DynamicForm + JSON field config pattern as registration; pre-fills all current values
- Manage saved addresses (add / edit / delete)

#### Admin — Products (`/products`)

- Full CRUD on products (create, edit, soft-delete)
- Upload product image (base64, max 2 MB) or paste an image URL
- Search by name or SKU

---

### Tech Stack

| Layer           | Technology                                                         |
| --------------- | ------------------------------------------------------------------ |
| Frontend        | Next.js 14 (App Router), MUI v5, react-hook-form, react-toastify   |
| Product Service | NestJS 10, TypeORM, better-sqlite3, gRPC (`@nestjs/microservices`) |
| Order Service   | NestJS 10, TypeORM, better-sqlite3, gRPC client                    |
| IPC             | Protocol Buffers (proto3) over gRPC                                |
| Database        | SQLite (one file per service)                                      |
| Monorepo        | npm workspaces                                                     |

---

## Architecture Decisions

| Area                        | Decision                                  | Rationale                                                                                    |
| --------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| Inter-service communication | gRPC                                      | Strongly typed contracts, binary protocol, demonstrates microservice patterns                |
| gRPC surface                | Read/validate only + `DecrementStock`     | Mutations stay REST — gRPC is an internal contract, not a public API mirror                  |
| N+1 prevention              | `GetProductsByIds` batch RPC              | 100 orders → 1 gRPC call, not 100                                                            |
| Price integrity             | `unitPrice` snapshot in `order_items`     | Price changes must not retroactively alter historical orders                                 |
| Database                    | SQLite + TypeORM (one file per service)   | Zero infrastructure locally; TypeORM makes it PostgreSQL-ready with a one-line config change |
| Project structure           | Monorepo (npm workspaces)                 | Single `npm install`, one `npm run dev` starts all three services                            |
| Frontend ↔ backend          | Next.js API routes as BFF proxy           | Browsers can't do native gRPC; BFF hides service topology and eliminates CORS                |
| Form engine                 | JSON-driven field renderers               | Open/Closed: new field type = one file added, nothing else changes                           |
| IDs                         | UUID v4                                   | Globally unique across services — no coordination needed                                     |
| Deletes                     | Soft-delete only (`isActive` flag)        | Preserves audit trail; referenced products in existing orders remain resolvable              |
| Stock decrement             | Conditional `UPDATE … WHERE stock >= qty` | Atomic — eliminates race condition and oversell without a transaction lock                   |

---

## Project Structure

```
revest-task/
├── packages/
│   ├── client/
│   │   ├── app/                  # Next.js App Router pages & API routes
│   │   │   ├── api/orders/       # Proxy → order-service
│   │   │   ├── api/products/     # Proxy → product-service
│   │   │   ├── home/             # Shop page
│   │   │   ├── cart/             # Cart & checkout
│   │   │   ├── my-orders/        # Order history
│   │   │   ├── products/         # Admin product management
│   │   │   └── profile/          # User profile & addresses
│   │   ├── components/           # Shared UI components
│   │   ├── config/               # services.ts (env-based base URLs)
│   │   ├── contexts/             # AuthContext, CartContext
│   │   ├── hooks/                # useRequireAuth, useLocalStorage
│   │   └── .env.local            # Client environment variables
│   │
│   ├── product-service/
│   │   ├── src/
│   │   │   ├── products/         # CRUD controller, service, entity, DTOs
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts           # REST (3001) + gRPC (50051)
│   │   │   └── seed.ts           # Seeds 10 products on first run
│   │   └── .env
│   │
│   └── order-service/
│       ├── src/
│       │   ├── orders/           # Controller, service, entities
│       │   ├── app.module.ts
│       │   └── main.ts           # REST (3002)
│       └── .env
│
└── proto/
    └── product.proto             # gRPC service definition
```

---

## Environment Variables

### `packages/client/.env.local`

```env
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
```

### `packages/product-service/.env`

```env
PORT=3001
GRPC_PORT=50051
```

### `packages/order-service/.env`

```env
PORT=3002
PRODUCT_GRPC_URL=localhost:50051
```

> These are the exact values in the `.env.example` files. See **Getting Started → Step 2** for copy commands.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (workspaces support)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd revest-task
```

### 2. Copy environment files

The `.env` files are gitignored. Each package ships with an `.env.example` — copy them before running anything:

```bash
# Windows
copy packages\client\.env.example packages\client\.env.local
copy packages\product-service\.env.example packages\product-service\.env
copy packages\order-service\.env.example packages\order-service\.env

# macOS / Linux
cp packages/client/.env.example packages/client/.env.local
cp packages/product-service/.env.example packages/product-service/.env
cp packages/order-service/.env.example packages/order-service/.env
```

The default values work out of the box for local development — no edits needed.

### 3. Install dependencies

```bash
npm install
```

### 4. Build, seed & run (production-style)

```bash
# Build all services + seed the product database
npm run build

# Start all services
npm run start
```

`npm run build` compiles product-service, order-service, and the Next.js client in sequence, then automatically seeds 10 products into the product database (idempotent — skips if data already exists).

`npm run start` launches all three services concurrently.

### Development mode

```bash
npm run dev
```

Builds both NestJS services, then starts them alongside the Next.js dev server (client has hot-reload; restart `npm run dev` after any NestJS changes).

### Individual commands

```bash
# Build individual packages
npm run build:product   # NestJS product-service only
npm run build:order     # NestJS order-service only
npm run build:client    # Next.js client only

# Watch mode for NestJS services (TypeScript recompile on save)
npm run watch:product
npm run watch:order

# Seed the product database manually
npm run seed
```

---

## API Overview

### Product Service — REST (`http://localhost:3001`)

| Method | Path                   | Description                                                                    |
| ------ | ---------------------- | ------------------------------------------------------------------------------ |
| GET    | `/products`            | List active products (supports `?name`, `?category`, `?minPrice`, `?maxPrice`) |
| GET    | `/products/categories` | List distinct active categories                                                |
| GET    | `/products/:id`        | Get product by ID                                                              |
| POST   | `/products`            | Create product                                                                 |
| PUT    | `/products/:id`        | Update product                                                                 |
| DELETE | `/products/:id`        | Soft-delete product                                                            |

### Product Service — gRPC (`localhost:50051`)

Defined in `proto/product.proto`:

| RPC                 | Description                                 |
| ------------------- | ------------------------------------------- |
| `GetProduct`        | Fetch single product by ID                  |
| `CheckAvailability` | Check if stock is sufficient for a quantity |
| `GetProductsByIds`  | Batch fetch products by IDs                 |
| `DecrementStock`    | Reduce stock after order placement          |

### Order Service — REST (`http://localhost:3002`)

| Method | Path                 | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/orders`            | List all orders     |
| GET    | `/orders/:id`        | Get order by ID     |
| POST   | `/orders`            | Place a new order   |
| PATCH  | `/orders/:id/status` | Update order status |
| DELETE | `/orders/:id`        | Cancel order        |

---

## Seeded Products

The seed script (`packages/product-service/src/seed.ts`) inserts 10 products on first build:

| Name                                 | Category          | Price   |
| ------------------------------------ | ----------------- | ------- |
| Wireless Noise-Cancelling Headphones | Electronics       | ₹149.99 |
| Mechanical Gaming Keyboard           | Electronics       | ₹89.99  |
| 4K Smart TV 55"                      | Electronics       | ₹599.99 |
| Slim Fit Oxford Shirt                | Clothing          | ₹49.99  |
| Premium Running Shoes                | Footwear          | ₹89.99  |
| Stainless Steel Water Bottle 1L      | Sports & Outdoors | ₹34.99  |
| Non-Stick Cookware Set (5-Piece)     | Home & Kitchen    | ₹79.99  |
| Genuine Leather Bifold Wallet        | Accessories       | ₹39.99  |
| Thick Non-Slip Yoga Mat              | Sports & Outdoors | ₹49.99  |
| Scented Soy Candle Gift Set          | Home & Kitchen    | ₹29.99  |
