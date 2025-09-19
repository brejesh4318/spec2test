import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Search,
  Filter,
  TestTube2,
  Workflow,
  Shield,
  Loader2
} from "lucide-react";
import axios from "axios";

interface TestCase {
  testCaseId: string;
  testCaseNo: string;
  priority: string;
  testCaseName: string;
  requirement: string;
  steps: string[];
  complianceTags: string[];
}

interface ProjectData {
  projectName: string;
  projectId: string;
  testCases: TestCase[];
}

const TestCases = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
const navigate = useNavigate();
  // Fetch test cases data when component mounts
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:3000/v1/projects/${id}/test-cases`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = response.data;
        console.log("Test Cases API Response:", data);

        setProjectData(data);
      } catch (error) {
        console.error("Error fetching test cases:", error);

        let errorMessage = "Failed to load test cases. Please try again.";

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            errorMessage = "Project not found.";
          } else if (error.response?.status === 403) {
            errorMessage = "Access denied. You don't have permission to view this project.";
          } else if (error.response?.status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.message === 'Network Error') {
          errorMessage = "Network error. Please check your connection.";
        }
        setProjectData({
          "projectName": "ALM Platform Sync",
          "projectId": "12345",
          "testCases": [
            {
              "testCaseId": "1234",
              "testCaseNo": "1",
              "priority": "High",
              "testCaseName": "Verify heart rate measurement accuracy",
              "requirement": "Device shall measure heart rate with ±2 BPM accuracy",
              "steps": [
                "Attempt login with invalid credentials",
                "Verify access is denied",
                "Test password complexity requirements",
                "Validate session timeout functionality"
              ],
              "complianceTags": ["FDA Cybersecurity", "HIPAA"]
            },
            {
              "testCaseId": "1234",
              "testCaseNo": "1",
              "priority": "High",
              "testCaseName": "Verify heart rate measurement accuracy",
              "requirement": "Device shall measure heart rate with ±2 BPM accuracy",
              "steps": [
                "Attempt login with invalid credentials",
                "Verify access is denied",
                "Test password complexity requirements",
                "Validate session timeout functionality"
              ],
              "complianceTags": ["FDA Cybersecurity", "HIPAA"]
            },
            {
              "testCaseId": "1234",
              "testCaseNo": "1",
              "priority": "High",
              "testCaseName": "Verify heart rate measurement accuracy",
              "requirement": "Device shall measure heart rate with ±2 BPM accuracy",
              "steps": [
                "Attempt login with invalid credentials",
                "Verify access is denied",
                "Test password complexity requirements",
                "Validate session timeout functionality"
              ],
              "complianceTags": ["FDA Cybersecurity", "HIPAA"]
            },
            {
              "testCaseId": "1234",
              "testCaseNo": "1",
              "priority": "High",
              "testCaseName": "Verify heart rate measurement accuracy",
              "requirement": "Device shall measure heart rate with ±2 BPM accuracy",
              "steps": [
                "Attempt login with invalid credentials",
                "Verify access is denied",
                "Test password complexity requirements",
                "Validate session timeout functionality"
              ],
              "complianceTags": ["FDA Cybersecurity", "HIPAA"]
            },
            {
              "testCaseId": "1234",
              "testCaseNo": "1",
              "priority": "High",
              "testCaseName": "Verify heart rate measurement accuracy",
              "requirement": "Device shall measure heart rate with ±2 BPM accuracy",
              "steps": [
                "Attempt login with invalid credentials",
                "Verify access is denied",
                "Test password complexity requirements",
                "Validate session timeout functionality"
              ],
              "complianceTags": ["FDA Cybersecurity", "HIPAA"]
            },
            {
              "testCaseId": "1234",
              "testCaseNo": "1",
              "priority": "High",
              "testCaseName": "Verify heart rate measurement accuracy",
              "requirement": "Device shall measure heart rate with ±2 BPM accuracy",
              "steps": [
                "Attempt login with invalid credentials",
                "Verify access is denied",
                "Test password complexity requirements",
                "Validate session timeout functionality"
              ],
              "complianceTags": ["FDA Cybersecurity", "HIPAA"]
            },
            {
              "testCaseId": "1234",
              "testCaseNo": "1",
              "priority": "High",
              "testCaseName": "Verify heart rate measurement accuracy",
              "requirement": "Device shall measure heart rate with ±2 BPM accuracy",
              "steps": [
                "Attempt login with invalid credentials",
                "Verify access is denied",
                "Test password complexity requirements",
                "Validate session timeout functionality"
              ],
              "complianceTags": ["FDA Cybersecurity", "HIPAA"]
            }
          ]
        })

        // setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTestCases();
    }
  }, [id]);

  // Filter test cases based on search and filters
  const filteredTestCases = projectData?.testCases?.filter(testCase => {
    const matchesSearch = testCase.testCaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testCase.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testCase.testCaseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || testCase.priority === priorityFilter;
    // Note: The API response doesn't include status, so we'll skip status filtering for now
    // const matchesStatus = statusFilter === "all" || testCase.status === statusFilter;
    return matchesSearch && matchesPriority;
  }) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "High":
        return "bg-warning/10 text-warning border-warning/20";
      case "Medium":
        return "bg-primary/10 text-primary border-primary/20";
      case "Low":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Handle retry functionality
  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading test cases...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to={`/projects/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project Details
            </Link>
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <TestTube2 className="w-12 h-12 text-destructive mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground mb-2">Error Loading Test Cases</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/projects/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project Details
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Test Cases</h1>
              <p className="text-muted-foreground mt-2">
                Generated test cases for {projectData?.projectName || 'project'}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search test cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    <option value="all">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                {/* Removed status filter since API doesn't provide status */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-accent" />
              <span>ALM Platform Sync</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Jira</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Polarion</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Azure DevOps</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Synchronize test cases directly to your Application Lifecycle Management platforms.
            </p>
          </CardContent>
        </Card>

        {/* Test Cases List */}
        <div className="space-y-4">
          {filteredTestCases.map((testCase, index) => (
            <Card key={testCase.testCaseId + index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        TC-{testCase.testCaseNo.padStart(3, '0')}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        ID: {testCase.testCaseId}
                      </span>
                      <Badge className={getPriorityColor(testCase.priority)}>
                        {testCase.priority}
                      </Badge>
                      {/* Default status badge since API doesn't provide status */}
                      <Badge className={getStatusColor("Active")}>
                        Active
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{testCase.testCaseName}</CardTitle>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">Requirement:</p>
                      <p className="text-sm text-muted-foreground">{testCase.requirement}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Test Steps */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Test Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {testCase.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Compliance Tags */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-accent" />
                      <span>Compliance Standards:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {testCase.complianceTags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Test Case #{testCase.testCaseNo}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <TestTube2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/projects/${id}/test-cases/${testCase.testCaseId}`)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTestCases.length === 0 && !loading && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <TestTube2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground">No test cases found</p>
              <p className="text-sm text-muted-foreground">
                {projectData?.testCases?.length === 0
                  ? "No test cases have been generated for this project yet."
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestCases;