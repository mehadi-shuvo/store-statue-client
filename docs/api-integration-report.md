# API integration report

Verified against the Node/Express/TypeScript/Prisma backend in `/home/shuvo/Projects/Ontor/server` on 2026-08-12.

## Configuration and authentication

- Preferred environment variable: `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`.
- `NEXT_PUBLIC_API_BASE_URL` remains a temporary compatibility fallback.
- The base URL is validated as absolute HTTP(S), normalized to exactly one `/api/v1` suffix, and request paths cannot override it with an absolute URL.
- Browser requests always use `credentials: "include"`; JSON and `FormData` bodies are detected automatically. Multipart boundaries are left to the browser.
- Optional `bearerToken` is supported for trusted non-browser callers. Browser auth does not read or persist the HTTP-only cookie or JWT.
- A 401 emits one unauthorized event. Auth state is cleared and the user is sent to the customer or admin login page. Session restoration suppresses redirect while probing `/user/profile` and `/admins/profile`.
- Role guards support `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`, and `STAFF`; admin authorization in the UI is limited to `ADMIN`/`SUPER_ADMIN`, and sensitive management UI can require `SUPER_ADMIN`.

## Endpoint coverage

| Area | Covered endpoints |
| --- | --- |
| Auth/profile | Register, login, logout, forgot/reset password, customer profile get/update/delete, admin profile get/update/password |
| Public catalog | Combined products, gift cards, top-ups, subscriptions, categories, product reviews |
| Customer cart/reviews | Cart get/add/update/remove/clear and review create/update/delete |
| Customer payments | Create, execute (optional local mock scenario), status by payment ID |
| Admin people | User list/detail/status/issue resolution and admin create/list/detail/update/deactivate/restore |
| Admin commerce | Orders list/detail/status, delivery list/update, payments list/detail/verify |
| Admin catalog | Digital products/overview, generic product create/bulk/update/delete, direct type mutations, category create/bulk/update/delete |
| Admin operations | Sales statistics, audit logs, and filtered application logs |

TanStack Query hooks are grouped under `src/hooks/api`. Every mutation invalidates its affected profile, cart, catalog, review, payment, admin list/detail, statistics, or audit-log keys.

## Error and state handling

`ApiError` normalizes response messages, HTTP status, field-level validation details, retry timing, and retryability. Shared components cover loading, empty, generic error, unauthorized, forbidden, rate-limited, and retry states. Query retries are disabled for non-retryable 4xx responses.

## Backend blockers

See [backend-gaps.md](./backend-gaps.md). In particular, checkout and payment-history screens intentionally show unavailable states because the required customer endpoints do not exist.

## Verification commands

The following commands are used for the final verification pass:

```text
npx tsc --noEmit
npm run lint
npm run build
curl --max-time 5 http://localhost:5000/api/v1/categories
curl --max-time 5 'http://localhost:5000/api/v1/products?limit=1'
curl --max-time 5 'http://localhost:5000/api/v1/gift-cards?limit=1'
curl --max-time 5 'http://localhost:5000/api/v1/top-ups?limit=1'
curl --max-time 5 'http://localhost:5000/api/v1/subscriptions?limit=1'
```

The five public probes returned HTTP 200. No authenticated live API test is claimed because test credentials were not provided.
