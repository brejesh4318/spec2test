import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, ExternalLink, Calendar, TestTube2, Shield, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Projects = () => {
  const [project, setProject] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handlePost = async () => {
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
      setProject(data?.Project || []);
    } catch (error) {
      // fallback mock data
      const mock = [
        {
          projectName: "Cardiac Monitoring System",
          projectId: "123456",
          TestCasesGenerated: 234,
          description: "FDA compliance test cases for cardiac monitor",
          UpdatedTime: "2 hours",
          status: "active",
          documents: "2",
          complianceStandards: ["FDA 21 CFR Part 820", "ISO 13485"],
        },
        {
          projectName: "Software Risk Analysis",
          projectId: "654321",
          TestCasesGenerated: 150,
          description: "Risk assessment for medical software",
          UpdatedTime: "1 day",
          status: "review",
          documents: "3",
          complianceStandards: ["ISO 14971"],
        },
         {
        "projectName": "Cybersecurity Assessment",
        "projectId": "789012",
        "TestCasesGenerated": 180,
        "description": "Security assessment for medical devices",
        "UpdatedTime": "3 hours",
        "status": "active",
        "documents": "4",
        "complianceStandards": [
            "FDA 21 CFR Part 820",
            "IEC 62304"
        ]
    },
    {
        "projectName": "Quality Management System",
        "projectId": "345678",
        "TestCasesGenerated": 120,
        "description": "QMS implementation and validation",
        "UpdatedTime": "5 hours",
        "status": "review",
        "documents": "3",
        "complianceStandards": [
            "ISO 13485",
            "ISO 14971"
        ]
    }
      ];
      setProject(mock);
      console.error("Error in GET request:", error);
    }
  };

  // call API once
  useEffect(() => {
    handlePost();
  }, []);

  // derive filteredProjects whenever project, searchTerm, or statusFilter changes
  useEffect(() => {
    const filtered = project.filter((p) => {
      const matchesSearch =
        (p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false) ||
        (p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setFilteredProjects(filtered);
  }, [project, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
      case "review":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage your healthcare compliance projects and test case generation.
            </p>
          </div>
          <Link to="/create-project">
            <Button className="mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((p) => (
            <Card
              key={p.projectId}
              className="hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {p.projectName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                  <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <TestTube2 className="w-4 h-4 text-accent" />
                        <span>{p.TestCasesGenerated} tests</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-success" />
                        <span>{p.documents} documents</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{p.UpdatedTime}</span>
                    </div>
                  </div>

                  {/* Standards */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Compliance Standards:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {p.complianceStandards?.map((standard: string) => (
                        <Badge key={standard} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {p.documents} documents uploaded
                    </span>
                    <Link to={`/projects/${p.projectId}/upload-requirements`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Upload Requirements
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <TestTube2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No projects found</p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first project to get started with test case generation"}
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && (
                <Link to="/create-project">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Project
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;