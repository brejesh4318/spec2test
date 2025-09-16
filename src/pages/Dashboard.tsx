import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/stats-card";
import { 
  TestTube2, 
  Shield, 
  FolderOpen, 
  Clock, 
  ExternalLink,
  Plus 
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/healthcare-hero.jpg";

// Mock data for demonstration
const recentProjects = [
  {
    id: 1,
    name: "Medical Device Validation",
    description: "FDA compliance test cases for cardiac monitor",
    testCases: 156,
    compliance: 94,
    lastUpdated: "2 hours ago",
    status: "active"
  },
  {
    id: 2,
    name: "Software Risk Analysis",
    description: "IEC 62304 software lifecycle compliance",
    testCases: 89,
    compliance: 91,
    lastUpdated: "1 day ago",
    status: "review"
  },
  {
    id: 3,
    name: "Quality Management System",
    description: "ISO 13485 quality system validation",
    testCases: 203,
    compliance: 97,
    lastUpdated: "3 days ago",
    status: "completed"
  }
];

const Dashboard = () => {
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
            value="1,247"
            description="Across all projects"
            icon={TestTube2}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Compliance-Covered Test Cases"
            value="984"
            description="Mapped to compliance standards"
            icon={Shield}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Compliance Coverage"
            value="79%"
            description="Test cases with compliance mapping"
            icon={Shield}
          />
          <StatsCard
            title="Time Saved"
            value="156h"
            description="Automated test generation"
            icon={Clock}
            trend={{ value: 23, isPositive: true }}
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
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          project.status === "completed"
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
                      <span>{project.testCases} test cases</span>
                      <span>Updated {project.lastUpdated}</span>
                    </div>
                  </div>
                  <Link to={`/projects/${project.id}`}>
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