import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Character, ValidationResult } from "@shared/schema";
import { Eye, CheckCircle, AlertTriangle, XCircle, User } from "lucide-react";

interface CharacterPreviewProps {
  character: Partial<Character>;
  validation: ValidationResult;
}

export default function CharacterPreview({ character, validation }: CharacterPreviewProps) {
  const getFieldStatus = (field: keyof Character) => {
    const value = character[field];
    const hasValue = value && value.length > 0;
    
    if (field === 'name' || field === 'personality') {
      return hasValue ? 'complete' : 'required';
    }
    return hasValue ? 'complete' : 'optional';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'required':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'optional':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-600';
      case 'required':
        return 'text-red-600';
      case 'optional':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTokenProgress = () => {
    const maxTokens = 2048;
    return Math.min((validation.tokenCount / maxTokens) * 100, 100);
  };

  const fields = [
    { key: 'name' as const, label: 'Character Name' },
    { key: 'description' as const, label: 'Description' },
    { key: 'personality' as const, label: 'Personality' },
    { key: 'scenario' as const, label: 'Scenario' },
    { key: 'firstMessage' as const, label: 'First Message' },
    { key: 'examples' as const, label: 'Example Dialogues' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Eye className="w-5 h-5 text-primary mr-2" />
          Character Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview Card */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center overflow-hidden">
              {character.avatar ? (
                <img src={character.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-lg">AI</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">
                {character.name || "Character Name"}
              </h4>
              <p className="text-sm text-slate-600 mt-1">
                {character.description || "Character description will appear here when entered..."}
              </p>
            </div>
          </div>
        </div>

        {/* Token Count */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Estimated Token Count</span>
            <span className="text-sm font-semibold text-blue-900">{validation.tokenCount} tokens</span>
          </div>
          <Progress value={getTokenProgress()} className="h-2" />
          <p className="text-xs text-blue-700 mt-1">Recommended: Under 2048 tokens for optimal performance</p>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          {fields.map((field) => {
            const status = getFieldStatus(field.key);
            return (
              <div key={field.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                <span className="text-sm text-slate-600">{field.label}</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className={`text-xs capitalize ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation Errors */}
        {validation.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors</h4>
            <ul className="text-xs text-red-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Validation Warnings */}
        {validation.warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Recommendations</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
