"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService, type CatalogQuery } from "@/services/api/public.service";
import type { ProductListQuery } from "@/types/api";
import { apiKeys } from "./query-keys";

export function useProducts(query?: ProductListQuery) {
  return useQuery({ queryKey: [...apiKeys.products, query], queryFn: () => publicService.products(query) });
}

export function useProduct(idOrSlug: string) {
  return useQuery({ queryKey: apiKeys.product(idOrSlug), queryFn: () => publicService.product(idOrSlug), enabled: Boolean(idOrSlug) });
}

export function useGiftCards(query?: CatalogQuery) {
  return useQuery({ queryKey: [...apiKeys.giftCards, query], queryFn: () => publicService.giftCards(query) });
}

export function useGiftCard(idOrSlug: string) {
  return useQuery({ queryKey: [...apiKeys.giftCards, idOrSlug], queryFn: () => publicService.giftCard(idOrSlug), enabled: Boolean(idOrSlug) });
}

export function useTopUps(query?: CatalogQuery) {
  return useQuery({ queryKey: [...apiKeys.topUps, query], queryFn: () => publicService.topUps(query) });
}

export function useTopUp(idOrSlug: string) {
  return useQuery({ queryKey: [...apiKeys.topUps, idOrSlug], queryFn: () => publicService.topUp(idOrSlug), enabled: Boolean(idOrSlug) });
}

export function useSubscriptions(query?: CatalogQuery) {
  return useQuery({ queryKey: [...apiKeys.subscriptions, query], queryFn: () => publicService.subscriptions(query) });
}

export function useSubscription(idOrSlug: string) {
  return useQuery({ queryKey: [...apiKeys.subscriptions, idOrSlug], queryFn: () => publicService.subscription(idOrSlug), enabled: Boolean(idOrSlug) });
}

export function useCategories() {
  return useQuery({ queryKey: apiKeys.categories, queryFn: publicService.categories });
}

export function useProductReviews(productId: string) {
  return useQuery({ queryKey: apiKeys.reviews(productId), queryFn: () => publicService.reviews(productId), enabled: Boolean(productId) });
}
