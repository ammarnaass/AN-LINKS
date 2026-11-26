import {
  FinancialOverviewStats,
  AdminGatewayDetails,
  UpdateGatewayInput,
  AdminSubscriptionPlanItem,
  UpsertPlanInput,
  AdminPlanQuotaConfig,
  AdminCurrencyItem,
  UpdateCurrencyInput,
  CreateCurrencyInput,
  SyncRatesResult,
  AdminCouponItem,
  CreateCouponInput,
  AdminTransactionsQuery,
  AdminTransactionsResult,
} from "../types/admin.types";

// Generic JSON API request handler with automatic JSON parsing and robust error extraction.
async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    headers,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = json?.error || res.statusText || "فشلت العملية";
    throw new Error(errorMsg);
  }

  if (json && typeof json === "object" && "success" in json && json.success === false) {
    throw new Error(json.error || "فشلت العملية");
  }

  if (json && typeof json === "object" && "data" in json && json.data !== undefined) {
    return json.data as T;
  }

  return json as T;
}

// 1. Fetch Financial Overview statistics.
export async function fetchFinancialOverview(): Promise<FinancialOverviewStats> {
  return apiRequest<FinancialOverviewStats>("/api/admin/financials/overview", {
    method: "GET",
  });
}

// 2. Fetch all configured Payment Gateways.
export async function fetchAdminGateways(): Promise<AdminGatewayDetails[]> {
  return apiRequest<AdminGatewayDetails[]>("/api/admin/financials/gateways", {
    method: "GET",
  });
}

// 3. Update or toggle a Payment Gateway.
export async function updateAdminGateway(
  input: UpdateGatewayInput
): Promise<AdminGatewayDetails> {
  return apiRequest<AdminGatewayDetails>("/api/admin/financials/gateways", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

// 4. Fetch all Subscription Plans with multi-currency pricing and quotas.
export async function fetchAdminPlans(): Promise<AdminSubscriptionPlanItem[]> {
  return apiRequest<AdminSubscriptionPlanItem[]>("/api/admin/financials/plans", {
    method: "GET",
  });
}

// 5. Create or update a Subscription Plan.
export async function upsertAdminPlan(
  input: UpsertPlanInput
): Promise<AdminSubscriptionPlanItem> {
  if (input.id) {
    return apiRequest<AdminSubscriptionPlanItem>(
      `/api/admin/financials/plans/${encodeURIComponent(input.id)}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      }
    );
  }

  return apiRequest<AdminSubscriptionPlanItem>("/api/admin/financials/plans", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// 6. Delete or deactivate a Subscription Plan.
export async function deleteAdminPlan(
  id: string
): Promise<{ success: boolean; deactivated?: boolean; message?: string }> {
  return apiRequest<{ success: boolean; deactivated?: boolean; message?: string }>(
    `/api/admin/financials/plans/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

// 7. Update plan quota limits and feature toggles.
export async function updateAdminPlanQuotas(
  planId: string,
  quotas: Partial<AdminPlanQuotaConfig>
): Promise<unknown> {
  return apiRequest("/api/admin/financials/quotas", {
    method: "PUT",
    body: JSON.stringify({ planId, ...quotas }),
  });
}

// 8. Fetch all supported currencies and exchange rates.
export async function fetchAdminCurrencies(): Promise<AdminCurrencyItem[]> {
  return apiRequest<AdminCurrencyItem[]>("/api/admin/financials/currencies", {
    method: "GET",
  });
}

// 9. Update a currency's exchange rate, status, or auto-detect countries.
export async function updateAdminCurrency(
  code: string,
  input: UpdateCurrencyInput
): Promise<AdminCurrencyItem> {
  return apiRequest<AdminCurrencyItem>("/api/admin/financials/currencies", {
    method: "PUT",
    body: JSON.stringify({ ...input, code }),
  });
}

export async function createAdminCurrency(
  input: CreateCurrencyInput
): Promise<AdminCurrencyItem> {
  return apiRequest<AdminCurrencyItem>("/api/admin/financials/currencies", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function syncLiveExchangeRates(): Promise<SyncRatesResult> {
  return apiRequest<SyncRatesResult>("/api/admin/financials/currencies/sync", {
    method: "POST",
  });
}

// 10. Fetch all discount coupons.
export async function fetchAdminCoupons(): Promise<AdminCouponItem[]> {
  return apiRequest<AdminCouponItem[]>("/api/admin/financials/coupons", {
    method: "GET",
  });
}

// 11. Create a new discount coupon.
export async function createAdminCoupon(
  input: CreateCouponInput
): Promise<AdminCouponItem> {
  return apiRequest<AdminCouponItem>("/api/admin/financials/coupons", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// 12. Toggle active state of a discount coupon.
export async function toggleAdminCoupon(
  id: string,
  isActive: boolean
): Promise<AdminCouponItem> {
  return apiRequest<AdminCouponItem>(
    `/api/admin/financials/coupons/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }
  );
}

// 13. Delete a discount coupon.
export async function deleteAdminCoupon(
  id: string
): Promise<{ success: boolean; message?: string }> {
  return apiRequest<{ success: boolean; message?: string }>(
    `/api/admin/financials/coupons/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

// 14. Fetch paginated admin transactions and invoices.
export async function fetchAdminTransactions(
  query?: AdminTransactionsQuery
): Promise<AdminTransactionsResult> {
  const params = new URLSearchParams();
  if (query?.page !== undefined) params.set("page", String(query.page));
  if (query?.limit !== undefined) params.set("limit", String(query.limit));
  if (query?.status) params.set("status", query.status);
  if (query?.gateway) params.set("gateway", query.gateway);

  const qs = params.toString();
  const url = qs
    ? `/api/admin/financials/transactions?${qs}`
    : "/api/admin/financials/transactions";

  return apiRequest<AdminTransactionsResult>(url, {
    method: "GET",
  });
}
