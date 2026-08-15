# Ontor admin API contract

The client reads `NEXT_PUBLIC_API_URL` (with temporary `NEXT_PUBLIC_API_BASE_URL` compatibility) and normalizes requests to the canonical `/api/v1` prefix. The environment value may be either the backend origin (for example `https://api.example.com`) or an origin already ending in `/api/v1`.

Every request includes `credentials: "include"`. Authentication relies exclusively on the backend-managed HTTP-only `accessToken` cookie; no token is persisted in browser-readable storage.

Successful responses are expected as `{ success, message, data }`. Failed responses may include `{ success: false, statusCode, message, details }`. Decimal money values remain strings at the API boundary and are formatted only for display.

## Active resource groups

- Session: `POST /user/login`, admin profile and password under `/admins/profile`.
- Dashboard: `/admins/stats/sales`, `/admins/digital-products/overview`, orders, delivery items, and payments.
- Catalog: `/gift-cards`, `/top-ups`, `/subscriptions`, and `/categories`.
- Commerce: `/admins/orders`, `/admins/delivery/items`, and `/admins/payments`.
- People: `/admins/users` and `/admins`.
- Monitoring: `/admins/audit-logs` and `/admins/logs`.

Mutations that archive products, change account status, fulfill delivery, verify payments, or administer other admins require an explicit UI confirmation. The server remains authoritative for all permissions.

## Client safety rules

- A 401 ends the local session view and routes to login.
- A 403 renders the permission-denied experience without a redirect loop.
- Gift-card secrets and sensitive customer inputs are never rendered in list views.
- Payment provider payloads belong in a collapsed structured viewer, never the default table.
- Password fields are reset after every request attempt.
