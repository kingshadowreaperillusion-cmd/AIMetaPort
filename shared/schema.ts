import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Character schema for AI character conversion
export const characterSchema = z.object({
  name: z.string().min(1, "Character name is required").max(100, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  personality: z.string().min(1, "Personality is required").max(2000, "Personality too long"),
  scenario: z.string().max(1500, "Scenario too long").optional(),
  firstMessage: z.string().max(1000, "First message too long").optional(),
  examples: z.string().max(3000, "Examples too long").optional(),
  avatar: z.string().optional(), // Base64 encoded image
});

export type Character = z.infer<typeof characterSchema>;

// Export format types
export const exportFormatSchema = z.enum(["tavernai", "pygmalion", "characterai", "textgeneration", "meta"]);
export type ExportFormat = z.infer<typeof exportFormatSchema>;

// Conversion request schema
export const conversionRequestSchema = z.object({
  character: characterSchema,
  format: exportFormatSchema,
  includeAvatar: z.boolean().default(true),
});

export type ConversionRequest = z.infer<typeof conversionRequestSchema>;

// Character validation result
export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  tokenCount: z.number(),
});

export type ValidationResult = z.infer<typeof validationResultSchema>;
