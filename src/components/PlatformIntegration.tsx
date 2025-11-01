import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileCode, Figma, Github, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlatformStatus {
  jira: boolean;
  figma: boolean;
  github: boolean;
}

export const PlatformIntegration = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [connected, setConnected] = useState<PlatformStatus>({
    jira: false,
    figma: false,
    github: false
  });

  const handleImport = async (platform: keyof PlatformStatus) => {
    setLoading(prev => ({ ...prev, [platform]: true }));
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnected(prev => ({ ...prev, [platform]: true }));
      
      toast({
        title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Connected`,
        description: `Successfully imported data from ${platform}.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `Failed to import from ${platform}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const platforms = [
    {
      id: "jira" as keyof PlatformStatus,
      name: "Jira",
      description: "Import user stories, epics, and requirements",
      icon: FileCode,
      color: "text-blue-500"
    },
    {
      id: "figma" as keyof PlatformStatus,
      name: "Figma",
      description: "Sync design specs and UI components",
      icon: Figma,
      color: "text-purple-500"
    },
    {
      id: "github" as keyof PlatformStatus,
      name: "GitHub",
      description: "Import repository structure and documentation",
      icon: Github,
      color: "text-foreground"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Platform Integrations</span>
          <Badge variant="outline" className="ml-2">Optional</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Import project data from your existing tools to enhance test generation context
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <Card key={platform.id} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-3 rounded-lg bg-secondary/50`}>
                    <platform.icon className={`w-8 h-8 ${platform.color}`} />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {platform.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>
                  
                  {connected[platform.id] ? (
                    <div className="flex items-center space-x-2 text-success">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleImport(platform.id)}
                      disabled={loading[platform.id]}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {loading[platform.id] ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        `Import from ${platform.name}`
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Platform integrations are optional but recommended. 
            They provide additional context that helps generate more accurate and comprehensive test cases.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
