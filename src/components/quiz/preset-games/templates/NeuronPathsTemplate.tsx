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
import { Brain, Trophy, Check, RefreshCw, Info, Save, X, Loader2 } from 'lucide-react';
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
}

// Sử dụng trực tiếp các kiểu từ ReactFlow
type GameNode = Node<NodeData>;
type GameEdge = Edge;

// Default game nodes if none provided
const defaultNodes: GameNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Khái niệm chính' },
    position: { x: 400, y: 100 },
  }
];

// Custom node styles
const nodeStyles = {
  background: '#f0f9ff',
  color: '#075985',
  border: '1px solid #0ea5e9',
  borderRadius: '12px',
  padding: '14px',
  width: 220,
  fontSize: '14px',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px -1px rgb(0 0 0 / 0.15)',
};

// Custom edge styles
const edgeStyles = {
  stroke: '#0ea5e9',
  strokeWidth: 2,
  animated: true
};

const NeuronPathsTemplate: React.FC<NeuronPathsProps> = ({ content, topic }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [nodes, setNodes] = useState<GameNode[]>([]);
  const [edges, setEdges] = useState<GameEdge[]>([]);
  const [nodeName, setNodeName] = useState<string>('');
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Initialize nodes and edges from content or use defaults
  useEffect(() => {
    if (content?.nodes && content.nodes.length > 0) {
      setNodes(content.nodes.map((node: any) => ({
        ...node,
        style: nodeStyles
      })));
      
      if (content.edges) {
        setEdges(content.edges.map((edge: any) => ({
          ...edge,
          style: edgeStyles,
          animated: true,
        })));
      }
    } else {
      setNodes(defaultNodes.map(node => ({ ...node, style: nodeStyles })));
    }
  }, [content]);

  // Handle drag over event
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node changes (drag, select)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Handle connect (create new edge)
  const onConnect = useCallback(
    (connection: Connection) => {
      // Tạo Edge với id duy nhất
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        animated: true,
        style: edgeStyles
      };
      return setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  // Add a new node to the canvas - positioned in the center of current view
  const addNode = () => {
    if (nodeName.trim() === '') {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên cho khái niệm mới',
        variant: 'destructive',
      });
      return;
    }

    if (!reactFlowInstance) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo khái niệm mới, vui lòng thử lại',
        variant: 'destructive',
      });
      return;
    }
    
    // Lấy vị trí trung tâm màn hình hiện tại
    const viewport = reactFlowInstance.getViewport();
    const centerX = reactFlowInstance.project({
      x: reactFlowWrapper.current ? reactFlowWrapper.current.offsetWidth / 2 : 400,
      y: 0
    }).x;
    const centerY = reactFlowInstance.project({
      x: 0,
      y: reactFlowWrapper.current ? reactFlowWrapper.current.offsetHeight / 2 : 300
    }).y;

    const newNode: GameNode = {
      id: `node_${Date.now()}`,
      data: { label: nodeName },
      position: {
        x: centerX,
        y: centerY,
      },
      style: nodeStyles,
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
    
    toast({
      title: 'Thêm khái niệm thành công',
      description: `Đã thêm "${nodeName}" vào sơ đồ`,
      variant: 'default',
    });
  };

  // Gửi sơ đồ tới API Gemini để đánh giá
  const submitSolution = async () => {
    if (nodes.length < 3) {
      toast({
        title: 'Chưa đủ khái niệm',
        description: 'Vui lòng thêm ít nhất 3 khái niệm vào sơ đồ',
        variant: 'destructive',
      });
      return;
    }

    if (edges.length < 2) {
      toast({
        title: 'Chưa đủ liên kết',
        description: 'Vui lòng tạo ít nhất 2 liên kết giữa các khái niệm',
        variant: 'destructive',
      });
      return;
    }

    setIsEvaluating(true);
    
    try {
      // Chuẩn bị dữ liệu để gửi đi
      const conceptMapData = {
        topic: topic,
        nodes: nodes.map(node => ({
          id: node.id,
          label: node.data.label,
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          sourceNode: nodes.find(n => n.id === edge.source)?.data.label,
          target: edge.target,
          targetNode: nodes.find(n => n.id === edge.target)?.data.label,
        })),
      };
      
      // Tạo prompt cho Gemini
      const prompt = `
      Đánh giá sơ đồ khái niệm sau cho chủ đề "${topic}":

      ${JSON.stringify(conceptMapData, null, 2)}

      Hãy đánh giá sơ đồ này theo các tiêu chí sau và trả về kết quả dưới dạng JSON:
      1. Độ bao phủ (coverage): Mức độ sơ đồ bao quát được các khái niệm quan trọng của chủ đề (thang điểm 0-100).
      2. Tính logic (logic): Mức độ hợp lý của các kết nối giữa các khái niệm (thang điểm 0-100).
      3. Tính nhất quán (consistency): Mức độ nhất quán và không mâu thuẫn trong sơ đồ (thang điểm 0-100).

      Ngoài ra hãy đưa ra:
      - Tổng điểm (total): Trung bình của 3 tiêu chí trên.
      - Nhận xét (feedback): Danh sách các nhận xét về sơ đồ khái niệm.
      - Điểm mạnh (strengths): Danh sách các điểm mạnh của sơ đồ.
      - Gợi ý cải thiện (suggestions): Danh sách các gợi ý để cải thiện sơ đồ.

      Trả về kết quả dưới dạng JSON với cấu trúc như sau:
      {
        "scores": {
          "coverage": <số từ 0-100>,
          "logic": <số từ 0-100>,
          "consistency": <số từ 0-100>,
          "total": <số từ 0-100>
        },
        "feedback": ["nhận xét 1", "nhận xét 2", ...],
        "strengths": ["điểm mạnh 1", "điểm mạnh 2", ...],
        "suggestions": ["gợi ý 1", "gợi ý 2", ...]
      }
      `;

      // Gọi API Gemini
      const payload = {
        contents: [{
          role: "user",
          parts: [{text: prompt}]
        }],
        generationConfig: {
          ...DEFAULT_GENERATION_SETTINGS,
          temperature: 0.2 // Để đảm bảo đầu ra ổn định
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

      // Trích xuất JSON từ phản hồi
      let jsonStr = text;
      if (text.includes('```json')) {
        jsonStr = text.split('```json')[1].split('```')[0].trim();
      } else if (text.includes('```')) {
        jsonStr = text.split('```')[1].split('```')[0].trim();
      }

      // Parse và lưu kết quả đánh giá
      const evaluationResult = JSON.parse(jsonStr);
      setEvaluation(evaluationResult);
      
      toast({
        title: 'Đánh giá thành công',
        description: 'AI đã đánh giá sơ đồ khái niệm của bạn',
        variant: 'default',
      });
    } catch (error) {
      console.error('Lỗi khi đánh giá:', error);
      toast({
        title: 'Đánh giá thất bại',
        description: 'Có lỗi xảy ra khi đánh giá sơ đồ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      
      // Fallback evaluation khi lỗi
      const coverageScore = Math.min(100, nodes.length * 10);
      const logicScore = Math.min(100, edges.length * 15);
      const consistencyScore = Math.round(Math.random() * 30 + 70);
      const totalScore = Math.round((coverageScore + logicScore + consistencyScore) / 3);
      
      setEvaluation({
        scores: {
          coverage: coverageScore,
          logic: logicScore,
          consistency: consistencyScore,
          total: totalScore
        },
        feedback: [
          'Sơ đồ khái niệm của bạn thể hiện sự hiểu biết về chủ đề.',
          'Bạn đã tạo được các kết nối giữa các khái niệm.'
        ],
        strengths: ['Đã xác định được các khái niệm chính'],
        suggestions: ['Hãy bổ sung thêm khái niệm và mối liên hệ']
      });
    } finally {
      setIsEvaluating(false);
      setGameCompleted(true);
      setActiveTab('results');
    }
  };

  // Reset the game
  const resetGame = () => {
    setNodes(defaultNodes.map(node => ({ ...node, style: nodeStyles })));
    setEdges([]);
    setGameCompleted(false);
    setEvaluation(null);
    setActiveTab('editor');
  };

  // Delete selected node
  const deleteNode = () => {
    const selectedNode = nodes.find(node => node.selected);
    if (selectedNode) {
      setNodes((nds) => nds.filter(node => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter(
        edge => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
    } else {
      toast({
        title: 'Chưa chọn khái niệm',
        description: 'Vui lòng chọn một khái niệm để xóa',
        variant: 'default',
      });
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex flex-col">
      <Card className="p-6 w-full mb-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm uppercase text-blue-600 font-semibold">Chủ đề của bạn</h3>
            <h2 className="text-2xl font-bold">{topic}</h2>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setHelpOpen(!helpOpen)}
            className="flex items-center"
          >
            <Info className="h-4 w-4 mr-1" />
            Hướng dẫn
          </Button>
        </div>
      </Card>

      {helpOpen && (
        <Card className="p-4 mb-4 bg-blue-50">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold mb-2">Hướng dẫn:</h3>
            <Button variant="ghost" size="icon" onClick={() => setHelpOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Thêm khái niệm mới bằng cách nhập tên và bấm "Thêm khái niệm"</li>
            <li>Kéo thả các khái niệm để sắp xếp</li>
            <li>Nối hai khái niệm bằng cách kéo từ điểm kết nối của khái niệm nguồn đến khái niệm đích</li>
            <li>Chọn một khái niệm và nhấn "Xóa khái niệm" để xóa</li>
            <li>Khi hoàn thành, nhấn "Nộp bài" để AI đánh giá</li>
          </ul>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="editor" disabled={gameCompleted}>
            Sơ đồ tư duy
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!gameCompleted}>
            Kết quả đánh giá
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1">
          <div className="flex flex-col h-full">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="text-sm font-medium mb-1.5 flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mr-2">1</span>
                  Tạo khái niệm mới
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    placeholder="Nhập tên khái niệm"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={gameCompleted}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !gameCompleted) {
                        addNode();
                      }
                    }}
                  />
                  <Button 
                    onClick={addNode} 
                    disabled={gameCompleted}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Thêm khái niệm
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <div className="text-sm font-medium mb-1.5 flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mr-2">2</span>
                  Nối các khái niệm
                </div>
                <div className="text-sm text-gray-600 mb-1">Kéo từ điểm nối khái niệm nguồn tới khái niệm đích</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1.5 flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mr-2">3</span>
                  Công cụ
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={deleteNode} 
                    disabled={gameCompleted}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa khái niệm đã chọn
                  </Button>
                  <Button 
                    onClick={submitSolution} 
                    disabled={gameCompleted || isEvaluating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đánh giá...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Nộp bài để AI đánh giá
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border border-blue-200 rounded-lg shadow-lg h-[60vh] w-full" ref={reactFlowWrapper}>
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onInit={setReactFlowInstance}
                  onDragOver={onDragOver}
                  fitView
                  attributionPosition="bottom-right"
                >
                  <Controls />
                  <MiniMap />
                  <Background color="#aaa" gap={16} />
                </ReactFlow>
              </ReactFlowProvider>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={submitSolution} disabled={gameCompleted} className="bg-blue-600 hover:bg-blue-700">
                <Check className="mr-2 h-4 w-4" />
                Nộp bài
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {evaluation && (
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50">
                <div className="flex items-center mb-4">
                  <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                  <h3 className="text-xl font-bold">
                    Điểm số: {evaluation.scores.total}/100
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-md shadow">
                    <p className="font-medium">Độ bao phủ</p>
                    <p className="text-2xl font-bold text-blue-600">{evaluation.scores.coverage}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow">
                    <p className="font-medium">Tính logic</p>
                    <p className="text-2xl font-bold text-green-600">{evaluation.scores.logic}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow">
                    <p className="font-medium">Tính nhất quán</p>
                    <p className="text-2xl font-bold text-purple-600">{evaluation.scores.consistency}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Nhận xét:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {evaluation.feedback.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold pt-2">Điểm mạnh:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {evaluation.strengths.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold pt-2">Gợi ý cải thiện:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {evaluation.suggestions.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button onClick={resetGame} variant="outline" className="mr-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Làm lại
                </Button>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                  Trò chơi mới
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NeuronPathsTemplate;
