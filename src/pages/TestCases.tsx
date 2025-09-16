import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  TestTube2,
  Workflow,
  Shield
} from "lucide-react";

// Mock test cases data
const testCases = [
  {
    id: "TC-001",
    title: "Verify heart rate measurement accuracy",
    requirement: "Device shall measure heart rate with ±2 BPM accuracy",
    steps: [
      "Connect device to patient simulator",
      "Set simulator to 60 BPM",
      "Record device measurement for 30 seconds",
      "Verify measurement is within 58-62 BPM range"
    ],
    complianceTags: ["FDA 21 CFR Part 820", "ISO 13485"],
    priority: "High",
    status: "Active"
  },
  {
    id: "TC-002", 
    title: "Test alarm functionality for critical values",
    requirement: "System shall trigger alarm for HR > 120 BPM within 5 seconds",
    steps: [
      "Set patient simulator to 125 BPM",
      "Start device monitoring",
      "Measure time to alarm activation",
      "Verify alarm triggers within 5 seconds"
    ],
    complianceTags: ["IEC 60601-1-8", "FDA 21 CFR Part 820"],
    priority: "Critical",
    status: "Active"
  },
  {
    id: "TC-003",
    title: "Validate data storage integrity",
    requirement: "Device shall store 24 hours of continuous data without loss",
    steps: [
      "Start continuous monitoring session",
      "Monitor for 24 hours",
      "Verify all data points are stored",
      "Check for data corruption or gaps"
    ],
    complianceTags: ["FDA 21 CFR Part 11", "ISO 13485"],
    priority: "Medium",
    status: "Review"
  },
  {
    id: "TC-004",
    title: "Test user authentication security",
    requirement: "System shall require secure user authentication",
    steps: [
      "Attempt login with invalid credentials",
      "Verify access is denied",
      "Test password complexity requirements",
      "Validate session timeout functionality"
    ],
    complianceTags: ["FDA Cybersecurity", "HIPAA"],
    priority: "High", 
    status: "Active"
  }
];

const TestCases = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || testCase.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || testCase.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "High":
        return "bg-warning/10 text-warning border-warning/20";
      case "Medium":
        return "bg-primary/10 text-primary border-primary/20";
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
                Generated test cases for Medical Device Validation project
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
                  </select>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
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
          {filteredTestCases.map((testCase) => (
            <Card key={testCase.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">{testCase.id}</span>
                      <Badge className={getPriorityColor(testCase.priority)}>
                        {testCase.priority}
                      </Badge>
                      <Badge className={getStatusColor(testCase.status)}>
                        {testCase.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{testCase.title}</CardTitle>
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
                      {testCase.steps.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
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
                      {testCase.complianceTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Last updated: 2 hours ago
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <TestTube2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
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

        {filteredTestCases.length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <TestTube2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground">No test cases found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestCases;