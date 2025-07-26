import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Character, ValidationResult, ExportFormat } from "@shared/schema";
import { Download, Image, Code, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ExportPanelProps {
  character: Partial<Character>;
  validation: ValidationResult;
}

export default function ExportPanel({ character, validation }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("tavernai");
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async ({ format, type }: { format: ExportFormat; type: 'json' | 'png' }) => {
      const response = await apiRequest('POST', '/api/convert', {
        character,
        format,
        includeAvatar: true,
        exportType: type
      });
      
      if (type === 'png') {
        return response.blob();
      } else {
        return response.json();
      }
    },
    onSuccess: (data, variables) => {
      if (variables.type === 'png') {
        const url = URL.createObjectURL(data as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${character.name || 'character'}-${variables.format}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${character.name || 'character'}-${variables.format}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast({
        title: "Export successful!",
        description: `Character exported in ${variables.format} format.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const canExport = validation.isValid && character.name && character.personality;

  const formatInfo = {
    tavernai: {
      title: "TavernAI/SillyTavern Format",
      description: "Modern PNG character card with embedded JSON metadata",
      notes: "Character cards include avatar image and can be easily shared. Compatible with SillyTavern, TavernAI, and most modern AI chat interfaces.",
      supportsAvatar: true,
    },
    pygmalion: {
      title: "Pygmalion Format",
      description: "JSON format optimized for Pygmalion and TextGenerationWebUI",
      notes: "Lightweight format focused on roleplay scenarios. Compatible with KoboldAI and Pygmalion systems.",
      supportsAvatar: false,
    },
    characterai: {
      title: "CharacterAI Format",
      description: "JSON format compatible with CharacterAI-style systems",
      notes: "Standard format for Character.AI compatible platforms. Includes personality and scenario optimization.",
      supportsAvatar: false,
    },
    textgeneration: {
      title: "TextGeneration Format",
      description: "Universal JSON format for text generation interfaces",
      notes: "Compatible with various text generation UIs and local AI hosting solutions.",
      supportsAvatar: false,
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Download className="w-5 h-5 text-primary mr-2" />
            Export Formats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as ExportFormat)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tavernai">TavernAI</TabsTrigger>
              <TabsTrigger value="pygmalion">Pygmalion</TabsTrigger>
              <TabsTrigger value="characterai">CharacterAI</TabsTrigger>
              <TabsTrigger value="textgeneration">TextGen</TabsTrigger>
            </TabsList>

            {Object.entries(formatInfo).map(([format, info]) => (
              <TabsContent key={format} value={format} className="mt-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">{info.title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{info.description}</p>
                  
                  <div className="space-y-3">
                    {info.supportsAvatar && (
                      <Button
                        onClick={() => exportMutation.mutate({ format: format as ExportFormat, type: 'png' })}
                        disabled={!canExport || exportMutation.isPending}
                        className="w-full"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        {exportMutation.isPending ? 'Generating...' : 'Download Character Card (.png)'}
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => exportMutation.mutate({ format: format as ExportFormat, type: 'json' })}
                      disabled={!canExport || exportMutation.isPending}
                      className="w-full"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Download JSON (.json)
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">{info.title} Notes</p>
                      <p className="text-yellow-700 mt-1">{info.notes}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {!canExport && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">Cannot Export</p>
                  <p className="text-red-700 mt-1">
                    Please ensure character name and personality are filled out and all validation errors are resolved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Conversions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Download className="w-5 h-5 text-primary mr-2" />
            Recent Conversions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">No recent conversions</p>
            <p className="text-xs text-slate-400 mt-1">Your exported characters will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
