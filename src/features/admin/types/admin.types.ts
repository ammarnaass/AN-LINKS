export interface AdminUserItem {
  id: string;
  email: string;
  username: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  displayName: string;
  linksCount: number;
  reportsCount: number;
}

export interface AdminUsersQuery {
  search?: string;
  status?: "all" | "active" | "suspended";
}

export interface SuspendUserInput {
  isSuspended: boolean;
}

export interface ReportUpdateInput {
  status: "RESOLVED" | "DISMISSED";
}

export interface AdminReportItem {
  id: string;
  username: string;
  reason: string;
  details: string | null;
  reporterIp: string | null;
  status: string;
  createdAt: string;
}

