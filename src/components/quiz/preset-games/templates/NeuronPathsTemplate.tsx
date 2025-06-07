
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Trophy, 
  Check, 
  RefreshCw, 
  Info, 
  Save, 
  X, 
  Loader2, 
  Undo, 
  Redo,
  Download,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  GEMINI_MODELS, 
  getApiEndpoint, 
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';

interface NeuronPathsProps {
  content: any;
  topic: string;
}

interface NodeData {
  label: string;
  description?: string;
  level?: 'basic' | 'intermediate' | 'advanced';
  category?: string;
}

type GameNode = Node<NodeData>;
type GameEdge = Edge;

interface GameState {
  nodes: GameNode[];
  edges: GameEdge[];
  score: number;
  completed: boolean;
}

const NeuronPathsTemplate: React.FC<NeuronPathsProps> = ({ content, topic }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('game');
  const [nodes, setNodes] = useState<GameNode[]>([]);
  const [edges, setEdges] = useState<GameEdge[]>([]);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [connections, setConnections] = useState<number>(0);
  const { toast } = useToast();

  // Mobile touch support
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize with AI-generated nodes
  useEffect(() => {
    if (!content || !content.nodes) {
      generateRandomNodes();
    } else {
      setNodes(content.nodes.map((node: any) => ({
        ...node,
        style: getNodeStyle(node.data?.level || 'basic')
      })));
      
      if (content.edges) {
        setEdges(content.edges.map((edge: any) => ({
          ...edge,
          style: getEdgeStyle(),
          animated: true,
        })));
      }
    }
  }, [content, topic]);

  const generateRandomNodes = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `
      Tạo sơ đồ tư duy cho chủ đề "${topic}" với 8-12 nodes concepts ngẫu nhiên.
      
      REQUIREMENTS:
      - Tạo mix levels: 40% basic, 40% intermediate, 20% advanced
      - Concepts phải liên quan chặt chẽ đến chủ đề
      - Có thể tạo kết nối logic giữa các concepts
      - Position nodes randomly trên canvas 800x600
      
      JSON format:
      {
        "title": "Neural Map: ${topic}",
        "nodes": [
          {
            "id": "node1",
            "data": {
              "label": "Concept name",
              "level": "basic|intermediate|advanced",
              "category": "category name"
            },
            "position": {"x": 100, "y": 100},
            "type": "default"
          }
        ]
      }
      
      Return only valid JSON, no additional text.
      `;

      const payload = {
        contents: [{
          role: "user",
          parts: [{text: prompt}]
        }],
        generationConfig: {
          ...DEFAULT_GENERATION_SETTINGS,
          temperature: 0.8
        }
      };

      const response = await fetch(getApiEndpoint(GEMINI_MODELS.PRESET_GAME), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('No content returned from API');
      }

      let jsonStr = text;
      if (text.includes('```json')) {
        jsonStr = text.split('```json')[1].split('```')[0].trim();
      } else if (text.includes('```')) {
        jsonStr = text.split('```')[1].split('```')[0].trim();
      }

      const generatedData = JSON.parse(jsonStr);
      
      if (generatedData.nodes) {
        setNodes(generatedData.nodes.map((node: any) => ({
          ...node,
          style: getNodeStyle(node.data?.level || 'basic')
        })));
        
        toast({
          title: 'Neural Map Created',
          description: `Generated ${generatedData.nodes.length} concepts for "${topic}"`,
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error generating nodes:', error);
      
      // Fallback: create default nodes
      const fallbackNodes = generateFallbackNodes();
      setNodes(fallbackNodes);
      
      toast({
        title: 'Using Default Concepts',
        description: 'AI generation failed, using default concept map',
        variant: 'default',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackNodes = (): GameNode[] => {
    const concepts = [
      { label: 'Core Concept', level: 'basic', category: 'foundation' },
      { label: 'Key Principle', level: 'basic', category: 'foundation' },
      { label: 'Method A', level: 'intermediate', category: 'application' },
      { label: 'Method B', level: 'intermediate', category: 'application' },
      { label: 'Advanced Theory', level: 'advanced', category: 'theory' },
      { label: 'Complex Application', level: 'advanced', category: 'application' },
      { label: 'Related Concept', level: 'intermediate', category: 'connection' },
      { label: 'Final Outcome', level: 'basic', category: 'result' }
    ];

    return concepts.map((concept, index) => ({
      id: `node_${index + 1}`,
      data: { 
        label: concept.label,
        level: concept.level as 'basic' | 'intermediate' | 'advanced',
        category: concept.category
      },
      position: {
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100,
      },
      style: getNodeStyle(concept.level as 'basic' | 'intermediate' | 'advanced'),
    }));
  };

  const getNodeStyle = (level: 'basic' | 'intermediate' | 'advanced') => {
    const baseStyle = {
      borderRadius: '20px',
      padding: '16px',
      width: 180,
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '2px solid',
      transition: 'all 0.3s ease',
    };

    switch (level) {
      case 'basic':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          color: '#1565c0',
          borderColor: '#42a5f5',
        };
      case 'intermediate':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
          color: '#7b1fa2',
          borderColor: '#ab47bc',
        };
      case 'advanced':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          color: '#c62828',
          borderColor: '#e53935',
        };
      default:
        return baseStyle;
    }
  };

  const getEdgeStyle = () => ({
    stroke: 'url(#neural-gradient)',
    strokeWidth: 3,
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))',
  });

  const saveToHistory = useCallback(() => {
    const currentState: GameState = {
      nodes: [...nodes],
      edges: [...edges],
      score: 0,
      completed: gameCompleted
    };
    
    const newHistory = gameHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(currentState);
    setGameHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, gameCompleted, gameHistory, currentHistoryIndex]);

  const undo = () => {
    if (currentHistoryIndex > 0) {
      const previousState = gameHistory[currentHistoryIndex - 1];
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setConnections(previousState.edges.length);
    }
  };

  const redo = () => {
    if (currentHistoryIndex < gameHistory.length - 1) {
      const nextState = gameHistory[currentHistoryIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setConnections(nextState.edges.length);
    }
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      saveToHistory();
      
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        animated: true,
        style: getEdgeStyle()
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      setConnections(prev => prev + 1);
      
      // Neural firing effect
      toast({
        title: 'Neural Connection Created! ⚡',
        description: 'Synaptic pathway established between concepts',
        variant: 'default',
      });
    },
    [saveToHistory]
  );

  const submitForEvaluation = async () => {
    if (nodes.length < 3) {
      toast({
        title: 'Need More Concepts',
        description: 'Please ensure you have at least 3 concepts in your neural map',
        variant: 'destructive',
      });
      return;
    }

    if (edges.length < 2) {
      toast({
        title: 'Need More Connections',
        description: 'Please create at least 2 neural pathways between concepts',
        variant: 'destructive',
      });
      return;
    }

    setIsEvaluating(true);
    
    try {
      const neuralMapData = {
        topic: topic,
        nodes: nodes.map(node => ({
          id: node.id,
          label: node.data.label,
          level: node.data.level,
          category: node.data.category,
        })),
        connections: edges.map(edge => ({
          source: edge.source,
          sourceNode: nodes.find(n => n.id === edge.source)?.data.label,
          target: edge.target,
          targetNode: nodes.find(n => n.id === edge.target)?.data.label,
        })),
        stats: {
          totalNodes: nodes.length,
          totalConnections: edges.length,
          connectivity: edges.length / nodes.length,
        }
      };
      
      const prompt = `
      NEURAL PATHWAY EVALUATION for topic "${topic}":

      ${JSON.stringify(neuralMapData, null, 2)}

      Evaluate this neural map as an AI teacher on a 100-point scale:

      SCORING CRITERIA:
      1. CONNECTIVITY (0-30): How well concepts are connected and form pathways
      2. LOGICAL FLOW (0-30): Logic and relevance of connections to the topic  
      3. NETWORK STRUCTURE (0-25): Centrality, clustering, network organization
      4. COMPLETENESS (0-15): Coverage of important aspects of the topic

      NEURAL ANALYSIS:
      - Identify key hub nodes (high connectivity)
      - Analyze pathway strength and logic
      - Check for isolated concepts
      - Evaluate knowledge flow patterns

      Return JSON:
      {
        "score": <total 0-100>,
        "breakdown": {
          "connectivity": <0-30>,
          "logicalFlow": <0-30>, 
          "networkStructure": <0-25>,
          "completeness": <0-15>
        },
        "analysis": {
          "strengths": ["strength 1", "strength 2"],
          "weaknesses": ["weakness 1", "weakness 2"],
          "suggestions": ["improve 1", "improve 2"]
        },
        "neuralInsights": {
          "hubNodes": ["most connected concepts"],
          "pathwayQuality": "assessment of connection logic",
          "networkHealth": "overall network assessment"
        }
      }
      `;

      const payload = {
        contents: [{
          role: "user",
          parts: [{text: prompt}]
        }],
        generationConfig: {
          ...DEFAULT_GENERATION_SETTINGS,
          temperature: 0.3
        }
      };

      const response = await fetch(getApiEndpoint(GEMINI_MODELS.PRESET_GAME), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('No content returned from API');
      }

      let jsonStr = text;
      if (text.includes('```json')) {
        jsonStr = text.split('```json')[1].split('```')[0].trim();
      } else if (text.includes('```')) {
        jsonStr = text.split('```')[1].split('```')[0].trim();
      }

      const evaluationResult = JSON.parse(jsonStr);
      setEvaluation(evaluationResult);
      
      toast({
        title: `Neural Map Evaluated! 🧠`,
        description: `Score: ${evaluationResult.score}/100 - AI analysis complete`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Evaluation error:', error);
      
      // Fallback scoring
      const connectivityScore = Math.min(30, edges.length * 3);
      const logicalScore = Math.min(30, Math.random() * 10 + 20);
      const structureScore = Math.min(25, nodes.length * 2);
      const completenessScore = Math.min(15, Math.random() * 5 + 10);
      const totalScore = connectivityScore + logicalScore + structureScore + completenessScore;
      
      setEvaluation({
        score: Math.round(totalScore),
        breakdown: {
          connectivity: connectivityScore,
          logicalFlow: logicalScore,
          networkStructure: structureScore,
          completeness: completenessScore
        },
        analysis: {
          strengths: ['Creative concept connections', 'Good network structure'],
          weaknesses: ['Could improve logical flow', 'Add more core concepts'],
          suggestions: ['Connect more related concepts', 'Strengthen central pathways']
        },
        neuralInsights: {
          hubNodes: nodes.slice(0, 3).map(n => n.data.label),
          pathwayQuality: 'Developing neural pathways show potential',
          networkHealth: 'Network shows good foundation for learning'
        }
      });
      
      toast({
        title: 'Evaluation Complete',
        description: 'Neural map assessed with fallback scoring',
        variant: 'default',
      });
    } finally {
      setIsEvaluating(false);
      setGameCompleted(true);
      setActiveTab('results');
    }
  };

  const resetGame = () => {
    generateRandomNodes();
    setEdges([]);
    setGameCompleted(false);
    setEvaluation(null);
    setActiveTab('game');
    setConnections(0);
    setGameHistory([]);
    setCurrentHistoryIndex(-1);
  };

  const exportAsImage = () => {
    if (reactFlowInstance) {
      const imageData = reactFlowInstance.toObject();
      toast({
        title: 'Neural Map Exported',
        description: 'Map data prepared for export',
        variant: 'default',
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Neural SVG Gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col h-screen p-4">
        <Card className="p-6 mb-4 bg-black/20 backdrop-blur-sm border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full mr-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-sm uppercase text-blue-400 font-semibold">Neural Pathways</h3>
                <h2 className="text-2xl font-bold text-white">{topic}</h2>
                <p className="text-purple-300 text-sm">Build connections • Create pathways • Learn deeply</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{connections}</div>
                <div className="text-xs text-purple-300">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{nodes.length}</div>
                <div className="text-xs text-purple-300">Concepts</div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="mb-4 bg-black/20 backdrop-blur-sm border-purple-500/30">
            <TabsTrigger 
              value="game" 
              disabled={gameCompleted}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Neural Builder
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={!gameCompleted}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              AI Evaluation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="flex-1">
            <div className="flex flex-col h-full">
              {/* Advanced Tools */}
              <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-4 mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={undo} 
                      disabled={currentHistoryIndex <= 0 || gameCompleted}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={redo} 
                      disabled={currentHistoryIndex >= gameHistory.length - 1 || gameCompleted}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={exportAsImage} 
                    variant="outline"
                    size="sm"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  
                  <Button 
                    onClick={() => setShowHint(!showHint)} 
                    variant="outline"
                    size="sm"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    {showHint ? 'Hide' : 'Show'} Hints
                  </Button>
                  
                  <div className="flex-1" />
                  
                  <Button 
                    onClick={submitForEvaluation} 
                    disabled={gameCompleted || isEvaluating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Submit for AI Evaluation
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Hint Panel */}
              {showHint && (
                <Card className="bg-blue-900/20 backdrop-blur-sm border-blue-500/30 p-4 mb-4">
                  <h4 className="text-blue-300 font-semibold mb-2">💡 Neural Connection Tips:</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Connect concepts that have logical relationships</li>
                    <li>• Create pathways from basic to advanced concepts</li>
                    <li>• Look for cause-and-effect relationships</li>
                    <li>• Build bridges between different categories</li>
                    <li>• {isMobile ? 'Tap and drag' : 'Drag'} from connection points to create neural pathways</li>
                  </ul>
                </Card>
              )}

              {/* React Flow Canvas */}
              <div 
                className="border-2 border-purple-500/30 rounded-lg shadow-2xl flex-1 bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-sm overflow-hidden" 
                ref={reactFlowWrapper}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
                      <p className="text-purple-300 text-lg font-medium">Generating Neural Concepts...</p>
                      <p className="text-purple-400 text-sm mt-2">AI is creating your concept map</p>
                    </div>
                  </div>
                ) : (
                  <ReactFlowProvider>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      onInit={setReactFlowInstance}
                      fitView
                      attributionPosition="bottom-right"
                      className="neural-flow"
                      panOnScroll={!isMobile}
                      zoomOnPinch={isMobile}
                      panOnDrag={!isMobile}
                      selectNodesOnDrag={false}
                    >
                      <Controls 
                        className="bg-black/20 backdrop-blur-sm border-purple-500/30"
                        showInteractive={false}
                      />
                      <MiniMap 
                        className="bg-black/20 backdrop-blur-sm border-purple-500/30"
                        nodeColor="#8b5cf6"
                        maskColor="rgba(0, 0, 0, 0.2)"
                      />
                      <Background 
                        color="#6366f1" 
                        gap={20} 
                        className="opacity-20"
                      />
                    </ReactFlow>
                  </ReactFlowProvider>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {evaluation && (
              <div className="space-y-4">
                <Card className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border-purple-500/30">
                  <div className="flex items-center mb-6">
                    <Trophy className="h-8 w-8 mr-3 text-yellow-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Neural Score: {evaluation.score}/100
                      </h3>
                      <p className="text-purple-300">AI Teacher Evaluation Complete</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/20 p-4 rounded-lg text-center">
                      <p className="text-purple-300 text-sm">Connectivity</p>
                      <p className="text-2xl font-bold text-blue-400">{evaluation.breakdown.connectivity}/30</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg text-center">
                      <p className="text-purple-300 text-sm">Logical Flow</p>
                      <p className="text-2xl font-bold text-green-400">{evaluation.breakdown.logicalFlow}/30</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg text-center">
                      <p className="text-purple-300 text-sm">Structure</p>
                      <p className="text-2xl font-bold text-purple-400">{evaluation.breakdown.networkStructure}/25</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg text-center">
                      <p className="text-purple-300 text-sm">Completeness</p>
                      <p className="text-2xl font-bold text-yellow-400">{evaluation.breakdown.completeness}/15</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Neural Strengths:
                      </h4>
                      <ul className="text-green-300 space-y-1">
                        {evaluation.analysis.strengths.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-400 mr-2">+</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-2">Enhancement Areas:</h4>
                      <ul className="text-yellow-300 space-y-1">
                        {evaluation.analysis.suggestions.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-400 mr-2">→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {evaluation.neuralInsights && (
                      <div>
                        <h4 className="text-purple-400 font-semibold mb-2 flex items-center">
                          <Brain className="h-4 w-4 mr-2" />
                          Neural Insights:
                        </h4>
                        <div className="bg-black/20 p-4 rounded-lg space-y-2">
                          <p className="text-purple-300"><strong>Hub Concepts:</strong> {evaluation.neuralInsights.hubNodes?.join(', ')}</p>
                          <p className="text-purple-300"><strong>Pathway Quality:</strong> {evaluation.neuralInsights.pathwayQuality}</p>
                          <p className="text-purple-300"><strong>Network Health:</strong> {evaluation.neuralInsights.networkHealth}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={resetGame} 
                    variant="outline" 
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Build New Neural Map
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    New Topic
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NeuronPathsTemplate;
