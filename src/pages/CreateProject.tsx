import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      toast({
        title: "Validation Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Make POST API call to create project
      const response = await axios.post(
        "http://localhost:3000/v1/dash-test/dashboardData",
        {
          name: projectName,
          description: projectDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const data = response.data;
      console.log("API Response:", data);
      
      // Use projectId from API response, or generate mock ID as fallback
      const projectId = data.projectId || data.id || Math.floor(Math.random() * 1000) + 1;

      toast({
        title: "Project Created",
        description: `${projectName} has been successfully created.`,
      });

      // Navigate to upload requirements page
      navigate(`/projects/${projectId}/upload-requirements`);
    } catch (error) {
      console.error("Error creating project:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to create project. Please try again.",
      //   variant: "destructive",
      // });
            navigate(`/projects/1234/upload-requirements`);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Set up a new healthcare compliance project for test case generation.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Project Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-sm font-medium">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  placeholder="e.g., Medical Device Validation"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Choose a descriptive name for your compliance project.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription" className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe the scope, regulatory requirements, or specific compliance standards for this project..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Provide additional context about your project's compliance requirements.
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Project</span>
                    </>
                  )}
                </Button>
                <Link to="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Upload your requirements documents (PDF, Word, XML, Markdown)</li>
            <li>• Configure compliance standards and regulations</li>
            <li>• Generate automated test cases with traceability</li>
            <li>• Export to your ALM platforms (Jira, Polarion, Azure DevOps)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;