import { Character, ExportFormat } from "@shared/schema";

export interface TavernAICharacter {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  creatorcomment?: string;
  avatar?: string;
  chat?: string;
  talkativeness?: string;
  fav?: boolean;
  spec?: string;
  spec_version?: string;
  data?: {
    name: string;
    description: string;
    personality: string;
    scenario: string;
    first_mes: string;
    mes_example: string;
  };
}

export interface PygmalionCharacter {
  char_name: string;
  char_persona: string;
  char_greeting: string;
  world_scenario: string;
  example_dialogue: string;
}

export interface CharacterAICharacter {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  greeting: string;
  examples: string;
}

export interface TextGenerationCharacter {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_message: string;
  example_dialogues: string;
}

export function convertToFormat(character: Character, format: ExportFormat): any {
  switch (format) {
    case 'tavernai':
      return {
        name: character.name,
        description: character.description || '',
        personality: character.personality,
        scenario: character.scenario || '',
        first_mes: character.firstMessage || '',
        mes_example: character.examples || '',
        creatorcomment: 'Converted from Meta AI Studios',
        avatar: character.avatar || '',
        spec: 'chara_card_v2',
        spec_version: '2.0',
        data: {
          name: character.name,
          description: character.description || '',
          personality: character.personality,
          scenario: character.scenario || '',
          first_mes: character.firstMessage || '',
          mes_example: character.examples || '',
        }
      } as TavernAICharacter;

    case 'pygmalion':
      return {
        char_name: character.name,
        char_persona: character.personality,
        char_greeting: character.firstMessage || 'Hello!',
        world_scenario: character.scenario || '',
        example_dialogue: character.examples || '',
      } as PygmalionCharacter;

    case 'characterai':
      return {
        name: character.name,
        description: character.description || '',
        personality: character.personality,
        scenario: character.scenario || '',
        greeting: character.firstMessage || 'Hello!',
        examples: character.examples || '',
      } as CharacterAICharacter;

    case 'textgeneration':
      return {
        name: character.name,
        description: character.description || '',
        personality: character.personality,
        scenario: character.scenario || '',
        first_message: character.firstMessage || 'Hello!',
        example_dialogues: character.examples || '',
      } as TextGenerationCharacter;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

export function estimateTokenCount(character: Partial<Character>): number {
  const text = [
    character.name || '',
    character.description || '',
    character.personality || '',
    character.scenario || '',
    character.firstMessage || '',
    character.examples || '',
  ].join(' ');

  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
