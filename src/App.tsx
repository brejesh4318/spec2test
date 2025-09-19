import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/navigation";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import TestCases from "./pages/TestCases";
import TestCaseDetail from "./pages/TestCaseDetail";   // ✅ import your new page
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";
import UploadRequirements from "./pages/upload-requirements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/upload-requirements" element={<UploadRequirements />} />
          <Route path="/projects/:id/test-cases" element={<TestCases />} />
          <Route path="/projects/:id/test-cases/:testCaseId" element={<TestCaseDetail />} /> {/* ✅ new detail route */}
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/compliance/:projectId" element={<Compliance />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
