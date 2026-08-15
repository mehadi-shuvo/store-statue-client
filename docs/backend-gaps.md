# Backend gaps affecting the client

Verified against `/home/shuvo/Projects/Ontor/server` on 2026-08-12.

- There is no authenticated customer order-creation or checkout endpoint. `POST /payments/create` requires an existing customer-owned order ID and an amount exactly matching that order, so the client does not fabricate checkout or derive an order from the cart.
- There is no customer order-list or payment-history endpoint. The customer payment API supports only create, execute, and status-by-provider-payment-ID.
- The mock bKash provider returns `http://localhost:5000/mock/bkash/pay/:paymentId`, but the Express app does not register that route. A locally created mock payment therefore has no browser payment page/redirect flow.
- Generic multipart upload writes the uploaded primary image to `thumbnail`, but `game-top-up.service.ts` does not map `thumbnail` to `logo`. New game top-ups therefore need a hosted `logo` URL until the backend mapping is added.
- Direct gift-card, top-up, and subscription mutation routes do not install multipart middleware. They accept JSON and image URLs; file uploads must use the generic `/products` route.
- Category mutations do not accept or upload an image/icon, even though the Prisma category model has an `image` column.
- Admin list routes return complete arrays rather than server-pagination metadata. Admin tables must paginate locally or the backend must add pagination.
- There is no review-moderation API and no secure admin API for gift-card code inventory/assignment.
- Product-type mutation services validate business fields manually and accept permissive records rather than strict request DTO schemas. The client mirrors known constraints for UX, but the backend remains authoritative.
