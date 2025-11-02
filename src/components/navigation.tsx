import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, FileText, Shield, Plus } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: Activity },
    { to: "/projects", label: "Projects", icon: FileText },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Spec2Test</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Create Project Button */}
          <NavLink to="/create-project">
            {/* <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </Button> */}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;