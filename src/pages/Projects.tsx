import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Calendar, 
  TestTube2, 
  Shield,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Mock data for projects
const projects = [
  {
    id: 1,
    name: "Medical Device Validation",
    description: "FDA compliance test cases for cardiac monitoring device",
    testCases: 156,
    compliance: 94,
    status: "active",
    createdDate: "2024-01-15",
    lastUpdated: "2 hours ago",
    standards: ["FDA 21 CFR Part 820", "ISO 13485"],
    documentsCount: 12
  },
  {
    id: 2,
    name: "Software Risk Analysis",
    description: "IEC 62304 software lifecycle compliance for imaging software",
    testCases: 89,
    compliance: 91,
    status: "review",
    createdDate: "2024-01-10",
    lastUpdated: "1 day ago",
    standards: ["IEC 62304", "ISO 14971"],
    documentsCount: 8
  },
  {
    id: 3,
    name: "Quality Management System",
    description: "ISO 13485 quality system validation for surgical instruments",
    testCases: 203,
    compliance: 97,
    status: "completed",
    createdDate: "2023-12-20",
    lastUpdated: "3 days ago",
    standards: ["ISO 13485", "ISO 14971"],
    documentsCount: 15
  },
  {
    id: 4,
    name: "Cybersecurity Assessment",
    description: "FDA cybersecurity compliance for connected medical devices",
    testCases: 67,
    compliance: 88,
    status: "active",
    createdDate: "2024-01-05",
    lastUpdated: "5 hours ago",
    standards: ["FDA Cybersecurity", "NIST Framework"],
    documentsCount: 6
  }
];

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <TestTube2 className="w-4 h-4 text-accent" />
                        <span>{project.testCases} tests</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-success" />
                        <span>{project.documentsCount} documents</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{project.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Standards */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Compliance Standards:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.standards.map((standard) => (
                        <Badge key={standard} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {project.documentsCount} documents uploaded
                    </span>
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
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
                    : "Create your first project to get started with test case generation"
                  }
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