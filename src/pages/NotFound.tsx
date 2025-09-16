import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Page not found</p>
          <p className="mb-6 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
