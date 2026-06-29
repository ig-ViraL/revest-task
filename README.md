# Revest Task — Microservice-based Application

## Architecture

Three services in a monorepo:

| Service | Port | Role |
|---|---|---|
| `product-service` | 3001 (REST) + 50051 (gRPC server) | Product CRUD + gRPC contract owner |
| `order-service` | 3002 (REST) | Order CRUD + gRPC client |
| `client` | 3000 | Next.js BFF proxy + UI |

## Architecture Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Backend framework | NestJS | Required by assignment |
| Inter-service communication | gRPC | Strongly typed contracts, binary protocol, demonstrates microservice patterns |
| gRPC surface | Read/validate only (+ DecrementStock) | Mutations stay REST — gRPC is an internal contract, not a REST mirror |
| N+1 prevention | `GetProductsByIds` batch call | 100 orders = 1 gRPC call, not 100 |
| Price integrity | `unitPrice` snapshot in order_items | Price changes must not retroactively alter historical orders |
| Database | SQLite + TypeORM (one per service) | Zero-infrastructure locally; TypeORM makes it PostgreSQL-ready |
| Project structure | Monorepo (npm workspaces) | Single `npm install`, one `npm run dev` starts all 3 |
| Frontend ↔ backend | Next.js API routes as BFF proxy | Browsers can't do native gRPC; BFF hides service topology, eliminates CORS |
| UI | Material UI | Required by assignment |
| Form management | React Hook Form | Required by assignment |
| Form engine | JSON-driven field renderers | Open/Closed: new field type = one file, nothing else changes |
| IDs | UUID | Globally unique across services |
| Deletes | Soft only | Preserves audit trail and financial records |

## Prerequisites

- Node.js 18+
- npm 9+

## Run Locally

```bash
# 1. Clone
git clone <your-repo-url>
cd revest-task

# 2. Install all workspace packages (one command)
npm install

# 3. Start all three services concurrently
npm run dev
```

That's it. All three services start together.

## Endpoints

### Product Service (http://localhost:3001)
| Method | Path | Description |
|---|---|---|
| POST | /products | Create product |
| GET | /products | List active products |
| GET | /products/:id | Get product |
| PUT | /products/:id | Update product |
| DELETE | /products/:id | Soft delete |

### Order Service (http://localhost:3002)
| Method | Path | Description |
|---|---|---|
| POST | /orders | Create order (validates + snapshots via gRPC) |
| GET | /orders | List orders enriched with product data |
| GET | /orders/:id | Get single enriched order |
| PATCH | /orders/:id/status | Update order status |
| DELETE | /orders/:id | Cancel order |

### Frontend (http://localhost:3000)
| Page | Path |
|---|---|
| Dynamic Signup Form | /signup |
| Products CRUD | /products |
| Orders | /orders |

## gRPC Internal Contract
Product Service runs a gRPC server on port 50051 with four methods:
- `GetProduct` — single product fetch
- `CheckAvailability` — stock + active check before order
- `GetProductsByIds` — batch fetch (eliminates N+1)
- `DecrementStock` — atomic stock reduction after order persists

## Dynamic Form
The signup form is driven entirely by `packages/client/config/form-config.json`.
Changing `"fieldType"` in the JSON changes the rendered component instantly — no code changes needed.

Supported types: `TEXT`, `EMAIL`, `PASSWORD`, `NUMBER`, `TEXTAREA`, `LIST`, `MULTI_SELECT`, `RADIO`, `CHECKBOX`, `SWITCH`, `DATE`.
