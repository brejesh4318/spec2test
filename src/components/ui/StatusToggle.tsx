import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatusToggleProps {
  currentStatus: string;
  availableStatuses: string[];
  onStatusChange: (newStatus: string) => void;
  getStatusColor: (status: string) => string;
  size?: "sm" | "default";
}

export const StatusToggle = ({
  currentStatus,
  availableStatuses,
  onStatusChange,
  getStatusColor,
  size = "default"
}: StatusToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`${getStatusColor(currentStatus)} border-2 hover:opacity-80`}
        >
          {currentStatus}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {availableStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => {
              onStatusChange(status);
              setIsOpen(false);
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className={getStatusColor(status).split(' ')[1]}>{status}</span>
            {currentStatus === status && <Check className="w-3 h-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface PriorityToggleProps {
  currentPriority: string;
  onPriorityChange: (newPriority: string) => void;
  size?: "sm" | "default";
}

export const PriorityToggle = ({
  currentPriority,
  onPriorityChange,
  size = "default"
}: PriorityToggleProps) => {
  const priorities = ["Critical", "High", "Medium", "Low"];
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "High":
        return "bg-warning/10 text-warning border-warning/20";
      case "Medium":
        return "bg-primary/10 text-primary border-primary/20";
      case "Low":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <StatusToggle
      currentStatus={currentPriority}
      availableStatuses={priorities}
      onStatusChange={onPriorityChange}
      getStatusColor={getPriorityColor}
      size={size}
    />
  );
};

interface ProjectStatusToggleProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  size?: "sm" | "default";
}

export const ProjectStatusToggle = ({
  currentStatus,
  onStatusChange,
  size = "default"
}: ProjectStatusToggleProps) => {
  const statuses = ["active", "in-progress", "completed"];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
      case "in-progress":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <StatusToggle
      currentStatus={currentStatus}
      availableStatuses={statuses}
      onStatusChange={onStatusChange}
      getStatusColor={getStatusColor}
      size={size}
    />
  );
};

interface TestCaseStatusToggleProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  size?: "sm" | "default";
}

export const TestCaseStatusToggle = ({
  currentStatus,
  onStatusChange,
  size = "default"
}: TestCaseStatusToggleProps) => {
  const statuses = ["Active", "Review", "Completed", "Draft"];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Completed":
        return "bg-primary/10 text-primary border-primary/20";
      case "Draft":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <StatusToggle
      currentStatus={currentStatus}
      availableStatuses={statuses}
      onStatusChange={onStatusChange}
      getStatusColor={getStatusColor}
      size={size}
    />
  );
};