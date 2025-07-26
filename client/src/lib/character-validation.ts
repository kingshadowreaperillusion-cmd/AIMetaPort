import { Character, ValidationResult } from "@shared/schema";
import { estimateTokenCount } from "./character-formats";

export function validateCharacter(character: Partial<Character>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!character.name || character.name.trim().length === 0) {
    errors.push("Character name is required");
  }

  if (!character.personality || character.personality.trim().length === 0) {
    errors.push("Character personality is required");
  }

  // Length validations
  if (character.name && character.name.length > 100) {
    errors.push("Character name is too long (max 100 characters)");
  }

  if (character.description && character.description.length > 1000) {
    errors.push("Description is too long (max 1000 characters)");
  }

  if (character.personality && character.personality.length > 2000) {
    errors.push("Personality is too long (max 2000 characters)");
  }

  if (character.scenario && character.scenario.length > 1500) {
    errors.push("Scenario is too long (max 1500 characters)");
  }

  if (character.firstMessage && character.firstMessage.length > 1000) {
    errors.push("First message is too long (max 1000 characters)");
  }

  if (character.examples && character.examples.length > 3000) {
    errors.push("Examples are too long (max 3000 characters)");
  }

  // Warnings for missing optional but recommended fields
  if (!character.description || character.description.trim().length === 0) {
    warnings.push("Consider adding a description to provide more context about the character");
  }

  if (!character.scenario || character.scenario.trim().length === 0) {
    warnings.push("Adding a scenario can improve character interactions");
  }

  if (!character.firstMessage || character.firstMessage.trim().length === 0) {
    warnings.push("A first message helps establish the character's voice");
  }

  if (!character.examples || character.examples.trim().length === 0) {
    warnings.push("Example dialogues help the AI understand the character's speaking style");
  }

  // Token count validation
  const tokenCount = estimateTokenCount(character);
  if (tokenCount > 2048) {
    warnings.push(`Token count (${tokenCount}) exceeds recommended limit of 2048 tokens`);
  }

  // Format validation for examples
  if (character.examples) {
    const hasCharPlaceholder = character.examples.includes('{{char}}');
    const hasUserPlaceholder = character.examples.includes('{{user}}');
    
    if (!hasCharPlaceholder && !hasUserPlaceholder) {
      warnings.push("Consider using {{char}} and {{user}} placeholders in example dialogues");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    tokenCount,
  };
}
