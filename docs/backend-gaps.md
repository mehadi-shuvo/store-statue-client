# Backend gaps affecting the client

Verified against `/home/shuvo/Projects/Ontor/server` on 2026-09-14.

- Gift-card Buy Now and cart checkout create an order and return a backend-created aamarPay payment URL. Generic payment initiation requires only an existing customer-owned `orderId`.
- There is no generic customer payment-history endpoint. Gift-card and game top-up order history are available through their dedicated customer routes.
- Generic multipart upload writes the uploaded primary image to `thumbnail`, but `game-top-up.service.ts` does not map `thumbnail` to `logo`. New game top-ups therefore need a hosted `logo` URL until the backend mapping is added.
- Direct gift-card, top-up, and subscription mutation routes do not install multipart middleware. They accept JSON and image URLs; file uploads must use the generic `/products` route.
- Category mutations do not accept or upload an image/icon, even though the Prisma category model has an `image` column.
- Admin list routes return complete arrays rather than server-pagination metadata. Admin tables must paginate locally or the backend must add pagination.
- There is no review-moderation API and no secure admin API for gift-card code inventory/assignment.
- Product-type mutation services validate business fields manually and accept permissive records rather than strict request DTO schemas. The client mirrors known constraints for UX, but the backend remains authoritative.
