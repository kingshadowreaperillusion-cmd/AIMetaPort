import { Character, ExportFormat } from "@shared/schema";
import { convertToFormat } from "../../client/src/lib/character-formats";

export function convertCharacter(character: Partial<Character>, format: ExportFormat) {
  if (!character.name || !character.personality) {
    throw new Error("Character name and personality are required for conversion");
  }

  const fullCharacter: Character = {
    name: character.name,
    description: character.description || '',
    personality: character.personality,
    scenario: character.scenario || '',
    firstMessage: character.firstMessage || '',
    examples: character.examples || '',
    avatar: character.avatar || '',
  };

  return convertToFormat(fullCharacter, format);
}
