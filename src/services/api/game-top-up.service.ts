import { apiData, apiRequest, queryString } from "@/lib/api";
import { mapField, mapGame, mapGamePage, mapPackage } from "./game-top-up.mapper";
import type { AccountFieldInput, AdminOrderFilters, AdminTopUpOrder, AdminTopUpQueuePage, CompleteTopUpInput, CreateTopUpOrderResult, CustomerTopUpOrder, CustomerTopUpOrderPage, FailTopUpInput, GameInput, OrderFilters, PackageInput } from "@/types/game-top-up";

export const gameTopUpService = {
  games: (filters?: object) => apiData<unknown>(`/games${queryString(filters)}`).then(mapGamePage),
  game: (slug: string) => apiData<unknown>(`/games/${encodeURIComponent(slug)}`).then(mapGame),
  packages: (gameId: string) => apiData<unknown[]>(`/games/${encodeURIComponent(gameId)}/packages`).then(rows => rows.map(mapPackage)),
  fields: (gameId: string) => apiData<unknown[]>(`/games/${encodeURIComponent(gameId)}/account-fields`).then(rows => rows.map(mapField)),
  createOrder: (gameId: string, packageId: string, accountDetails: Record<string, string>) => apiData<CreateTopUpOrderResult>("/game-topup-orders", { method: "POST", body: { gameId, packageId, accountDetails } }),
  orders: (filters?: OrderFilters) => apiData<CustomerTopUpOrderPage>(`/game-topup-orders${queryString(filters)}`),
  order: (id: string) => apiData<CustomerTopUpOrder>(`/game-topup-orders/${encodeURIComponent(id)}`),
  cancel: (id: string) => apiData<{ orderId: string; status: "CANCELLED"; cancelledAt: string }>(`/game-topup-orders/${encodeURIComponent(id)}/cancel`, { method: "POST" }),
  adminGames: (filters?: object) => apiData<unknown>(`/admin/games${queryString(filters)}`).then(mapGamePage),
  adminGame: (id: string) => apiData<unknown>(`/admin/games/${encodeURIComponent(id)}`).then(mapGame),
  createGame: (input: GameInput) => apiData<unknown>("/admin/games", { method: "POST", body: input }).then(mapGame),
  updateGame: (id: string, input: Partial<GameInput>) => apiData<unknown>(`/admin/games/${encodeURIComponent(id)}`, { method: "PATCH", body: input }).then(mapGame),
  archiveGame: async (id: string) => { await apiRequest(`/admin/games/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  adminPackages: (gameId: string) => apiData<unknown[]>(`/admin/games/${encodeURIComponent(gameId)}/packages`).then(rows => rows.map(mapPackage)),
  createPackage: (gameId: string, input: PackageInput) => apiData<unknown>(`/admin/games/${encodeURIComponent(gameId)}/packages`, { method: "POST", body: input }).then(mapPackage),
  updatePackage: (id: string, input: Partial<PackageInput>) => apiData<unknown>(`/admin/game-topup-packages/${encodeURIComponent(id)}`, { method: "PATCH", body: input }).then(mapPackage),
  deactivatePackage: async (id: string) => { await apiRequest(`/admin/game-topup-packages/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  adminFields: (gameId: string) => apiData<unknown[]>(`/admin/games/${encodeURIComponent(gameId)}/account-fields`).then(rows => rows.map(mapField)),
  createField: (gameId: string, input: AccountFieldInput) => apiData<unknown>(`/admin/games/${encodeURIComponent(gameId)}/account-fields`, { method: "POST", body: input }).then(mapField),
  updateField: (id: string, input: Partial<AccountFieldInput>) => apiData<unknown>(`/admin/game-account-fields/${encodeURIComponent(id)}`, { method: "PATCH", body: input }).then(mapField),
  deactivateField: async (id: string) => { await apiRequest(`/admin/game-account-fields/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  adminOrders: (filters?: AdminOrderFilters) => apiData<AdminTopUpQueuePage>(`/admin/game-topup-orders${queryString(filters)}`),
  adminOrder: (id: string) => apiData<AdminTopUpOrder>(`/admin/game-topup-orders/${encodeURIComponent(id)}`),
  start: (id: string) => apiData<AdminTopUpOrder>(`/admin/game-topup-orders/${encodeURIComponent(id)}/start`, { method: "POST" }),
  complete: (id: string, input: CompleteTopUpInput) => apiData<AdminTopUpOrder>(`/admin/game-topup-orders/${encodeURIComponent(id)}/complete`, { method: "POST", body: input }),
  fail: (id: string, input: FailTopUpInput) => apiData<{ orderId: string; status: "FAILED" }>(`/admin/game-topup-orders/${encodeURIComponent(id)}/fail`, { method: "POST", body: input }),
};
