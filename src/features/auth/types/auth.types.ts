export interface RegistrationInput {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
