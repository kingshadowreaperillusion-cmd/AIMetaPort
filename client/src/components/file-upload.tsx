import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Character } from "@shared/schema";
import { Upload, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onCharacterImport: (character: Partial<Character>) => void;
}

export default function FileUpload({ onCharacterImport }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const parseCharacterFile = useCallback(async (file: File): Promise<Partial<Character> | null> => {
    try {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Try to map different formats to our character schema
        if (data.name || data.char_name) {
          return {
            name: data.name || data.char_name,
            description: data.description || data.char_greeting || data.description,
            personality: data.personality || data.char_persona || data.personality,
            scenario: data.scenario || data.world_scenario || data.scenario,
            firstMessage: data.first_mes || data.char_greeting || data.firstMessage,
            examples: data.mes_example || data.example_dialogue || data.examples,
          };
        }
      } else if (file.type.startsWith('image/')) {
        // Try to extract character data from PNG metadata
        // This would require a more complex implementation to read PNG tEXt chunks
        toast({
          title: "PNG Import",
          description: "PNG character card import coming soon. Please use JSON files for now.",
          variant: "destructive",
        });
        return null;
      }
      
      toast({
        title: "Unsupported file format",
        description: "Please upload a JSON or PNG character file.",
        variant: "destructive",
      });
      return null;
    } catch (error) {
      toast({
        title: "Failed to parse file",
        description: "The file format is not recognized or corrupted.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const character = await parseCharacterFile(file);
    
    if (character) {
      onCharacterImport(character);
      toast({
        title: "Character imported successfully!",
        description: `Loaded character: ${character.name || 'Unknown'}`,
      });
    }
  }, [parseCharacterFile, onCharacterImport, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Upload className="w-5 h-5 text-primary mr-2" />
          Import Character Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-slate-300 hover:border-primary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <FileUp className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Drop character files here</p>
              <p className="text-xs text-slate-500 mt-1">or click to browse (JSON, PNG, TXT)</p>
            </div>
            <Button size="sm">
              Choose Files
            </Button>
          </div>
        </div>

        <input
          id="file-input"
          type="file"
          accept=".json,.png,.txt"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="text-center">
          <span className="text-sm text-slate-500">or</span>
        </div>

        <Button variant="secondary" className="w-full h-auto p-4 flex flex-col items-center">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mb-2">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="font-medium">Import from Meta AI Studios</span>
          <span className="text-xs text-slate-500 mt-1">Copy and paste character data manually</span>
        </Button>
      </CardContent>
    </Card>
  );
}
