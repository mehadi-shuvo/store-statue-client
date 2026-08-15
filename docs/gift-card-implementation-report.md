# Gift card implementation report

## A. Existing frontend architecture discovered

- Next.js 15 App Router with React 19 and strict TypeScript.
- Cookie-authenticated API requests through `src/lib/api.ts`; every central request uses `credentials: "include"` and normalizes `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_API_BASE_URL` to `/api/v1`.
- Customer/admin session restoration through `AuthContext`; server-enforced permissions remain authoritative.
- TanStack Query v5 for server state, React contexts for auth/cart/wishlist/toasts, Tailwind CSS 4 with DaisyUI, Lucide icons, and shared API/admin state components.
- Existing shared cart code targets the older `/user-cart` resource. Gift cards now use the requested `/cart` resource without deleting the legacy context used by other digital products.
- No frontend test runner existed. Vitest, Testing Library, jest-dom, and jsdom were added for focused behavior and contract tests.

## B. Files created

- `src/types/gift-card.ts`
- `src/lib/gift-card.ts` and `src/lib/gift-card.test.ts`
- `src/services/api/gift-card.service.ts` and its contract test
- `src/hooks/api/use-gift-card-api.ts` and query-key test
- Customer catalog/detail, delivery-email, and secure order-detail components and tests under `src/components/gift-card/`
- Customer order routes under `src/app/profile/gift-card-orders/`
- Admin product, denomination, inventory, and order components under `src/components/admin/gift-card/`
- Admin routes under `src/app/(admin)/admin/gift-cards/`, `gift-card-inventory/`, and `gift-card-orders/`
- `src/test/setup.ts` and `vitest.config.mts`

## C. Files modified

- `package.json` and `package-lock.json`
- Public gift-card routes under `src/app/gift-cards/`
- `src/app/cart/page.tsx` and `src/app/profile/page.tsx`
- `src/components/NavbarNew.tsx` and `src/components/admin/AdminShell.tsx`
- `src/context/AuthContext.tsx`
- `src/hooks/api/query-keys.ts`

## D. Customer pages and workflow

- `/gift-cards`: debounced search, brand and BDT price filters, backend pagination, responsive cards, lowest stocked price, skeletons, empty/retry states, and all-denominations-out-of-stock handling.
- `/gift-cards/:slug`: real detail API, responsive image/details layout, first-stocked auto-selection, disabled unavailable denominations, popular badges, exact BDT and face-value display, instructions/terms, add to cart, and instant buy.
- `/cart`: authenticated server cart, quantity/remove/clear operations, current prices, stock revalidation, delivery-email selection, and authoritative checkout order navigation.
- `/profile/gift-card-orders` and detail: owned order list, non-sensitive summaries, payment/delivery status, and secure delivered-code reveal/copy.
- A completed development-fulfilled order with `paymentStatus: PENDING` is explicitly labeled pending/manual-development fulfillment and never presented as payment success.

## E. Admin pages and workflow

- `/admin/gift-cards`: paginated searchable/filterable table, create/edit/detail, image preview, active/featured fields, and archive confirmation/language.
- Dedicated denomination management with string decimals, active/popular controls, per-status stock counts, edit, and deactivate confirmation.
- `/admin/gift-card-inventory`: summary totals, low-stock navigation, status/expiry filters, masked list, single/bulk insertion, in-form duplicate detection, 500-row limit, explicit privileged detail, and server-confirmed status/delete actions.
- Invalid inventory transitions are not offered; sold inventory is immutable and sold/reserved delete buttons are disabled.
- `/admin/gift-card-orders`: server pagination, order/payment/date/email/order-number filters, non-sensitive table, and privileged detail with explicit secret reveal.

## F. API integration layer

- A typed gift-card service implements the public, customer, cart, order, admin product, denomination, inventory, and admin-order endpoints from the supplied contract.
- Request bodies preserve monetary values as decimal strings.
- `gift-card.ts` centralizes business-code mapping, display-only money formatting, decimal-string comparison, image fallback, validation, and masking.
- No gift-card inventory code is expected by public catalog/detail types or components.

