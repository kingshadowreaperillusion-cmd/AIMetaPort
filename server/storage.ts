import { Character, ValidationResult } from "@shared/schema";
import { validateCharacter } from "../client/src/lib/character-validation";

export interface IStorage {
  validateCharacter(character: Partial<Character>): ValidationResult;
  // Future: Store conversion history
  // saveConversion(conversion: ConversionHistory): Promise<void>;
  // getConversions(): Promise<ConversionHistory[]>;
}

export class MemStorage implements IStorage {
  constructor() {
    // No persistent storage needed for this app
  }

  validateCharacter(character: Partial<Character>): ValidationResult {
    return validateCharacter(character);
  }
}

export const storage = new MemStorage();
