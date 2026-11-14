export interface UserSessionDTO {
  id: string;
  sessionToken: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  isCurrent: boolean;
  lastActive: string;
  createdAt: string;
  expiresAt: string;
}

export interface AdminSessionDTO extends UserSessionDTO {
  userId: string;
  userEmail: string;
  userRole: "ADMIN" | "USER";
  username: string;
}
