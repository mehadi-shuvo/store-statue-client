# GameXpress Frontend

GameXpress is a Next.js storefront and administration application for physical products, gift cards, game top-ups, subscriptions, orders, and payments.

This repository contains the frontend only. It communicates with a separate REST API and relies on backend-managed HTTP-only cookies for authentication.

## Features

- Responsive customer storefront and product discovery
- Customer registration, login, email verification, password recovery, and profile management
- API-backed cart and browser-persisted wishlist
- Gift-card catalog, checkout, order history, and secure code delivery
- Game top-up catalog, dynamic account fields, payments, and fulfillment tracking
- Payment initiation and provider-return status handling
- Role-protected administration for products, customers, orders, payments, inventory, and logs
- Consistent loading, empty, error, and unavailable states

## Technology stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 with App Router |
| UI | React 19, Tailwind CSS 4, daisyUI 5 |
| Language | TypeScript with strict type checking |
| Server state | TanStack Query 5 |
| Client state | React Context |
| Icons | Lucide React |
| Testing | Vitest, React Testing Library, jsdom |
| Code quality | ESLint and Next.js Core Web Vitals rules |

## Requirements

- Node.js 22 LTS (pinned by `package.json`)
- npm
- A compatible GameXpress backend exposing `/api/v1`

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Configure the backend URL in `.env.local`:

   ```dotenv
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The backend must allow the frontend origin and credentialed requests for cookie-based authentication to work locally.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Public base URL of the backend API, preferably ending in `/api/v1` |

The API client also accepts a backend origin or URL ending in `/api` and normalizes it to `/api/v1`. `NEXT_PUBLIC_API_BASE_URL` remains available as a temporary compatibility fallback.

> `NEXT_PUBLIC_*` variables are included in the browser bundle. Never place database credentials, JWT secrets, SMTP passwords, payment-provider secrets, or other private values in frontend environment files.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Turbopack development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run the test suite once |
| `npm run check` | Run lint, type checking, and tests |

Before opening a pull request, run:

```bash
npm run check
npm run build
```

## Architecture

The application separates routing, presentation, server state, API access, and domain contracts.

```text
src/
├── app/                 # Routes, layouts, and route-level boundaries
├── components/          # Shared and domain-oriented React components
│   ├── admin/           # Administration UI
│   ├── auth/            # Authentication UI
│   ├── game-top-up/     # Customer top-up UI
│   ├── gift-card/       # Customer gift-card UI
│   ├── home/            # Homepage sections
│   ├── navbar/          # Navigation components
│   └── payment/         # Payment result and status UI
├── context/             # Auth, cart, toast, and wishlist client state
├── features/            # Feature availability and route guards
├── hooks/api/           # TanStack Query hooks and query keys
├── lib/                 # API client, auth flow, formatting, and shared logic
├── services/api/        # Domain-specific backend requests and mappers
├── types/               # Shared API and domain contracts
└── test/                # Shared test configuration
```

### Data flow

```text
Route
  → feature component
    → query hook or context
      → domain service
        → central API client
          → backend REST API
```

Route files should focus on routing and composition. Reusable business behavior belongs in domain services, hooks, or feature components rather than directly in `page.tsx` files.

## API and server state

Backend calls flow through `src/lib/api.ts`, which provides:

- normalized API base URLs;
- cookie-aware requests using `credentials: "include"`;
- automatic JSON serialization;
- consistent success-response extraction;
- normalized `ApiError` instances;
- field-validation details and retry metadata;
- centralized unauthorized-session notification.

Domain services live in `src/services/api`. TanStack Query hooks in `src/hooks/api` own caching, mutations, and targeted invalidation. Components should not introduce direct backend requests when a service already represents the operation.

## Authentication and authorization

Authentication is restored from the backend session when the application loads. A `401` response clears client authentication and sensitive cached data before redirecting to the appropriate login screen.

Customer and admin route guards improve navigation and user experience, but they are not security boundaries. The backend remains responsible for authorization, ownership checks, role validation, payment verification, and fulfillment state.

## Main routes

| Route | Description |
| --- | --- |
| `/` | Storefront landing page |
| `/products` | Product search and listing |
| `/product/[productId]` | Product details |
| `/gift-cards` | Gift-card catalog |
| `/gift-cards/[id]` | Gift-card details and purchase flow |
| `/top-up` | Game top-up catalog |
| `/top-up/[slug]` | Package selection and player information |
| `/cart` | Customer cart |
| `/wishlist` | Locally persisted wishlist |
| `/profile` | Customer account |
| `/profile/gift-card-orders` | Gift-card order history |
| `/profile/game-topup-orders` | Game top-up order history |
| `/payment/*` | Payment return and result screens |
| `/admin/*` | Role-protected administration |

## Deployment on Vercel

1. Import the repository into Vercel.
2. Use the default Next.js build settings.
3. Configure the production environment variable:

   ```dotenv
   NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
   ```

4. Deploy the application.
5. Allow the deployed frontend origin in the backend's credentialed CORS configuration.
6. Ensure production cookies use appropriate `Secure`, `SameSite`, domain, and HTTPS settings.

Production configuration must be supplied through Vercel; source code should not contain environment-specific backend URLs.

## Testing

Tests cover authentication, route authorization, navigation, API mapping, gift-card inventory and checkout, game top-ups, payment states, and shared formatting behavior.

Test files are colocated with the modules they verify and use the `.test.ts` or `.test.tsx` suffix.

## Known backend constraints

- General checkout cannot create a new order with the currently available backend contract.
- Customer payment history is unavailable; the backend supports lookup by payment ID.
- Payment checkout redirects to a backend-created URL; the frontend never contacts the gateway directly.
- Some catalog operations require hosted image URLs because multipart support is incomplete.
- Some admin list endpoints return complete arrays and therefore use client-side pagination.
- Review moderation and a general-purpose secure inventory API are not currently exposed.

The frontend displays explicit unavailable states for unsupported operations instead of creating local records that could diverge from backend state.

## Additional documentation

- [API integration report](docs/api-integration-report.md)
- [Admin API contract](docs/admin-api-contract.md)
- [Gift-card implementation report](docs/gift-card-implementation-report.md)
- [Known backend gaps](docs/backend-gaps.md)

## Contribution guidelines

- Preserve the established architecture and `@/` import alias.
- Search for an existing component, hook, service, type, or utility before creating one.
- Keep backend access inside the central API and domain-service layers.
- Keep server state in TanStack Query and local UI state close to its component.
- Do not expose secrets or persist sensitive gift-card or payment data in browser storage.
- Add focused tests when changing shared or business-critical behavior.
- Run `npm run check` and `npm run build` before submitting changes.
