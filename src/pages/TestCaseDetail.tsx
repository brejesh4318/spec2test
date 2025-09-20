import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, TestTube2, Shield, AlertTriangle, FileText, Clock, User, Settings, Loader2 } from "lucide-react";
import { PriorityToggle, TestCaseStatusToggle } from "@/components/ui/StatusToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const TestCaseDetail = () => {
  const { id, testCaseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [testCase, setTestCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const API_BASE_URL = 'http://localhost:3000/api';

  // Mock data fallback
  const mockTestCaseData = {
    "id": "TC-001",
    "featureModule": "User Authentication System",
    "title": "Verify heart rate measurement accuracy",
    "type": "Positive",
    "priority": "High",
    "status": "Active",
    "preconditions": [
      "Device must be calibrated and functioning properly",
      "Patient simulator must be connected and operational",
      "Test environment temperature between 20-25°C",
      "Device battery level above 50%"
    ],
    "testData": [
      { "field": "Simulator Heart Rate", "value": "60 BPM" },
      { "field": "Test Duration", "value": "30 seconds" },
      { "field": "Acceptable Range", "value": "±2 BPM" },
      { "field": "Sample Rate", "value": "1 Hz" }
    ],
    "stepsToExecute": [
      "Connect device to patient simulator using standard cable",
      "Set simulator to generate 60 BPM heart rate signal",
      "Start device monitoring and begin recording measurements",
      "Record device measurement readings for 30 seconds continuously",
      "Calculate average measurement and verify within 58-62 BPM range",
      "Document any deviations or anomalies observed"
    ],
    "expectedResults": [
      "Device displays heart rate readings within ±2 BPM of simulator setting",
      "All measurements fall within 58-62 BPM range",
      "No error messages or warnings displayed during test",
      "Measurement stability maintained throughout 30-second period",
      "Device responds within 5 seconds of signal detection"
    ],
    "postconditions": [
      "Device returns to standby mode",
      "Test data is automatically saved to device memory",
      "Simulator connection can be safely disconnected",
      "Device remains in operational state for next test"
    ],
    "complianceStandard": "FDA 21 CFR Part 820",
    "complianceClause": "820.30(g)",
    "complianceRequirementText": "Design controls shall include procedures for ensuring that the design requirements relating to a device are appropriate and address the intended use of the device, including the performance and safety requirements."
  };

  // Fetch test case data from API using axios
  const fetchTestCase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:3000/v1/dash-test/getTestCaseDetail/${testCaseId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      });
      console.log('API Response:', response.data.test_case);
      if (response.data.test_case) {
        setTestCase(response.data.test_case);
        toast({
          title: "Success",
          description: "Test case data loaded successfully.",
        });
      }
    } catch (err) {
      console.error('API Error:', err);
      
      // Use mock data as fallback
      // setTestCase(mockTestCaseData);
      setError(null); // Clear error since we're using mock data
      
      // Show different toast based on error type
      if (err.code === 'ECONNABORTED') {
        toast({
          title: "Timeout",
          description: "API request timed out. Using offline data.",
          variant: "destructive",
        });
      } else if (err.response) {
        toast({
          title: "API Error",
          description: `Server responded with error ${err.response.status}. Using offline data.`,
          variant: "destructive",
        });
      } else if (err.request) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to server. Using offline data.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load test case data. Using offline data.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Local state update functions (no API calls)
  const handlePriorityChange = (newPriority) => {
    setTestCase(prev => ({ ...prev, priority: newPriority }));
    toast({
      title: "Priority Updated",
      description: `Test case priority changed to ${newPriority}`,
    });
  };

  const handleStatusChange = (newStatus) => {
    setTestCase(prev => ({ ...prev, status: newStatus }));
    toast({
      title: "Status Updated",
      description: `Test case status changed to ${newStatus}`,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Test Case Deleted",
      description: "The test case has been successfully deleted.",
    });
    navigate(`/projects/${id}/test-cases`);
  };

  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "Editing functionality would open here.",
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    if (testCaseId) {
      fetchTestCase();
    }
  }, [testCaseId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-muted-foreground">Loading test case...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - only show if we don't have test case data
  if (error && !testCase) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">Failed to Load Test Case</h2>
              <p className="text-muted-foreground mt-2">
                {error || "Test case not found"}
              </p>
              <div className="flex space-x-4 mt-4">
                <Button onClick={() => fetchTestCase()} variant="outline">
                  Try Again
                </Button>
                <Link to={`/projects/${id}/test-cases`}>
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Test Cases
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we don't have testCase data, don't render
  if (!testCase) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">No Test Case Data</h2>
              <p className="text-muted-foreground mt-2">Unable to load test case information</p>
              <Link to={`/projects/${id}/test-cases`} className="mt-4 inline-block">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Test Cases
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/projects/${id}/test-cases`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Test Cases
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-sm text-muted-foreground">{testCase.id}</span>
                <PriorityToggle
                  currentPriority={testCase.priority}
                  onPriorityChange={handlePriorityChange}
                  size="sm"
                />
                <TestCaseStatusToggle
                  currentStatus={testCase.status}
                  onStatusChange={handleStatusChange}
                  size="sm"
                />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{testCase.title}</h1>
              <p className="text-muted-foreground mt-2">
                Detailed test case specifications and execution guidelines
              </p>
            </div>

            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Test Case</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this test case? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-accent" />
                  <span>Test Case Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Test Case ID</label>
                    <p className="text-sm text-muted-foreground font-mono">{testCase.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Feature / Module</label>
                    <p className="text-sm text-muted-foreground">{testCase.featureModule}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Type</label>
                    <Badge variant="outline" className="mt-1">{testCase.type}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Title</label>
                    <p className="text-sm text-muted-foreground">{testCase.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Data */}
            {testCase.testData && testCase.testData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-accent" />
                    <span>Test Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testCase.testData.map((data, index) => (
                      <div key={index} className="bg-secondary/50 p-3 rounded-lg">
                        <label className="text-sm font-medium text-foreground">{data.field}</label>
                        <p className="text-sm text-muted-foreground font-mono">{data.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preconditions */}
            {testCase.preconditions && testCase.preconditions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <span>Preconditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testCase.preconditions.map((condition, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Steps to Execute */}
            {testCase.stepsToExecute && testCase.stepsToExecute.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TestTube2 className="w-5 h-5 text-primary" />
                    <span>Steps to Execute</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {testCase.stepsToExecute.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Expected Results */}
            {testCase.expectedResults && testCase.expectedResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TestTube2 className="w-5 h-5 text-success" />
                    <span>Expected Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testCase.expectedResults.map((result, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{result}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Postconditions */}
            {testCase.postconditions && testCase.postconditions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-accent" />
                    <span>Postconditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testCase.postconditions.map((condition, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Information */}
            {(testCase.complianceStandard || testCase.complianceClause || testCase.complianceRequirementText) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-accent" />
                    <span>Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testCase.complianceStandard && (
                    <div>
                      <label className="text-sm font-medium text-foreground">Compliance Standard</label>
                      <Badge variant="outline" className="mt-1 w-full justify-start">
                        {testCase.complianceStandard}
                      </Badge>
                    </div>
                  )}

                  {testCase.complianceClause && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-foreground">Compliance Clause</label>
                        <p className="text-sm text-muted-foreground font-mono mt-1">{testCase.complianceClause}</p>
                      </div>
                    </>
                  )}

                  {testCase.complianceRequirementText && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-foreground">Compliance Requirement Text</label>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {testCase.complianceRequirementText}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Test Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-accent" />
                  <span>Test Metadata</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm text-foreground">
                    {testCase.createdAt ? new Date(testCase.createdAt).toLocaleDateString() : "Jan 15, 2024"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span className="text-sm text-foreground">
                    {testCase.updatedAt ? new Date(testCase.updatedAt).toLocaleDateString() : "2 hours ago"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created By:</span>
                  <span className="text-sm text-foreground">
                    {testCase.createdBy || "John Doe"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reviewed By:</span>
                  <span className="text-sm text-foreground">
                    {testCase.reviewedBy || "Jane Smith"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseDetail;