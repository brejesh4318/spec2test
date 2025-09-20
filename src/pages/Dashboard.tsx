import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/stats-card";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import {TestTube2,Shield,FolderOpen,Clock,ExternalLink,Plus} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/healthcare-hero.jpg";


const Dashboard = () => {
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [totalCases, setTotalCases] = useState(0);
const [complianceCases, setComplianceCases] = useState(0);
const [complianceCoverage, setComplianceCoverage] = useState(0);
const [timeSaved, setTimeSaved] = useState(0);
  const handlePost = async () => {
  try {
    const response = await axios.get(
      "https://spec2test-513267201789.asia-south1.run.app/v1/dash-test/dashboardData",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data; // ✅ axios auto-parses JSON
    setRecentProjects(data?.recentProject || []);
    setTotalCases(data.TotalTestCasesGenerated);
    setComplianceCoverage(data.complianceCoverage);
    setComplianceCases(data.complianceCoveredTestCases);
    setTimeSaved(data.timeSaved);

    console.log("API Response:", data);
  } catch (error) {
    // setTotalCases(456)
      // setComplianceCoverage(91)
      // setComplianceCases(364)
      // setTimeSaved(108)
      // setRecentProjects([
      //   {
      //     "projectName": "Cardiac Monitoring System",
      //     "projectId": "123456",
      //     "TestCasesGenerated": 234,
      //     "description": "FDA compliance test cases for cardiac monitor",
      //     "UpdatedTime": "2 hours",
      //     "status": "active"
      //   },
      //   {
      //     "projectName": "Patient Data Platform",
      //     "projectId": "123456",
      //     "TestCasesGenerated": 234,
      //     "description": "IEC 62304 software lifecycle compliance",
      //     "UpdatedTime": "1 day",
      //     "status": "review"
      //   },
      //   {
      //     "projectName": "Medical Device Integration",
      //     "projectId": "123456",
      //     "TestCasesGenerated": 234,
      //     "description": "ISO 13485 quality system validation",
      //     "UpdatedTime": "3 days",
      //     "status": "completed"
      //   }
      // ])
    console.error("Error in GET request:", error);
  }
};

  useEffect(() => {
    console.log("coming here")
    handlePost();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Healthcare Test Case Generation Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline your medical device compliance with automated test case generation
              and traceability management.
            </p>
            <Link to="/create-project">
              <Button size="lg" className="text-lg px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                Start New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Test Cases Generated"
            value={totalCases}
            description="Across all projects"
            icon={TestTube2}
          />
          <StatsCard
            title="Compliance-Covered Test Cases"
            value={complianceCases}
            description="Mapped to compliance standards"
            icon={Shield}
          />
          <StatsCard
            title="Compliance Coverage"
            value={`${complianceCoverage}%`}
            description="Test cases with compliance mapping"
            icon={Shield}
          />
          <StatsCard
            title="Time Saved"
            value={`${timeSaved} Hours`}
            description="Automated test generation"
            icon={Clock}
          />
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Recent Projects</CardTitle>
            <Link to="/projects">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View All Projects
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 && recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{project.projectName}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${project.status === "completed"
                            ? "bg-success/10 text-success"
                            : project.status === "active"
                              ? "bg-primary/10 text-primary"
                              : "bg-warning/10 text-warning"
                          }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>{project.TestCasesGenerated} test cases</span>
                      <span>Updated {project.UpdatedTime} ago</span>
                    </div>
                  </div>
                  <Link to={`/projects/${project.projectId}/test-cases`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;