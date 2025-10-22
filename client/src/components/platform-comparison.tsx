import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle } from "lucide-react";

export function PlatformComparison() {
  const features = [
    {
      feature: "Create Custom AI Characters",
      instagram: { available: true, notes: "Full creation support" },
      messenger: { available: true, notes: "Full creation support" },
      whatsapp: { available: false, notes: "Can only chat with existing bots" },
    },
    {
      feature: "Share AI Publicly",
      instagram: { available: true, notes: "Via Stories & profile" },
      messenger: { available: true, notes: "Via AI Studio" },
      whatsapp: { available: false, notes: "Private only" },
    },
    {
      feature: "Creator Extensions",
      instagram: { available: true, notes: "For professional accounts" },
      messenger: { available: true, notes: "Available" },
      whatsapp: { available: false, notes: "Not available" },
    },
    {
      feature: "Desktop/Web Access",
      instagram: { available: true, notes: "Full web support" },
      messenger: { available: true, notes: "Full desktop support" },
      whatsapp: { available: "limited", notes: "Limited features" },
    },
    {
      feature: "Personalized Responses",
      instagram: { available: true, notes: "Uses profile & engagement data" },
      messenger: { available: true, notes: "Uses Facebook data" },
      whatsapp: { available: "limited", notes: "Only if linked via Accounts Center" },
    },
    {
      feature: "Image Generation",
      instagram: { available: "beta", notes: "Beta feature" },
      messenger: { available: "beta", notes: "Beta feature" },
      whatsapp: { available: true, notes: "Available in beta" },
    },
  ];

  const renderAvailability = (status: boolean | string) => {
    if (status === true) {
      return <Check className="w-5 h-5 text-green-600" data-testid="icon-feature-available" />;
    } else if (status === "limited" || status === "beta") {
      return <AlertCircle className="w-5 h-5 text-yellow-600" data-testid="icon-feature-limited" />;
    } else {
      return <X className="w-5 h-5 text-red-500" data-testid="icon-feature-unavailable" />;
    }
  };

  return (
    <Card className="w-full" data-testid="card-platform-comparison">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Platform Feature Comparison
          <Badge variant="secondary" data-testid="badge-mobile-guide">Mobile Guide</Badge>
        </CardTitle>
        <CardDescription>
          Understanding what you can do on Instagram, Messenger, and WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Why transfer characters?</strong> Each Meta platform has different features. 
              If you have separate accounts on Instagram, Messenger, and WhatsApp, you can manually 
              transfer your character data to take advantage of platform-specific capabilities.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Feature</th>
                  <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex flex-col items-center gap-1">
                      <span>Instagram</span>
                      <Badge variant="outline" className="text-xs" data-testid="badge-instagram">IG</Badge>
                    </div>
                  </th>
                  <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex flex-col items-center gap-1">
                      <span>Messenger</span>
                      <Badge variant="outline" className="text-xs" data-testid="badge-messenger">MSG</Badge>
                    </div>
                  </th>
                  <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex flex-col items-center gap-1">
                      <span>WhatsApp</span>
                      <Badge variant="outline" className="text-xs" data-testid="badge-whatsapp">WA</Badge>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    data-testid={`row-feature-${index}`}
                  >
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                      {item.feature}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {renderAvailability(item.instagram.available)}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.instagram.notes}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {renderAvailability(item.messenger.available)}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.messenger.notes}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {renderAvailability(item.whatsapp.available)}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.whatsapp.notes}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card className="border-green-200 dark:border-green-800" data-testid="card-instagram-best">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Best for Instagram</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Public character sharing</li>
                  <li>Creator accounts</li>
                  <li>Story integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800" data-testid="card-messenger-best">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Best for Messenger</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Desktop access</li>
                  <li>Full AI Studio features</li>
                  <li>Memory & personalization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800" data-testid="card-whatsapp-best">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Best for WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Privacy-focused chats</li>
                  <li>End-to-end encryption</li>
                  <li>Chat with existing bots</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