## G. Authentication and authorization behavior

- Existing HTTP-only cookie sessions and `credentials: "include"` are reused; no bearer-token or browser token storage was introduced.
- Customer order/cart routes require `CUSTOMER`.
- Gift-card admin screens allow only `ADMIN` and `SUPER_ADMIN`, with backend profile checks through the protected admin shell.
- A 401 continues to clear the client session and route to the appropriate login.

## H. Sensitive-code protections

- Codes are absent from list types/views and hidden by default in owned/admin order detail.
- Reveal is explicit; copy feedback says only `Copied` and never repeats the secret.
- No gift-card secret is logged, put in a URL, placed in a toast, or saved to local/session storage.
- Bulk/single code state is cleared on success or cancellation.
- Secret-bearing order/code queries use `staleTime: 0`, `gcTime: 0`, no retry, a dedicated `sensitive` key prefix, and are removed on logout/session clearing.
- No query persistence provider is configured.

## I. Query caching and invalidation

- Central keys cover catalog list/detail, cart, customer orders, admin products/details, denominations, inventory/summary, and admin orders.
- Mutations invalidate only affected public/admin/cart/order/stock prefixes.
- Purchase/checkout invalidates public stock, cart, order history, and legacy cart keys.

## J. Responsive and accessibility improvements

- Mobile-first grids/cards with horizontal table fallbacks, sticky desktop summaries, labeled controls, semantic fieldsets/dialogs, focus states, keyboard Escape handling, `aria-pressed`, disabled states, live loading/error status, and confirmation dialogs.
- Duplicate submissions are blocked through mutation/loading-disabled controls.
- Reduced-motion behavior continues to come from the existing global stylesheet.

## K. Tests and results

- Added 9 test files / 19 passing tests.
- Coverage includes catalog output and lowest price, public-code absence, out-of-stock denomination disabling, denomination price changes, cart action, account/custom delivery email validation, pending-submit protection, business-error mapping, non-admin denial, secure reveal/copy, pending-payment wording, decimal-string payloads, product CRUD endpoint methods, cart/instant-buy payloads, inventory single/bulk parsing and filters, duplicate masking, sold transition rules, admin-order filters, and sensitive query-key separation.

## L. Typecheck, lint, test, and build results

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with no warnings.
- `npm test`: passed, 9 files / 19 tests.
- `npm run build`: passed; 44 routes generated. DaisyUI emitted one non-blocking CSS optimizer warning for the standards-based `@property` rule.
- An npm advisory refresh could not be completed because registry access was unavailable/rejected in the execution environment. The dependency install reported 11 advisories in the full dependency tree, so CI should run its approved lockfile security scan.

## M. Backend contract mismatches

- No confirmed backend mismatch was found from the supplied contract, and no backend files were changed.
- Authenticated live API verification was not possible without a running authenticated backend session/test credentials.
- The contract does not fully enumerate `GET /cart` item fields or the admin list/stock-summary response objects. The client accepts the stated product/denomination shapes and keeps cart presentation tolerant of optional nested product fields; these should be confirmed in an authenticated staging smoke test.
- The existing application also retains an older `/user-cart` client for non-gift-card digital products. The new gift-card cart follows `/cart`; the navbar prefers its server quantity when available while preserving the legacy fallback.

## N. Remaining payment/email production work

- Replace the development console delivery provider with a production email/fulfillment provider on the backend.
- Connect the order to the production payment provider and update the payment lifecycle from `PENDING` only after backend verification/webhooks.
- Add staging smoke tests with customer/admin credentials for purchase, checkout, stock contention, ownership denial, code fulfillment, and email receipt.
- Consider production operations for email retries, bounce handling, secure resend/support, reconciliation, and payment/fulfillment alerting.
