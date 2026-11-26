export type CommissionStatus = "ESCROW" | "CLEARED" | "PAID";

export interface AffiliateAttributionResult {
  attributed: boolean;
  referrerId?: string;
  reason?: string;
}

export interface SubscriptionCommissionInput {
  invoiceId: string;
  subscriptionId: string;
  buyerUserId: string;
  invoiceAmount: number;
  planSlug: string;
}

export interface CreatorAffiliateSummary {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  escrowBalance: number;
  clearedBalance: number;
  paidBalance: number;
  commissionRate: number;
}
