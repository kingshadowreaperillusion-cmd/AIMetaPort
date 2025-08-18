import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Character } from "@shared/schema";
import { Upload, FileUp, Smartphone, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onCharacterImport: (character: Partial<Character>) => void;
}

export default function FileUpload({ onCharacterImport }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showManualImport, setShowManualImport] = useState(false);
  const [manualData, setManualData] = useState({
    name: '',
    description: '',
    personality: '',
    scenario: '',
    firstMessage: '',
    examples: ''
  });
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

  const handleManualImport = () => {
    if (!manualData.name || !manualData.personality) {
      toast({
        title: "Missing required fields",
        description: "Please provide at least a character name and personality.",
        variant: "destructive",
      });
      return;
    }

    onCharacterImport(manualData);
    setShowManualImport(false);
    setManualData({
      name: '',
      description: '',
      personality: '',
      scenario: '',
      firstMessage: '',
      examples: ''
    });

    toast({
      title: "Character imported successfully!",
      description: `Loaded character: ${manualData.name}`,
    });
  };

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

        <Button 
          variant="secondary" 
          className="w-full h-auto p-4 flex flex-col items-center"
          onClick={() => setShowManualImport(true)}
          data-testid="button-meta-ai-import"
        >
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mb-2">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="font-medium">Import from Meta AI Studios</span>
          <span className="text-xs text-slate-500 mt-1">Copy and paste character data manually</span>
        </Button>
      </CardContent>

      {/* Manual Import Dialog */}
      <Dialog open={showManualImport} onOpenChange={setShowManualImport}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-lg" data-testid="manual-import-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center" data-testid="dialog-title">
              <Smartphone className="w-5 h-5 text-primary mr-2" />
              Import from Meta AI Studios
            </DialogTitle>
            <DialogDescription data-testid="dialog-description">
              Copy your character information from Meta AI Studios and paste it here. This is perfect for mobile users who can't upload files directly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Copy className="w-4 h-4 mr-2" />
                How to get your character data:
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Go to your character in Meta AI Studios</li>
                <li>Copy the character name, description, and personality</li>
                <li>Paste each section into the corresponding fields below</li>
                <li>Add any additional details like scenarios or examples</li>
              </ol>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-name" className="text-sm font-medium text-slate-700">
                  Character Name *
                </Label>
                <Textarea
                  id="manual-name"
                  data-testid="input-character-name"
                  placeholder="Enter the character name"
                  value={manualData.name}
                  onChange={(e) => setManualData(prev => ({ ...prev, name: e.target.value }))}
                  rows={1}
                  className="mt-1 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="manual-description" className="text-sm font-medium text-slate-700">
                  Description
                </Label>
                <Textarea
                  id="manual-description"
                  placeholder="Brief description of the character"
                  value={manualData.description}
                  onChange={(e) => setManualData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="manual-personality" className="text-sm font-medium text-slate-700">
                  Personality *
                </Label>
                <Textarea
                  id="manual-personality"
                  placeholder="Character personality, traits, and behavior patterns"
                  value={manualData.personality}
                  onChange={(e) => setManualData(prev => ({ ...prev, personality: e.target.value }))}
                  rows={4}
                  className="mt-1 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="manual-scenario" className="text-sm font-medium text-slate-700">
                  Scenario & Setting
                </Label>
                <Textarea
                  id="manual-scenario"
                  placeholder="Context, setting, and background scenario"
                  value={manualData.scenario}
                  onChange={(e) => setManualData(prev => ({ ...prev, scenario: e.target.value }))}
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="manual-firstMessage" className="text-sm font-medium text-slate-700">
                  First Message
                </Label>
                <Textarea
                  id="manual-firstMessage"
                  placeholder="Opening dialogue or greeting"
                  value={manualData.firstMessage}
                  onChange={(e) => setManualData(prev => ({ ...prev, firstMessage: e.target.value }))}
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="manual-examples" className="text-sm font-medium text-slate-700">
                  Example Dialogues
                </Label>
                <Textarea
                  id="manual-examples"
                  placeholder="Sample conversations and response examples"
                  value={manualData.examples}
                  onChange={(e) => setManualData(prev => ({ ...prev, examples: e.target.value }))}
                  rows={4}
                  className="mt-1 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleManualImport}
                className="flex-1"
                disabled={!manualData.name || !manualData.personality}
                data-testid="button-import-character"
              >
                Import Character
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowManualImport(false)}
                className="flex-1"
                data-testid="button-cancel-import"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
