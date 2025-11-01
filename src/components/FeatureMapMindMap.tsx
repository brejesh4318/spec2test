import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Feature {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
  compliance: string[];
  status: "pending" | "in-progress" | "completed";
}

interface TestCase {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  compliance: string[];
}

interface FeatureMapMindMapProps {
  features: Feature[];
}

const getStatusColor = (status: Feature["status"]) => {
  switch (status) {
    case "completed": return "#10b981";
    case "in-progress": return "#f59e0b";
    case "pending": return "#6b7280";
  }
};

const getPriorityColor = (priority: TestCase["priority"]) => {
  switch (priority) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#6b7280";
  }
};

export const FeatureMapMindMap = ({ features }: FeatureMapMindMapProps) => {
const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    
    const totalTestCases = features.reduce((sum, f) => sum + f.testCases.length, 0);
    const testCasesPerColumn = 5; // Maximum test cases per column
    const testCaseWidth = 220;
    const testCaseHeight = 100;
    const verticalSpacing = 30;
    const horizontalSpacing = 100;
    const featureHeight = 120;
    
    // Calculate grid dimensions
    const columns = Math.ceil(totalTestCases / testCasesPerColumn);
    const gridWidth = columns * (testCaseWidth + horizontalSpacing);
    
    // Root node - centered at top
    const rootX = (gridWidth / 2) - 100;
    nodes.push({
      id: "root",
      type: "default",
      data: { 
        label: (
          <div className="px-6 py-3">
            <div className="font-bold text-lg">Medical Device Validation</div>
            <div className="text-xs text-muted-foreground mt-1">{totalTestCases} test cases</div>
          </div>
        )
      },
      position: { x: rootX, y: 50 },
      style: {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "2px solid hsl(var(--primary))",
        borderRadius: "12px",
        fontSize: "14px",
        width: 280,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
      sourcePosition: Position.Bottom,
    });

    // Feature node - centered below root
    features.forEach((feature, featureIndex) => {
      const featureX = rootX + 40;
      const featureY = 220;
      
      nodes.push({
        id: feature.id,
        type: "default",
        data: { 
          label: (
            <div className="px-4 py-3 text-center">
              <div className="font-semibold text-base mb-2">{feature.name}</div>
              <Badge 
                style={{ 
                  backgroundColor: getStatusColor(feature.status),
                  fontSize: "11px",
                  padding: "4px 8px"
                }}
              >
                {feature.status}
              </Badge>
              <div className="text-xs text-muted-foreground mt-2">
                {feature.testCases.length} test cases
              </div>
            </div>
          )
        },
        position: { x: featureX, y: featureY },
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: `3px solid ${getStatusColor(feature.status)}`,
          borderRadius: "12px",
          fontSize: "13px",
          width: 280,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      // Test case nodes - arranged in grid layout
      feature.testCases.forEach((testCase, testIndex) => {
        const column = Math.floor(testIndex / testCasesPerColumn);
        const row = testIndex % testCasesPerColumn;
        
        const testX = (column * (testCaseWidth + horizontalSpacing)) + 50;
        const testY = 450 + (row * (testCaseHeight + verticalSpacing));
        
        // Get first compliance tag for display
        const complianceTag = testCase.compliance && testCase.compliance.length > 0 
          ? testCase.compliance[0] 
          : "N/A";
        
        nodes.push({
          id: testCase.id,
          type: "default",
          data: { 
            label: (
              <div className="px-3 py-2">
                <div className="text-xs font-semibold mb-2 line-clamp-2 leading-tight">
                  {testCase.title}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Badge 
                    style={{ 
                      backgroundColor: getPriorityColor(testCase.priority),
                      fontSize: "9px",
                      padding: "2px 6px",
                      flexShrink: 0
                    }}
                  >
                    {testCase.priority}
                  </Badge>
                  <span className="text-[9px] text-muted-foreground truncate">
                    {complianceTag}
                  </span>
                </div>
              </div>
            )
          },
          position: { x: testX, y: testY },
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: `2px solid ${getPriorityColor(testCase.priority)}`,
            borderRadius: "8px",
            fontSize: "11px",
            width: testCaseWidth,
            height: testCaseHeight,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          },
          targetPosition: Position.Top,
        });
      });
    });

    return nodes;
  }, [features]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    // Connect root to features
    features.forEach((feature) => {
      edges.push({
        id: `root-${feature.id}`,
        source: "root",
        target: feature.id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(var(--primary))",
        },
      });

      // Connect features to test cases
      feature.testCases.forEach((testCase) => {
        edges.push({
          id: `${feature.id}-${testCase.id}`,
          source: feature.id,
          target: testCase.id,
          type: "smoothstep",
          style: { 
            stroke: getStatusColor(feature.status), 
            strokeWidth: 1.5 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: getStatusColor(feature.status),
          },
        });
      });
    });

    return edges;
  }, [features]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card className="w-full h-[800px] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.id === "root") return "hsl(var(--primary))";
            return "hsl(var(--secondary))";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </Card>
  );
};
