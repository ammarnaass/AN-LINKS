export interface FinancialFeedback {
  type: "success" | "error";
  message: string;
}

export interface FinancialActionCallbacks {
  setIsSaving?: (saving: boolean) => void;
  setError?: (error: string | null) => void;
  setFeedback?: (feedback: FinancialFeedback | null) => void;
}
