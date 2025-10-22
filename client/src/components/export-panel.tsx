import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Character, ValidationResult, ExportFormat } from "@shared/schema";
import { Download, Image, Code, Info, Copy, CheckCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { convertToFormat } from "@/lib/character-formats";

interface ExportPanelProps {
  character: Partial<Character>;
  validation: ValidationResult;
}

export default function ExportPanel({ character, validation }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("tavernai");
  const [copiedField, setCopiedField] = useState<string | null>(null);
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

  const handleCopyField = (fieldName: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied!",
      description: `${fieldName} copied to clipboard`,
    });
  };

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
    meta: {
      title: "Meta AI Studio Format",
      description: "Copy/paste format for transferring characters between Meta accounts",
      notes: "Perfect for mobile users who want to transfer characters between Instagram, Messenger, or WhatsApp accounts. Simply copy each field and paste into Meta AI Studio.",
      supportsAvatar: false,
      isCopyable: true,
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="meta" data-testid="tab-meta">
                Meta AI
              </TabsTrigger>
              <TabsTrigger value="tavernai" data-testid="tab-tavernai">TavernAI</TabsTrigger>
              <TabsTrigger value="pygmalion" data-testid="tab-pygmalion">Pygmalion</TabsTrigger>
              <TabsTrigger value="characterai" data-testid="tab-characterai">CharacterAI</TabsTrigger>
              <TabsTrigger value="textgeneration" data-testid="tab-textgeneration">TextGen</TabsTrigger>
            </TabsList>

            {Object.entries(formatInfo).map(([format, info]) => (
              <TabsContent key={format} value={format} className="mt-4">
                {format === 'meta' ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">{info.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{info.description}</p>
                      
                      <div className="bg-white dark:bg-slate-900 rounded-md p-3 mb-3 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">📱 How to Transfer:</p>
                        <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                          <li>Copy each field below (tap the copy button)</li>
                          <li>Open Meta AI Studio on your other account (Instagram/Messenger)</li>
                          <li>Create a new AI character</li>
                          <li>Paste the copied data into the corresponding fields</li>
                          <li>Save your character</li>
                        </ol>
                      </div>

                      {canExport && character.name && character.personality ? (
                        <>
                          {(() => {
                            const metaData = convertToFormat(character as Character, 'meta') as any;
                            const fields = [
                              { key: 'name', label: 'Character Name', value: metaData.name },
                              { key: 'tagline', label: 'Tagline', value: metaData.tagline },
                              { key: 'personality', label: 'Personality & Tone', value: metaData.personality },
                              { key: 'description', label: 'Description/Scenario', value: metaData.description },
                              { key: 'greeting', label: 'Greeting Message', value: metaData.greeting },
                              { key: 'example_conversations', label: 'Example Conversations', value: metaData.example_conversations },
                            ];
                            
                            return (
                              <div className="space-y-3">
                                {fields.map(field => field.value && (
                                  <div key={field.key} className="bg-white dark:bg-slate-900 rounded-md p-3 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                        {field.label}
                                      </label>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleCopyField(field.label, field.value)}
                                        className="h-7 px-2"
                                        data-testid={`button-copy-${field.key}`}
                                      >
                                        {copiedField === field.label ? (
                                          <>
                                            <CheckCheck className="w-3 h-3 mr-1 text-green-600" />
                                            <span className="text-xs text-green-600">Copied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3 h-3 mr-1" />
                                            <span className="text-xs">Copy</span>
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded p-2 text-sm text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                                      {field.value}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </>
                      ) : (
                        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Please fill out character name and personality to view copyable fields.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800 dark:text-yellow-200">{info.title} Notes</p>
                          <p className="text-yellow-700 dark:text-yellow-300 mt-1">{info.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">{info.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{info.description}</p>
                      
                      <div className="space-y-3">
                        {info.supportsAvatar && (
                          <Button
                            onClick={() => exportMutation.mutate({ format: format as ExportFormat, type: 'png' })}
                            disabled={!canExport || exportMutation.isPending}
                            className="w-full"
                            data-testid={`button-export-png-${format}`}
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
                          data-testid={`button-export-json-${format}`}
                        >
                          <Code className="w-4 h-4 mr-2" />
                          Download JSON (.json)
                        </Button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800 dark:text-yellow-200">{info.title} Notes</p>
                          <p className="text-yellow-700 dark:text-yellow-300 mt-1">{info.notes}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
