export interface RegistrationInput {
  email: string;
  password: string;
  username: string;
  displayName: string;
  referralCode?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

