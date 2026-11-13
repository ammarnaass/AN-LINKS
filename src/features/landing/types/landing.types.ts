export interface ClaimResult {
  username: string;
  isValid: boolean;
  targetUrl: string;
  error?: string;
}
