import { apiData, queryString } from "@/lib/api";
import type {
  Category,
  DigitalProduct,
  GameTopUpProduct,
  GiftCardProduct,
  Paginated,
  ProductListQuery,
  Review,
  SubscriptionProduct,
} from "@/types/api";

export type CatalogQuery = Omit<ProductListQuery, "type" | "productType">;

function tagPage<T extends object, K extends string>(
  page: Paginated<T>,
  productType: K,
): Paginated<T & { productType: K }> {
  return { ...page, data: page.data.map((product) => ({ ...product, productType })) };
}

export const publicService = {
  products(query?: ProductListQuery) {
    return apiData<Paginated<DigitalProduct>>(`/products${queryString(query)}`);
  },

  product(idOrSlug: string) {
    return apiData<DigitalProduct>(`/products/${encodeURIComponent(idOrSlug)}`);
  },

  async giftCards(query?: CatalogQuery) {
    const page = await apiData<Paginated<Omit<GiftCardProduct, "productType">>>(
      `/gift-cards${queryString(query)}`,
    );
    return tagPage(page, "GIFT_CARD" as const);
  },

  async giftCard(idOrSlug: string) {
    const product = await apiData<Omit<GiftCardProduct, "productType">>(
      `/gift-cards/${encodeURIComponent(idOrSlug)}`,
    );
    return { ...product, productType: "GIFT_CARD" as const };
  },

  async topUps(query?: CatalogQuery) {
    const page = await apiData<Paginated<Omit<GameTopUpProduct, "productType">>>(
      `/top-ups${queryString(query)}`,
    );
    return tagPage(page, "GAME_TOP_UP" as const);
  },

  async topUp(idOrSlug: string) {
    const product = await apiData<Omit<GameTopUpProduct, "productType">>(
      `/top-ups/${encodeURIComponent(idOrSlug)}`,
    );
    return { ...product, productType: "GAME_TOP_UP" as const };
  },

  async subscriptions(query?: CatalogQuery) {
    const page = await apiData<Paginated<Omit<SubscriptionProduct, "productType">>>(
      `/subscriptions${queryString(query)}`,
    );
    return tagPage(page, "SUBSCRIPTION" as const);
  },

  async subscription(idOrSlug: string) {
    const product = await apiData<Omit<SubscriptionProduct, "productType">>(
      `/subscriptions/${encodeURIComponent(idOrSlug)}`,
    );
    return { ...product, productType: "SUBSCRIPTION" as const };
  },

  categories() {
    return apiData<Category[]>("/categories");
  },

  reviews(productId: string) {
    return apiData<Review[]>(`/review/product/${encodeURIComponent(productId)}`);
  },
};
