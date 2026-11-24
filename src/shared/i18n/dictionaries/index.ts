import { Locale } from "../types/i18n.types";
import { ar } from "./ar";
import { en } from "./en";
import { fr } from "./fr";

export { ar, en, fr };

export const DICTIONARIES = { ar, en, fr } as const;

export type Dictionary = typeof ar;

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] || DICTIONARIES.ar;
}
