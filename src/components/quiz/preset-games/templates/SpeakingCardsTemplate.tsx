
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PenTool, Send, RefreshCw, ArrowRight, ArrowLeft, Clock, Trophy, BookOpen, Loader2 } from 'lucide-react';

interface SpeakingCardsProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface WritingCard {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

interface GradingResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

const SpeakingCardsTemplate: React.FC<SpeakingCardsProps> = ({ content, topic, onBack }) => {
  const { toast } = useToast();
  
  const cards: WritingCard[] = content?.cards || [
    { id: '1', prompt: 'Hãy viết về gia đình của bạn', category: 'Cá nhân', difficulty: 'easy', timeLimit: 300 },
    { id: '2', prompt: 'Mô tả món ăn yêu thích của bạn', category: 'Ẩm thực', difficulty: 'easy', timeLimit: 240 },
    { id: '3', prompt: 'Bạn nghĩ gì về biến đổi khí hậu?', category: 'Môi trường', difficulty: 'medium', timeLimit: 450 },
    { id: '4', prompt: 'Kể về một kỷ niệm đáng nhớ', category: 'Cá nhân', difficulty: 'medium', timeLimit: 360 },
    { id: '5', prompt: 'Giải thích tầm quan trọng của giáo dục', category: 'Xã hội', difficulty: 'hard', timeLimit: 600 }
  ];
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [cardStarted, setCardStarted] = useState(false);
  const [userText, setUserText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [completedCards, setCompletedCards] = useState<string[]>([]);
  
  const currentCard = cards[currentCardIndex];
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && cardStarted && !gradingResult) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && cardStarted && !gradingResult) {
      handleSubmitText();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, cardStarted, gradingResult]);
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const startCard = () => {
    setCardStarted(true);
    setTimeLeft(currentCard.timeLimit);
    setUserText('');
    setGradingResult(null);
    
    toast({
      title: '✍️ Bắt đầu viết!',
      description: `Bạn có ${Math.floor(currentCard.timeLimit / 60)} phút để hoàn thành`,
      variant: 'default',
    });
  };
  
  const handleSubmitText = async () => {
    if (!userText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setCardStarted(false);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-05-06:generateContent?key=AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `Hãy chấm điểm bài viết của học sinh theo thang điểm 10 và đưa ra nhận xét chi tiết.

Chủ đề: ${topic}
Câu hỏi: ${currentCard.prompt}
Độ khó: ${currentCard.difficulty}

Bài viết của học sinh:
"${userText}"

Vui lòng trả về kết quả theo định dạng JSON:
{
  "score": [điểm từ 0-10],
  "feedback": "[nhận xét tổng quan về bài viết]",
  "strengths": ["[điểm mạnh 1]", "[điểm mạnh 2]"],
  "improvements": ["[cần cải thiện 1]", "[cần cải thiện 2]"]
}

Chỉ trả về JSON, không có text khác.`
            }]
          }],
          generationConfig: {
            temperature: 0.3
          }
        })
      });
      
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      try {
        const gradingData = JSON.parse(text);
        setGradingResult(gradingData);
        setCompletedCards(prev => [...prev, currentCard.id]);
        
        toast({
          title: `🎯 Điểm: ${gradingData.score}/10`,
          description: 'AI đã chấm xong bài viết của bạn!',
          variant: 'default',
        });
      } catch (parseError) {
        console.error('Error parsing grading result:', parseError);
        toast({
          title: '⚠️ Lỗi chấm điểm',
          description: 'Không thể phân tích kết quả từ AI. Vui lòng thử lại.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting to AI:', error);
      toast({
        title: '❌ Lỗi kết nối',
        description: 'Không thể gửi bài cho AI. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCardStarted(false);
      setTimeLeft(0);
      setUserText('');
      setGradingResult(null);
    }
  };
  
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setCardStarted(false);
      setTimeLeft(0);
      setUserText('');
      setGradingResult(null);
    }
  };
  
  const resetGame = () => {
    setGameStarted(false);
    setCurrentCardIndex(0);
    setCardStarted(false);
    setTimeLeft(0);
    setUserText('');
    setGradingResult(null);
    setCompletedCards([]);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };
  
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return 'Không xác định';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };
  
  const progress = ((currentCardIndex + (cardStarted || gradingResult ? 1 : 0)) / cards.length) * 100;
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <BookOpen className="h-24 w-24 text-indigo-500 mx-auto mb-6 animate-pulse" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Thẻ Luyện Viết
            </h2>
            <p className="text-xl text-gray-700 mb-2 font-medium">✍️ Chủ đề: {topic}</p>
            <p className="text-gray-600 mb-8 text-lg">Luyện tập kỹ năng viết với AI chấm điểm</p>
            
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <PenTool className="h-6 w-6 text-indigo-500" />
                  <span className="font-medium text-gray-700">{cards.length} bài viết</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-500" />
                  <span className="font-medium text-gray-700">AI chấm điểm tự động</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white text-xl font-bold py-6 rounded-2xl"
            >
              ✍️ Bắt đầu luyện viết
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex-shrink-0">
          <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Thẻ Luyện Viết
              </h2>
              <p className="text-gray-600 text-lg font-medium">{topic}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-indigo-500" />
                <span className="font-bold text-indigo-700 text-xl">
                  Bài {currentCardIndex + 1}/{cards.length}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                <Trophy className="h-6 w-6 text-green-500" />
                <span className="font-bold text-green-700 text-xl">
                  {completedCards.length} hoàn thành
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <Progress value={progress} className="h-3 rounded-full" />
            <p className="text-sm text-gray-500 mt-2 text-center font-medium">
              Tiến độ: {Math.round(progress)}%
            </p>
          </div>
        </Card>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <Card className="p-8 bg-white/95 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentCard.difficulty)}`}>
                    {getDifficultyText(currentCard.difficulty)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {currentCard.category}
                  </span>
                </div>
                
                {(cardStarted || gradingResult) && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                    <Clock className={`h-5 w-5 ${timeLeft < 60 ? 'text-red-500' : 'text-blue-500'}`} />
                    <span className={`font-bold text-lg ${timeLeft < 60 && timeLeft > 0 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
                  {currentCard.prompt}
                </h3>
                
                {!cardStarted && !gradingResult && (
                  <p className="text-gray-600 text-lg">
                    Thời gian: {Math.floor(currentCard.timeLimit / 60)} phút
                  </p>
                )}
              </div>
              
              {!cardStarted && !gradingResult ? (
                <div className="flex justify-center">
                  <Button 
                    onClick={startCard} 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
                    <PenTool className="mr-3 h-6 w-6" />
                    Bắt đầu viết ({Math.floor(currentCard.timeLimit / 60)} phút)
                  </Button>
                </div>
              ) : gradingResult ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Bài viết của bạn:</h4>
                    <p className="text-gray-700 leading-relaxed">{userText}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-2 rounded-full text-lg font-bold border ${getScoreColor(gradingResult.score)}`}>
                        Điểm: {gradingResult.score}/10
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-2">💬 Nhận xét:</h5>
                        <p className="text-gray-700">{gradingResult.feedback}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-green-600 mb-2">✅ Điểm mạnh:</h5>
                        <ul className="space-y-1">
                          {gradingResult.strengths.map((strength, index) => (
                            <li key={index} className="text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-orange-600 mb-2">🔧 Cần cải thiện:</h5>
                        <ul className="space-y-1">
                          {gradingResult.improvements.map((improvement, index) => (
                            <li key={index} className="text-gray-700 flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Textarea
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    placeholder="Viết bài của bạn vào đây..."
                    className="min-h-[300px] text-lg p-4 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                    disabled={isSubmitting}
                  />
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleSubmitText} 
                      disabled={!userText.trim() || isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Đang gửi AI chấm...
                        </>
                      ) : (
                        <>
                          <Send className="mr-3 h-6 w-6" />
                          Gửi cho AI chấm điểm
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 flex-shrink-0">
          <Button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Bài trước
          </Button>
          
          <div className="flex gap-4">
            <Button 
              onClick={resetGame} 
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Chơi lại
            </Button>
            {onBack && (
              <Button 
                onClick={onBack} 
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
              >
                Quay lại
              </Button>
            )}
          </div>
          
          <Button
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl disabled:opacity-50"
          >
            Bài sau
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpeakingCardsTemplate;
