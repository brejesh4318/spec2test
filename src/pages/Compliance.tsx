import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Shield, TestTube2,Filter,Download,Clock} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from 'react';

// Types
interface TestCase {
  id: string;
  title: string;
}

interface ComplianceItem {
  id: number;
  projectId: number;
  standard: string;
  section: string;
  clause: string;
  requirement: string;
  linkedTestCases: TestCase[];
  testCaseCount: number;
}

interface ProjectData {
  totalTestCaseGenerated?: number;
  complianceTestCases?: number;
  complianceCoverage?: number;
  timeSaved?: number;
  testCasesStandard?: Record<string, number>;
  complianceData?: ComplianceItem[];
}

// Mock projects data - this could also be made dynamic if you have a projects API
const projects = [
  { id: 1, name: "Medical Device Validation" },
  { id: 2, name: "Software Risk Analysis" }
];

const Compliance = () => {
  const [projectData, setProjectData] = useState<ProjectData>({});
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [standardFilter, setStandardFilter] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "all");

  // Get compliance data from project state, fallback to empty array
  const complianceData = projectData.complianceData || [];

  const filteredData = complianceData.filter(item => {
    const matchesSearch = item.standard?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.clause?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.requirement?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStandard = standardFilter === "all" || item.standard?.includes(standardFilter);
    const matchesProject = selectedProjectId === "all" || item.projectId?.toString() === selectedProjectId;
    return matchesSearch && matchesStandard && matchesProject;
  });

   const handlePost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/v1/dash-test/",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setProjectData(data || {});
    } catch (error) {
      // fallback mock data
      const mock = {
        "totalTestCaseGenerated": 123,
        "complianceTestCases": 95,
        "complianceCoverage": 79,
        "timeSaved": 41,
        "testCasesStandard": {
            "FDA": 4,
            "IEC": 4,
            "ISO": 1
        },
        "complianceData": [
            {
                "id": 1,
                "projectId": 1,
                "standard": "FDA 21 CFR Part 820",
                "section": "820.30",
                "clause": "Design Controls",
                "requirement": "Each manufacturer of any class II or class III device shall establish and maintain procedures to control the design of the device in order to ensure that specified design requirements are met.",
                "linkedTestCases": [
                    {
                        "id": "TC-001",
                        "title": "Verify heart rate measurement accuracy"
                    },
                    {
                        "id": "TC-005",
                        "title": "Validate design requirement traceability"
                    }
                ],
                "testCaseCount": 2
            },
            {
                "id": 2,
                "projectId": 1,
                "standard": "IEC 62304",
                "section": "5.2",
                "clause": "Software requirements analysis",
                "requirement": "The manufacturer shall transform the software system requirements allocated to the software item into a documented set of software requirements for the software item.",
                "linkedTestCases": [
                    {
                        "id": "TC-002",
                        "title": "Test alarm functionality for critical values"
                    },
                    {
                        "id": "TC-006",
                        "title": "Software requirement validation"
                    }
                ],
                "testCaseCount": 2
            },
            {
                "id": 3,
                "projectId": 2,
                "standard": "ISO 13485",
                "section": "7.3.3",
                "clause": "Design and development outputs",
                "requirement": "Design and development outputs shall be in a form suitable for verification against the design and development input requirements.",
                "linkedTestCases": [
                    {
                        "id": "TC-003",
                        "title": "Validate data storage integrity"
                    }
                ],
                "testCaseCount": 1
            },
            {
                "id": 4,
                "projectId": 1,
                "standard": "FDA Cybersecurity",
                "section": "2.0",
                "clause": "Cybersecurity Risk Management",
                "requirement": "Manufacturers should implement a cybersecurity risk management process that addresses the identification, assessment, and mitigation of cybersecurity risks.",
                "linkedTestCases": [
                    {
                        "id": "TC-004",
                        "title": "Test user authentication security"
                    },
                    {
                        "id": "TC-007",
                        "title": "Cybersecurity vulnerability assessment"
                    }
                ],
                "testCaseCount": 2
            },
            {
                "id": 5,
                "projectId": 1,
                "standard": "IEC 60601-1-8",
                "section": "6.3",
                "clause": "Alarm system requirements",
                "requirement": "The alarm system shall provide auditory and visual alarm signals that are clearly distinguishable from other sounds and visual indicators.",
                "linkedTestCases": [
                    {
                        "id": "TC-002",
                        "title": "Test alarm functionality for critical values"
                    },
                    {
                        "id": "TC-008",
                        "title": "Alarm signal differentiation test"
                    }
                ],
                "testCaseCount": 2
            }
        ]
      };
      setProjectData(mock as ProjectData);
      console.error("Error in GET request:", error);
    } finally {
      setLoading(false);
    }
  };

  // call API once
  useEffect(() => {
    handlePost();
  }, []);

  // Calculate metrics dynamically from project data
  const totalTestCases = projectData.totalTestCaseGenerated || 0;
  const complianceCoveredTestCases = projectData.complianceTestCases || 0;
  const complianceCoverage = projectData.complianceCoverage || 0;
  const timeSaved = projectData.timeSaved || 0;
  
  // Get standards metrics from project data or calculate from filtered data
  const standardsMetrics = projectData.testCasesStandard || filteredData.reduce((acc, item) => {
    const standardName = item.standard?.split(' ')[0];
    if (standardName && !acc[standardName]) {
      acc[standardName] = 0;
    }
    if (standardName) {
      acc[standardName] += item.testCaseCount || 0;
    }
    return acc;
  }, {});

  const uniqueStandards = [...new Set(complianceData.map(item => item.standard?.split(' ')[0]).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading compliance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compliance Traceability</h1>
            <p className="text-muted-foreground mt-2">
              Track compliance standards and their linked test cases{selectedProjectId !== "all" ? " for selected project" : " across all projects"}.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TestTube2 className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalTestCases}</p>
                  <p className="text-sm text-muted-foreground">Total Test Cases Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{complianceCoveredTestCases}</p>
                  <p className="text-sm text-muted-foreground">Compliance-Covered Test Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{complianceCoverage}%</p>
                  <p className="text-sm text-muted-foreground">Compliance Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{timeSaved}h</p>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Standards Metrics */}
        {Object.keys(standardsMetrics).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Cases by Standard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(standardsMetrics).map(([standard, count]) => (
                  <div key={standard} className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-lg font-bold text-foreground">{Number(count) || 0}</div>
                    <div className="text-xs text-muted-foreground">{standard}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search standards, clauses, or requirements..."
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
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                    >
                      <option value="all">All Projects</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id.toString()}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={standardFilter}
                    onChange={(e) => setStandardFilter(e.target.value)}
                    className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    <option value="all">All Standards</option>
                    {uniqueStandards.map(standard => (
                      <option key={standard} value={standard}>{standard}</option>
                    ))}
                  </select>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-accent" />
              <span>Compliance Traceability Matrix</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {item.standard}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Section {item.section}
                          </Badge>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <TestTube2 className="w-3 h-3 mr-1" />
                            {item.testCaseCount} tests
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">{item.clause}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.requirement}</p>
                      </div>
                    </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground mb-3">Linked Test Cases:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(item.linkedTestCases || []).map((testCase) => (
                        <div
                          key={testCase.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                        >
                          <div>
                            <span className="font-mono text-xs text-muted-foreground">{testCase.id}</span>
                            <p className="text-sm font-medium text-foreground">{testCase.title}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredData.length === 0 && !loading && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground">No compliance data found</p>
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

export default Compliance;