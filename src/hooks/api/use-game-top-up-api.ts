"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gameTopUpService } from "@/services/api/game-top-up.service";
import type { AccountFieldInput, AdminOrderFilters, GameInput, OrderFilters, PackageInput } from "@/types/game-top-up";

export const gameTopUpKeys = {
  all: ["game-topups"] as const,
  publicGames: () => ["game-topups", "public", "games"] as const,
  publicGameList: (filters?: object) => [...gameTopUpKeys.publicGames(), filters ?? {}] as const,
  publicGame: (slug: string) => ["game-topups", "public", "game", slug] as const,
  adminGames: () => ["game-topups", "admin", "games"] as const,
  adminGameList: (filters?: object) => ["game-topups", "admin", "games", filters ?? {}] as const,
  adminGame: (id: string) => ["game-topups", "admin", "game", id] as const,
  packages: (id: string) => ["game-topups", "admin", "packages", id] as const,
  fields: (id: string) => ["game-topups", "admin", "fields", id] as const,
  orders: () => ["game-topups", "admin", "orders"] as const,
  customerOrders: () => ["game-topups", "customer", "orders"] as const,
  customerOrderList: (filters?: object) => ["game-topups", "customer", "orders", filters ?? {}] as const,
  customerOrder: (id: string) => ["game-topups", "customer", "order", id] as const,
  orderList: (filters?: object) => ["game-topups", "admin", "orders", filters ?? {}] as const,
};
export const usePublicGames = (filters?: object) => useQuery({ queryKey: gameTopUpKeys.publicGameList(filters), queryFn: () => gameTopUpService.games(filters), placeholderData: previous => previous });
export const usePublicGame = (slug: string) => useQuery({ queryKey: gameTopUpKeys.publicGame(slug), queryFn: () => gameTopUpService.game(slug), enabled: Boolean(slug) });
export function useCreateTopUpOrder() { const c = useQueryClient(); return useMutation({ mutationFn: ({ gameId, packageId, accountDetails }: { gameId: string; packageId: string; accountDetails: Record<string, string> }) => gameTopUpService.createOrder(gameId, packageId, accountDetails), onSuccess: () => c.invalidateQueries({ queryKey: gameTopUpKeys.customerOrders() }) }); }
export const useCustomerTopUpOrders = (filters?: OrderFilters) => useQuery({ queryKey: gameTopUpKeys.customerOrderList(filters), queryFn: () => gameTopUpService.orders(filters), placeholderData: previous => previous });
export const useCustomerTopUpOrder = (id: string) => useQuery({ queryKey: gameTopUpKeys.customerOrder(id), queryFn: () => gameTopUpService.order(id), enabled: Boolean(id), staleTime: 0 });
export const useAdminGames = (filters?: object) => useQuery({ queryKey: gameTopUpKeys.adminGameList(filters), queryFn: () => gameTopUpService.adminGames(filters), placeholderData: previous => previous });
export const useAdminGame = (id: string) => useQuery({ queryKey: gameTopUpKeys.adminGame(id), queryFn: () => gameTopUpService.adminGame(id), enabled: Boolean(id) });
export function useSaveGame() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id?: string; input: GameInput }) => id ? gameTopUpService.updateGame(id, input) : gameTopUpService.createGame(input), onSuccess: (_, v) => Promise.all([c.invalidateQueries({ queryKey: gameTopUpKeys.adminGames() }), c.invalidateQueries({ queryKey: gameTopUpKeys.publicGames() }), ...(v.id ? [c.invalidateQueries({ queryKey: gameTopUpKeys.adminGame(v.id) })] : [])]) }); }
export function useArchiveGame() { const c = useQueryClient(); return useMutation({ mutationFn: gameTopUpService.archiveGame, onSuccess: () => Promise.all([c.invalidateQueries({ queryKey: gameTopUpKeys.adminGames() }), c.invalidateQueries({ queryKey: gameTopUpKeys.publicGames() })]) }); }
export const useAdminPackages = (id: string) => useQuery({ queryKey: gameTopUpKeys.packages(id), queryFn: () => gameTopUpService.adminPackages(id), enabled: Boolean(id) });
export function useSavePackage(gameId: string) { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id?: string; input: PackageInput }) => id ? gameTopUpService.updatePackage(id, input) : gameTopUpService.createPackage(gameId, input), onSuccess: () => Promise.all([c.invalidateQueries({ queryKey: gameTopUpKeys.packages(gameId) }), c.invalidateQueries({ queryKey: gameTopUpKeys.adminGame(gameId) }), c.invalidateQueries({ queryKey: gameTopUpKeys.publicGames() })]) }); }
export function useDeactivatePackage(gameId: string) { const c = useQueryClient(); return useMutation({ mutationFn: gameTopUpService.deactivatePackage, onSuccess: () => Promise.all([c.invalidateQueries({ queryKey: gameTopUpKeys.packages(gameId) }), c.invalidateQueries({ queryKey: gameTopUpKeys.adminGame(gameId) })]) }); }
export const useAdminFields = (id: string) => useQuery({ queryKey: gameTopUpKeys.fields(id), queryFn: () => gameTopUpService.adminFields(id), enabled: Boolean(id) });
export function useSaveField(gameId: string) { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id?: string; input: AccountFieldInput }) => id ? gameTopUpService.updateField(id, input) : gameTopUpService.createField(gameId, input), onSuccess: () => Promise.all([c.invalidateQueries({ queryKey: gameTopUpKeys.fields(gameId) }), c.invalidateQueries({ queryKey: gameTopUpKeys.adminGame(gameId) })]) }); }
export function useDeactivateField(gameId: string) { const c = useQueryClient(); return useMutation({ mutationFn: gameTopUpService.deactivateField, onSuccess: () => Promise.all([c.invalidateQueries({ queryKey: gameTopUpKeys.fields(gameId) }), c.invalidateQueries({ queryKey: gameTopUpKeys.adminGame(gameId) })]) }); }
export const useAdminTopUpOrders = (filters?: AdminOrderFilters) => useQuery({ queryKey: gameTopUpKeys.orderList(filters), queryFn: () => gameTopUpService.adminOrders(filters), placeholderData: previous => previous });
