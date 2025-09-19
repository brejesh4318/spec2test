import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  X, 
  TestTube2, 
  Loader2,
  Download,
  Calendar,
  Shield
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock project data
  const project = {
    id: id,
    name: "Medical Device Validation",
    description: "FDA compliance test cases for cardiac monitoring device",
    status: "active",
    createdDate: "2024-01-15",
    testCases: 156,
    compliance: 94,
    standards: ["FDA 21 CFR Part 820", "ISO 13485"]
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(file => {
        const validTypes = ['.pdf', '.docx', '.doc', '.xml', '.md'];
        return validTypes.some(type => file.name.toLowerCase().endsWith(type));
      });
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateTestCases = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload requirements documents before generating test cases.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Test Cases Generated",
        description: `Successfully generated ${Math.floor(Math.random() * 50 + 50)} test cases from uploaded requirements.`,
      });
      
      // In a real app, redirect to test cases page
      // navigate(`/projects/${id}/test-cases`);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate test cases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/projects" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              <p className="text-muted-foreground mt-2">{project.description}</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {project.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Created {project.createdDate}
              </div>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TestTube2 className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{project.testCases}</p>
                  <p className="text-sm text-muted-foreground">Test Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{project.standards.length}</p>
                  <p className="text-sm text-muted-foreground">Standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{uploadedFiles.length}</p>
                  <p className="text-sm text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-0">
                <TabsTrigger value="upload">Upload Requirements</TabsTrigger>
                {/* <TabsTrigger value="generate">Generate Test Cases</TabsTrigger> */}
              </TabsList>
              
              <TabsContent value="upload" className="space-y-6">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Upload Requirements Documents
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop files here, or click to select files
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.doc,.xml,.md"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild variant="outline">
                      <span>Choose Files</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: PDF, Word, XML, Markdown
                  </p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Uploaded Files</h4>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="generate" className="space-y-6">
                <div className="text-center py-8">
                  <TestTube2 className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Generate Test Cases
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Generate comprehensive test cases from your uploaded requirements 
                    with automated compliance mapping.
                  </p>
                  
                  <Button
                    onClick={generateTestCases}
                    disabled={isGenerating || uploadedFiles.length === 0}
                    size="lg"
                    className="px-8"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Test Cases...
                      </>
                    ) : (
                      <>
                        <TestTube2 className="w-5 h-5 mr-2" />
                        Generate Test Cases
                      </>
                    )}
                  </Button>
                  
                  {uploadedFiles.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Please upload requirements documents first.
                    </p>
                  )}
                </div>

                {/* Standards Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Compliance Standards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.standards.map((standard) => (
                        <Badge key={standard} variant="outline">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Test cases will be generated with traceability to these standards.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <Link to={`/projects/${project.id}/test-cases`}>
                  <Button className="w-full">
                    <TestTube2 className="w-4 h-4 mr-2" />
                    View All Test Cases
                  </Button>
                </Link>
                <Link to={`/compliance/${project.id}`}>
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Compliance Traceability
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;