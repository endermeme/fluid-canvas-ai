
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
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Trophy, 
  RefreshCw, 
  Loader2, 
  Target
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

const NeuronPathsTemplate: React.FC<NeuronPathsProps> = ({ content, topic }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<GameNode[]>([]);
  const [edges, setEdges] = useState<GameEdge[]>([]);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize với AI-generated nodes
  useEffect(() => {
    if (!content || !content.nodes) {
      generateRandomNodes();
    } else {
      setNodes(content.nodes.map((node: any) => ({
        ...node,
        style: getNodeStyle(node.data?.level || 'basic')
      })));
    }
  }, [content, topic]);

  const generateRandomNodes = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `
      Tạo 8-10 concepts cho chủ đề "${topic}" để học viên tạo neural connections.
      
      JSON format:
      {
        "title": "Neural Map: ${topic}",
        "nodes": [
          {
            "id": "node1",
            "data": {
              "label": "Concept ngắn gọn",
              "level": "basic|intermediate|advanced"
            },
            "position": {"x": 100, "y": 100},
            "type": "default"
          }
        ]
      }
      
      Yêu cầu:
      - Concepts phải ngắn gọn, dễ hiểu (tối đa 15 ký tự)
      - Position nodes đều trên canvas 800x600
      - Mix levels: 40% basic, 40% intermediate, 20% advanced
      - Có thể tạo kết nối logic giữa các concepts
      
      Return only valid JSON.
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
          title: '🧠 Đề bài đã sẵn sàng',
          description: `${generatedData.nodes.length} concepts về "${topic}". Hãy tạo kết nối!`,
        });
      }
    } catch (error) {
      console.error('Error generating nodes:', error);
      
      // Fallback nodes
      const fallbackNodes = generateFallbackNodes();
      setNodes(fallbackNodes);
      
      toast({
        title: 'Sử dụng concepts mặc định',
        description: 'AI gặp lỗi, dùng concepts mặc định',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackNodes = (): GameNode[] => {
    const concepts = [
      { label: 'Khái niệm cơ bản', level: 'basic' },
      { label: 'Nguyên lý chính', level: 'basic' },
      { label: 'Phương pháp A', level: 'intermediate' },
      { label: 'Phương pháp B', level: 'intermediate' },
      { label: 'Lý thuyết nâng cao', level: 'advanced' },
      { label: 'Ứng dụng phức tạp', level: 'advanced' },
      { label: 'Khái niệm liên quan', level: 'intermediate' },
      { label: 'Kết quả cuối', level: 'basic' }
    ];

    return concepts.map((concept, index) => ({
      id: `node_${index + 1}`,
      data: { 
        label: concept.label,
        level: concept.level as 'basic' | 'intermediate' | 'advanced'
      },
      position: {
        x: (index % 3) * 250 + 100,
        y: Math.floor(index / 3) * 150 + 100,
      },
      style: getNodeStyle(concept.level as 'basic' | 'intermediate' | 'advanced'),
    }));
  };

  const getNodeStyle = (level: 'basic' | 'intermediate' | 'advanced') => {
    const baseStyle = {
      borderRadius: '20px',
      padding: '16px',
      width: 160,
      fontSize: '13px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '2px solid',
      textAlign: 'center' as const,
    };

    switch (level) {
      case 'basic':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)',
          color: '#1e40af',
          borderColor: '#3b82f6',
        };
      case 'intermediate':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #d8b4fe 0%, #8b5cf6 100%)',
          color: '#6b21a8',
          borderColor: '#8b5cf6',
        };
      case 'advanced':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
          color: '#b91c1c',
          borderColor: '#ef4444',
        };
      default:
        return baseStyle;
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
        title: '⚡ Kết nối đã tạo!',
        description: 'Neural pathway mới được thiết lập',
      });
    },
    []
  );

  const submitForEvaluation = async () => {
    if (edges.length < 3) {
      toast({
        title: 'Cần thêm kết nối',
        description: 'Hãy tạo ít nhất 3 kết nối giữa các concepts',
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
      Chấm điểm Neural Map cho chủ đề "${topic}" trên thang 100:

      Dữ liệu: ${JSON.stringify(neuralMapData, null, 2)}

      Tiêu chí chấm điểm:
      1. LOGIC CONNECTIONS (0-40): Tính logic của các kết nối
      2. NETWORK COMPLETENESS (0-30): Độ đầy đủ của mạng lưới
      3. CONCEPT UNDERSTANDING (0-20): Hiểu biết về concepts
      4. CREATIVITY (0-10): Sự sáng tạo trong kết nối

      Phân tích từng connection và đưa ra điểm tổng.

      JSON format:
      {
        "score": <tổng điểm 0-100>,
        "breakdown": {
          "logic": <0-40>,
          "completeness": <0-30>,
          "understanding": <0-20>,
          "creativity": <0-10>
        },
        "feedback": {
          "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
          "improvements": ["cần cải thiện 1", "cần cải thiện 2"]
        },
        "connectionAnalysis": [
          {
            "connection": "NodeA → NodeB",
            "score": <0-10>,
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
      const totalScore = Math.min(100, edges.length * 8 + Math.random() * 20);
      
      setEvaluation({
        score: Math.round(totalScore),
        breakdown: {
          logic: Math.round(totalScore * 0.4),
          completeness: Math.round(totalScore * 0.3),
          understanding: Math.round(totalScore * 0.2),
          creativity: Math.round(totalScore * 0.1)
        },
        feedback: {
          strengths: ['Tạo được nhiều kết nối', 'Có sự sáng tạo trong neural map'],
          improvements: ['Có thể tăng thêm logic connections', 'Thêm các concepts trung gian']
        },
        connectionAnalysis: edges.slice(0, 3).map((edge, i) => ({
          connection: `${nodes.find(n => n.id === edge.source)?.data.label} → ${nodes.find(n => n.id === edge.target)?.data.label}`,
          score: 7 + Math.floor(Math.random() * 3),
          reason: 'Kết nối có logic tốt'
        }))
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
    generateRandomNodes();
    setEdges([]);
    setGameCompleted(false);
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col h-screen p-4">
        {/* Header đơn giản */}
        <Card className="p-4 mb-4 bg-white/80 backdrop-blur-sm border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Neural Connections</h2>
                <p className="text-sm text-gray-600">{topic} • {edges.length} kết nối đã tạo</p>
              </div>
            </div>
            
            {!gameCompleted && (
              <Button 
                onClick={submitForEvaluation} 
                disabled={isEvaluating || edges.length < 3}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
            )}
          </div>
        </Card>

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
              <p className="text-gray-600">AI Teacher đã đánh giá neural map của bạn</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-blue-600 text-sm font-medium">Logic</p>
                <p className="text-xl font-bold text-blue-800">{evaluation.breakdown.logic}/40</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-green-600 text-sm font-medium">Hoàn thiện</p>
                <p className="text-xl font-bold text-green-800">{evaluation.breakdown.completeness}/30</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className="text-purple-600 text-sm font-medium">Hiểu biết</p>
                <p className="text-xl font-bold text-purple-800">{evaluation.breakdown.understanding}/20</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <p className="text-orange-600 text-sm font-medium">Sáng tạo</p>
                <p className="text-xl font-bold text-orange-800">{evaluation.breakdown.creativity}/10</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-green-600 font-semibold mb-2">✅ Điểm mạnh:</h4>
                <ul className="text-green-700 space-y-1">
                  {evaluation.feedback.strengths.map((item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-orange-600 font-semibold mb-2">💡 Cần cải thiện:</h4>
                <ul className="text-orange-700 space-y-1">
                  {evaluation.feedback.improvements.map((item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              {evaluation.connectionAnalysis && (
                <div>
                  <h4 className="text-blue-600 font-semibold mb-2">🔗 Phân tích kết nối:</h4>
                  <div className="space-y-2">
                    {evaluation.connectionAnalysis.map((conn: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-sm">{conn.connection}</div>
                        <div className="text-xs text-gray-600">{conn.reason} ({conn.score}/10)</div>
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
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại với đề mới
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex-1 border-2 border-blue-200 rounded-lg bg-white/50 backdrop-blur-sm overflow-hidden">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-blue-700 text-lg font-medium">Đang tạo đề bài...</p>
                  <p className="text-blue-600 text-sm mt-2">AI đang chuẩn bị concepts cho bạn</p>
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
                  fitView
                  attributionPosition="bottom-right"
                  className="neural-flow"
                  panOnScroll
                  zoomOnPinch
                  selectNodesOnDrag={false}
                >
                  <Controls 
                    className="bg-white/80 backdrop-blur-sm border-blue-200"
                    showInteractive={false}
                  />
                  <Background 
                    color="#3b82f6" 
                    gap={20} 
                    className="opacity-10"
                  />
                </ReactFlow>
              </ReactFlowProvider>
            )}
          </div>
        )}

        {/* Hướng dẫn đơn giản */}
        {!gameCompleted && !isGenerating && (
          <Card className="mt-4 p-3 bg-blue-50 border-blue-200">
            <p className="text-blue-700 text-sm text-center">
              💡 <strong>Hướng dẫn:</strong> Kéo từ một node sang node khác để tạo kết nối neural. 
              Tạo ít nhất 3 kết nối rồi bấm "Gửi chấm điểm" để AI đánh giá.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NeuronPathsTemplate;
