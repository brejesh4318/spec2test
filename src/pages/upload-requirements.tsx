import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  File, 
  FileText, 
  X, 
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import axios from "axios";

const UploadRequirements = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Accepted file types
  const acceptedTypes = [
    '.pdf', '.doc', '.docx', '.xml', '.md', '.txt'
  ];

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
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(extension);
    });

    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !acceptedTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: `${invalidFiles.length} file(s) were not added. Please upload PDF, Word, XML, Markdown, or text files only.`,
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      // Check for duplicate files
      const newFiles = validFiles.filter(newFile => 
        !uploadedFiles.some(existingFile => 
          existingFile.name === newFile.name && existingFile.size === newFile.size
        )
      );

      const duplicateCount = validFiles.length - newFiles.length;
      if (duplicateCount > 0) {
        toast({
          title: "Duplicate Files",
          description: `${duplicateCount} duplicate file(s) were skipped.`,
          variant: "default",
        });
      }

      if (newFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...newFiles]);
        toast({
          title: "Files Added",
          description: `${newFiles.length} file(s) added successfully.`,
          variant: "default",
        });
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xml':
        return <File className="w-5 h-5 text-green-500" />;
      case 'md':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
  if (uploadedFiles.length === 0) {
    toast({
      title: "No Files Selected",
      description: "Please select at least one file to upload.",
      variant: "destructive",
    });
    return;
  }

  setIsUploading(true);

  try {
    // Create FormData for file upload
    const formData = new FormData();
console.log("Uploading files for project ID:", id);
    // Add project ID to form data
    formData.append("project_id", id || "");

    // Add all files to form data
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // Make API call to upload files
    const response = await axios.post(
      `https://spec2test-513267201789.asia-south1.run.app/v1/dash-test/testcaseGenerator`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );

    const data = response.data;
    console.log("Upload API Response:", data);

    toast({
      title: "Files Uploaded Successfully",
      description: `${uploadedFiles.length} file(s) uploaded and processed.`,
    });

    // ✅ Navigate to the test cases page
    navigate(`/projects/${id}/test-cases`);
  } catch (error) {
   // navigate(`/projects/${projectId}/test-cases`);
    console.error("Error uploading files:", error);

    let errorMessage = "Failed to upload files. Please try again.";

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        errorMessage = "File size too large. Please try smaller files.";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message || "Invalid file format or request.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
    }

    toast({
      title: "Upload Failed",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsUploading(false);
  }
};


  const handleSkip = () => {
    // Navigate to project page even without files
    navigate(`/projects/${id}`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Upload Requirements</h1>
          <p className="text-muted-foreground mt-2">
            Upload your requirement documents to generate automated test cases and ensure compliance.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-medium text-foreground">Project Created</span>
          </div>
          <div className="w-16 h-px bg-border mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-foreground">Upload Requirements</span>
          </div>
          <div className="w-16 h-px bg-border mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm text-muted-foreground">Configure</span>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Document Upload</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, Word (.doc, .docx), XML, Markdown (.md), Text (.txt)
              </p>
              <Input
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="cursor-pointer">
                  Select Files
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Uploaded Files ({uploadedFiles.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadedFiles([])}
                  disabled={isUploading}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.name)}
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={isUploading}
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleUpload}
              disabled={isUploading || uploadedFiles.length === 0}
              className="min-w-[140px]"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Generate Test Cases
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Document Processing</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Documents will be analyzed for requirements extraction</li>
                <li>• Test cases will be generated based on identified requirements</li>
                <li>• Compliance mappings will be created automatically</li>
                <li>• You can add more documents later in the project settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRequirements;