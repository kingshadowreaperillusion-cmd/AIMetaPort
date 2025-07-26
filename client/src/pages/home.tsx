import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CharacterForm from "@/components/character-form";
import CharacterPreview from "@/components/character-preview";
import ExportPanel from "@/components/export-panel";
import FileUpload from "@/components/file-upload";
import { Character } from "@shared/schema";
import { validateCharacter } from "@/lib/character-validation";
import { Bot, Github, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [character, setCharacter] = useState<Partial<Character>>({
    name: "",
    description: "",
    personality: "",
    scenario: "",
    firstMessage: "",
    examples: "",
    avatar: "",
  });

  const validation = validateCharacter(character);

  const handleCharacterChange = (field: keyof Character, value: string) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileImport = (importedCharacter: Partial<Character>) => {
    setCharacter(importedCharacter);
  };

  const loadTemplate = () => {
    setCharacter({
      name: "Helpful Assistant",
      description: "A friendly and knowledgeable AI assistant ready to help with various tasks.",
      personality: "Kind, patient, helpful, knowledgeable, and always eager to assist users with their questions and tasks. Speaks in a warm and encouraging tone.",
      scenario: "You are a helpful AI assistant designed to provide accurate information and assistance to users across a wide range of topics.",
      firstMessage: "Hello! I'm here to help you with whatever you need. What can I assist you with today?",
      examples: "{{user}}: Can you help me with math?\n{{char}}: Of course! I'd be happy to help you with math. What specific topic or problem would you like to work on?\n\n{{user}}: Thank you for your help!\n{{char}}: You're very welcome! I'm always here whenever you need assistance. Feel free to ask me anything anytime!",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">AI Character Converter</h1>
                <p className="text-xs text-slate-500">Meta AI Studios to Universal Formats</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button size="sm">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <FileUpload onCharacterImport={handleFileImport} />
            
            <CharacterForm 
              character={character}
              onChange={handleCharacterChange}
              onLoadTemplate={loadTemplate}
              validation={validation}
            />
          </div>

          {/* Right Column - Preview & Export */}
          <div className="space-y-6">
            <CharacterPreview 
              character={character}
              validation={validation}
            />
            
            <ExportPanel 
              character={character}
              validation={validation}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 text-center">
              <Bot className="inline w-6 h-6 text-primary mr-2" />
              How to Use the Character Converter
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Import or Create</h3>
                <p className="text-sm text-slate-600">Upload existing character files or manually enter character details using the form</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Preview & Validate</h3>
                <p className="text-sm text-slate-600">Review character information and ensure all required fields are complete</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Export & Use</h3>
                <p className="text-sm text-slate-600">Choose your target format and download the converted character files</p>
              </div>
            </div>

            <Card className="mt-8">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-900 mb-3">Supported Formats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>TavernAI/SillyTavern</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Pygmalion</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>CharacterAI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>TextGeneration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-sm text-slate-600">© 2024 AI Character Converter</p>
              <span className="text-slate-300">•</span>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Privacy</a>
              <span className="text-slate-300">•</span>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Terms</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/ZoltanAI/character-editor" className="text-slate-600 hover:text-slate-900 transition-colors">
                <Github className="inline w-4 h-4 mr-2" />
                <span className="text-sm">Inspired by ZoltanAI Character Editor</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
