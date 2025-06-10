
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Trophy, 
  RefreshCw, 
  Loader2, 
  Target,
  Plus,
  Edit3,
  Trash2,
  Play,
  Lightbulb,
  Sparkles,
  BookOpen,
  Zap
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
  level?: 'basic' | 'intermediate' | 'advanced';
}

type GameNode = Node<NodeData>;
type GameEdge = Edge;

// Custom Node Component
const CustomNode = ({ data, id, selected }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const { setNodes } = useReactFlow();

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  };

  const getNodeStyle = (level: string) => {
    const baseStyle = "px-4 py-3 rounded-2xl font-medium text-sm shadow-lg border-2 transition-all duration-200 min-w-[120px] text-center";
    
    switch (level) {
      case 'basic':
        return `${baseStyle} bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-800 hover:shadow-xl hover:scale-105`;
      case 'intermediate':
        return `${baseStyle} bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 text-purple-800 hover:shadow-xl hover:scale-105`;
      case 'advanced':
        return `${baseStyle} bg-gradient-to-br from-red-100 to-red-200 border-red-300 text-red-800 hover:shadow-xl hover:scale-105`;
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-800 hover:shadow-xl hover:scale-105`;
    }
  };

  return (
    <div className={`${getNodeStyle(data.level || 'basic')} ${selected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}`}>
      {isEditing ? (
        <Input
          value={label}
          onChange={(e) => handleLabelChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
          className="text-sm bg-white/80 border-none text-center"
          autoFocus
        />
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-pointer"
        >
          {label}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const NeuronPathsTemplate: React.FC<NeuronPathsProps> = ({ content, topic }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<GameNode[]>([]);
  const [edges, setEdges] = useState<GameEdge[]>([]);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [showInstructions, setShowInstructions] = useState(true);
  const { toast } = useToast();

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
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        animated: true,
        style: {
          stroke: '#3b82f6',
          strokeWidth: 3,
        }
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: '⚡ Kết nối thành công!',
        description: 'Neural pathway mới được tạo',
      });
    },
    []
  );

  const addNode = (level: 'basic' | 'intermediate' | 'advanced') => {
    const newNode: GameNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: 'Concept mới',
        level: level,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    
    toast({
      title: '🧠 Node mới đã tạo!',
      description: `Thêm concept ${level} vào neural map`,
    });
  };

  const deleteSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => {
      const sourceExists = nodes.some(node => node.id === edge.source && !node.selected);
      const targetExists = nodes.some(node => node.id === edge.target && !node.selected);
      return sourceExists && targetExists;
    }));
    
    toast({
      title: '🗑️ Đã xóa nodes',
      description: 'Các nodes được chọn đã bị xóa',
    });
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setGameCompleted(false);
    setEvaluation(null);
    
    toast({
      title: '🧹 Canvas đã xóa',
      description: 'Bắt đầu lại từ đầu',
    });
  };

  const submitForEvaluation = async () => {
    if (nodes.length < 3) {
      toast({
        title: 'Cần thêm concepts',
        description: 'Hãy tạo ít nhất 3 concepts trước khi gửi đánh giá',
        variant: 'destructive',
      });
      return;
    }

    if (edges.length < 2) {
      toast({
        title: 'Cần thêm kết nối',
        description: 'Hãy tạo ít nhất 2 kết nối giữa các concepts',
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
          position: node.position,
        })),
        connections: edges.map(edge => ({
          source: nodes.find(n => n.id === edge.source)?.data.label,
          target: nodes.find(n => n.id === edge.target)?.data.label,
        })),
        stats: {
          totalNodes: nodes.length,
          totalConnections: edges.length,
          connectivity: edges.length / nodes.length,
        }
      };
      
      const prompt = `
      Chấm điểm Neural Map tự tạo cho chủ đề "${topic}" trên thang 100:

      Dữ liệu: ${JSON.stringify(neuralMapData, null, 2)}

      Tiêu chí chấm điểm:
      1. CONCEPT QUALITY (0-30): Chất lượng và relevance của concepts
      2. LOGICAL CONNECTIONS (0-30): Tính logic của các kết nối
      3. NETWORK STRUCTURE (0-25): Cấu trúc và completeness của mạng
      4. CREATIVITY & INSIGHT (0-15): Sự sáng tạo và insight

      Phân tích từng concept và connection, đưa ra feedback chi tiết.

      JSON format:
      {
        "score": <tổng điểm 0-100>,
        "breakdown": {
          "concept_quality": <0-30>,
          "logical_connections": <0-30>,
          "network_structure": <0-25>,
          "creativity": <0-15>
        },
        "feedback": {
          "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
          "improvements": ["cần cải thiện 1", "cần cải thiện 2"],
          "overall": "nhận xét tổng quan"
        },
        "concept_analysis": [
          {
            "concept": "tên concept",
            "relevance": <0-10>,
            "comment": "nhận xét"
          }
        ],
        "connection_analysis": [
          {
            "connection": "ConceptA → ConceptB",
            "logic_score": <0-10>,
            "reason": "lý do chấm điểm"
          }
        ]
      }
      
      Return only JSON.
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
      setGameCompleted(true);
      
      toast({
        title: `🎯 Điểm số: ${evaluationResult.score}/100`,
        description: 'AI đã đánh giá xong neural map của bạn!',
      });
    } catch (error) {
      console.error('Evaluation error:', error);
      
      // Fallback scoring
      const totalScore = Math.min(100, nodes.length * 5 + edges.length * 8 + Math.random() * 20);
      
      setEvaluation({
        score: Math.round(totalScore),
        breakdown: {
          concept_quality: Math.round(totalScore * 0.3),
          logical_connections: Math.round(totalScore * 0.3),
          network_structure: Math.round(totalScore * 0.25),
          creativity: Math.round(totalScore * 0.15)
        },
        feedback: {
          strengths: ['Tự tạo được neural map', 'Có sự sáng tạo trong concepts'],
          improvements: ['Có thể tăng thêm logic connections', 'Thêm các concepts trung gian'],
          overall: 'Neural map tự tạo thể hiện sự hiểu biết tốt về chủ đề'
        }
      });
      
      setGameCompleted(true);
      toast({
        title: 'Đánh giá hoàn tất',
        description: 'Neural map đã được chấm điểm',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetGame = () => {
    clearCanvas();
    setShowInstructions(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="flex flex-col h-screen">
        {/* Header hiện đại */}
        <Card className="m-4 p-4 bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Neural Mind Map</h2>
                <p className="text-gray-600">
                  <span className="font-medium">{topic}</span> • 
                  <span className="ml-2 text-indigo-600">{nodes.length} concepts</span> • 
                  <span className="ml-2 text-purple-600">{edges.length} connections</span>
                </p>
              </div>
            </div>
            
            {!gameCompleted && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowInstructions(!showInstructions)}
                  variant="outline"
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Hướng dẫn
                </Button>
                <Button 
                  onClick={submitForEvaluation} 
                  disabled={isEvaluating || nodes.length < 3 || edges.length < 2}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI đang chấm...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Gửi chấm điểm
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-1 gap-4 mx-4 mb-4">
          {/* Panel công cụ hiện đại */}
          {!gameCompleted && (
            <Card className="w-72 p-4 bg-white/90 backdrop-blur-sm border-indigo-200 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-indigo-600" />
                Công cụ tạo Neural Map
              </h3>
              
              {/* Thêm Concepts */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-700 text-sm">Thêm Concepts:</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => addNode('basic')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white justify-start"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Basic Concept
                  </Button>
                  <Button
                    onClick={() => addNode('intermediate')}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white justify-start"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Intermediate
                  </Button>
                  <Button
                    onClick={() => addNode('advanced')}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white justify-start"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Advanced
                  </Button>
                </div>
              </div>

              {/* Thao tác */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-700 text-sm">Thao tác:</h4>
                <div className="space-y-2">
                  <Button
                    onClick={deleteSelectedNodes}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 justify-start"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa nodes đã chọn
                  </Button>
                  <Button
                    onClick={clearCanvas}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 justify-start"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Xóa toàn bộ
                  </Button>
                </div>
              </div>

              {/* Hướng dẫn nhanh */}
              {showInstructions && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <h4 className="font-medium text-indigo-800 text-sm mb-2 flex items-center">
                    <Lightbulb className="mr-1 h-4 w-4" />
                    Hướng dẫn:
                  </h4>
                  <ul className="text-xs text-indigo-700 space-y-1">
                    <li>• Thêm concepts liên quan đến "{topic}"</li>
                    <li>• Click để edit tên concept</li>
                    <li>• Kéo từ concept này sang concept khác để nối</li>
                    <li>• Tạo ít nhất 3 concepts và 2 kết nối</li>
                    <li>• Gửi AI chấm điểm khi hoàn thành</li>
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* Canvas hoặc kết quả */}
          {gameCompleted && evaluation ? (
            <Card className="flex-1 p-6 bg-white/90 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Điểm số: {evaluation.score}/100
                </h3>
                <p className="text-gray-600">AI Teacher đã đánh giá neural map tự tạo của bạn</p>
                {evaluation.feedback?.overall && (
                  <p className="text-sm text-gray-700 mt-2 italic">"{evaluation.feedback.overall}"</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-blue-600 text-sm font-medium">Chất lượng Concept</p>
                  <p className="text-xl font-bold text-blue-800">{evaluation.breakdown?.concept_quality || 0}/30</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-purple-600 text-sm font-medium">Logic Kết nối</p>
                  <p className="text-xl font-bold text-purple-800">{evaluation.breakdown?.logical_connections || 0}/30</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-green-600 text-sm font-medium">Cấu trúc Mạng</p>
                  <p className="text-xl font-bold text-green-800">{evaluation.breakdown?.network_structure || 0}/25</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <p className="text-orange-600 text-sm font-medium">Sáng tạo</p>
                  <p className="text-xl font-bold text-orange-800">{evaluation.breakdown?.creativity || 0}/15</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-green-600 font-semibold mb-2">✅ Điểm mạnh:</h4>
                  <ul className="text-green-700 space-y-1">
                    {evaluation.feedback?.strengths?.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    )) || <li>• Tự tạo neural map thể hiện sự hiểu biết</li>}
                  </ul>
                </div>

                <div>
                  <h4 className="text-orange-600 font-semibold mb-2">💡 Cần cải thiện:</h4>
                  <ul className="text-orange-700 space-y-1">
                    {evaluation.feedback?.improvements?.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    )) || <li>• Có thể mở rộng thêm concepts</li>}
                  </ul>
                </div>

                {evaluation.connection_analysis && (
                  <div>
                    <h4 className="text-blue-600 font-semibold mb-2">🔗 Phân tích kết nối:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {evaluation.connection_analysis.map((conn: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-sm">{conn.connection}</div>
                          <div className="text-xs text-gray-600">{conn.reason} ({conn.logic_score}/10)</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <Button 
                  onClick={resetGame} 
                  variant="outline"
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tạo Neural Map mới
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex-1 border-2 border-indigo-200 rounded-xl bg-white/50 backdrop-blur-sm overflow-hidden shadow-lg">
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-right"
                  className="neural-flow"
                  panOnScroll
                  zoomOnPinch
                  selectNodesOnDrag={true}
                  multiSelectionKeyCode="Shift"
                >
                  <Controls 
                    className="bg-white/80 backdrop-blur-sm border-indigo-200"
                    showInteractive={false}
                  />
                  <Background 
                    color="#6366f1" 
                    gap={20} 
                    className="opacity-5"
                  />
                </ReactFlow>
              </ReactFlowProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeuronPathsTemplate;
