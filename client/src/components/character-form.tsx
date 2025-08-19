import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Character, ValidationResult } from "@shared/schema";
import { Edit, LayoutTemplate, CheckCircle, Upload, User, X, RotateCcw } from "lucide-react";

interface CharacterFormProps {
  character: Partial<Character>;
  onChange: (field: keyof Character, value: string) => void;
  onLoadTemplate: () => void;
  validation: ValidationResult;
}

export default function CharacterForm({ character, onChange, onLoadTemplate, validation }: CharacterFormProps) {
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    onChange('avatar', '');
    // Reset the file input value
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Edit className="w-5 h-5 text-primary mr-2" />
            Character Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Character Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter character name"
              value={character.name || ""}
              onChange={(e) => onChange('name', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the character"
              value={character.description || ""}
              onChange={(e) => onChange('description', e.target.value)}
              rows={3}
              className="mt-1 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="personality" className="text-sm font-medium text-slate-700">
              Personality Traits
            </Label>
            <Textarea
              id="personality"
              placeholder="Character personality, traits, and behavior patterns"
              value={character.personality || ""}
              onChange={(e) => onChange('personality', e.target.value)}
              rows={3}
              className="mt-1 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="scenario" className="text-sm font-medium text-slate-700">
              Scenario & Setting
            </Label>
            <Textarea
              id="scenario"
              placeholder="Context, setting, and background scenario"
              value={character.scenario || ""}
              onChange={(e) => onChange('scenario', e.target.value)}
              rows={3}
              className="mt-1 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="firstMessage" className="text-sm font-medium text-slate-700">
              First Message
            </Label>
            <Textarea
              id="firstMessage"
              placeholder="Opening dialogue or greeting"
              value={character.firstMessage || ""}
              onChange={(e) => onChange('firstMessage', e.target.value)}
              rows={3}
              className="mt-1 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="examples" className="text-sm font-medium text-slate-700">
              Example Dialogues
            </Label>
            <Textarea
              id="examples"
              placeholder="Sample conversations and response examples"
              value={character.examples || ""}
              onChange={(e) => onChange('examples', e.target.value)}
              rows={4}
              className="mt-1 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">Use {"{{char}}"} for character name, {"{{user}}"} for user name</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700">
              Character Avatar
            </Label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="relative w-16 h-16 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden">
                {character.avatar ? (
                  <>
                    <img src={character.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={handleAvatarRemove}
                      data-testid="button-remove-avatar"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <User className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex space-x-2">
                  <label htmlFor="avatar-upload">
                    <Button type="button" variant="secondary" size="sm" asChild>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        {character.avatar ? 'Change Image' : 'Upload Image'}
                      </span>
                    </Button>
                  </label>
                  {character.avatar && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarRemove}
                      data-testid="button-reset-avatar"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  data-testid="input-avatar-upload"
                />
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <LayoutTemplate className="w-5 h-5 text-primary mr-2" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="secondary" 
              onClick={onLoadTemplate}
              className="h-auto p-4 flex flex-col items-start"
            >
              <LayoutTemplate className="w-5 h-5 text-secondary mb-2" />
              <span className="font-medium">Load LayoutTemplate</span>
              <span className="text-xs text-slate-500">Start with example</span>
            </Button>
            <Button 
              variant="secondary"
              className="h-auto p-4 flex flex-col items-start"
            >
              <CheckCircle className="w-5 h-5 text-success mb-2" />
              <span className="font-medium">Validate Data</span>
              <span className="text-xs text-slate-500">Check completeness</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
