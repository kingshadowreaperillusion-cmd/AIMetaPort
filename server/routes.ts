import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { convertCharacter } from "./services/character-converter";
import { generateCharacterCard } from "./services/png-generator";
import { conversionRequestSchema } from "@shared/schema";
import { z } from "zod";

const exportRequestSchema = conversionRequestSchema.extend({
  exportType: z.enum(['json', 'png']),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Character conversion endpoint
  app.post("/api/convert", async (req, res) => {
    try {
      const data = exportRequestSchema.parse(req.body);
      
      if (data.exportType === 'png') {
        // Generate PNG character card
        const pngBuffer = await generateCharacterCard(data.character, data.format);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${data.character.name || 'character'}-${data.format}.png"`);
        res.send(pngBuffer);
      } else {
        // Return JSON conversion
        const converted = convertCharacter(data.character, data.format);
        res.json(converted);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Conversion failed' 
      });
    }
  });

  // Character validation endpoint
  app.post("/api/validate", async (req, res) => {
    try {
      const { character } = req.body;
      const validation = storage.validateCharacter(character);
      res.json(validation);
    } catch (error) {
      console.error('Validation error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Validation failed' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
