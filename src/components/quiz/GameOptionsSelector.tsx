
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, BookOpen, Gamepad2, BrainCircuit, FileText, Upload, Clock, ListOrdered, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export interface GameOptions {
  contentType: string;
  difficulty: string;
  ageGroup: string;
  customContent?: string;
  customFile?: File | null;
  questionCount?: number;
  timePerQuestion?: number;
}

interface GameOptionsSelectorProps {
  options: GameOptions;
  onOptionsChange: (options: GameOptions) => void;
}

const GameOptionsSelector = ({ options, onOptionsChange }: GameOptionsSelectorProps) => {
  const [isCustomContentOpen, setIsCustomContentOpen] = useState(options.contentType === 'custom');
  
  const handleContentTypeChange = (value: string) => {
    const newOptions = { ...options, contentType: value };
    if (value === 'custom') {
      setIsCustomContentOpen(true);
    }
    onOptionsChange(newOptions);
  };

  const handleDifficultyChange = (value: string) => {
    onOptionsChange({ ...options, difficulty: value });
  };

  const handleAgeGroupChange = (value: string) => {
    onOptionsChange({ ...options, ageGroup: value });
  };
  
  const handleCustomContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onOptionsChange({ ...options, customContent: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onOptionsChange({ ...options, customFile: file });
  };

  const handleQuestionCountChange = (value: number[]) => {
    onOptionsChange({ ...options, questionCount: value[0] });
  };

  const handleTimePerQuestionChange = (value: number[]) => {
    onOptionsChange({ ...options, timePerQuestion: value[0] });
  };

  const handleQuestionCountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onOptionsChange({ ...options, questionCount: value });
    }
  };

  const handleTimePerQuestionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onOptionsChange({ ...options, timePerQuestion: value });
    }
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-sky-200 dark:border-sky-900 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-sky-200/50 dark:border-sky-800/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings2 size={20} className="text-primary" />
          Tùy Chỉnh Trò Chơi
        </CardTitle>
        <CardDescription>
          Điều chỉnh các tùy chọn để tạo trò chơi phù hợp với nhu cầu của bạn
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-5">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-sky-50 dark:bg-slate-900/50">
            <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Cơ Bản</TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Nâng Cao</TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tùy Chỉnh</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-medium text-lg flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  Loại Nội Dung
                </Label>
                <Select 
                  value={options.contentType}
                  onValueChange={handleContentTypeChange}
                >
                  <SelectTrigger className="w-full bg-sky-50 dark:bg-slate-900 border-sky-200 dark:border-sky-800">
                    <SelectValue placeholder="Chọn loại nội dung" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-800">
                    <SelectItem value="educational">Học Tập & Giáo Dục</SelectItem>
                    <SelectItem value="entertainment">Giải Trí & Vui Chơi</SelectItem>
                    <SelectItem value="puzzle">Câu Đố & Giải Mã</SelectItem>
                    <SelectItem value="brain">Rèn Luyện Trí Não</SelectItem>
                    <SelectItem value="art">Nghệ Thuật & Sáng Tạo</SelectItem>
                    <SelectItem value="custom">Tùy Chỉnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="font-medium text-lg flex items-center gap-2">
                  <Star size={18} className="text-primary" />
                  Độ Khó
                </Label>
                <RadioGroup 
                  value={options.difficulty} 
                  onValueChange={handleDifficultyChange}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-2 bg-sky-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-sky-200 dark:border-sky-800">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy" className="cursor-pointer">Dễ</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-sky-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-sky-200 dark:border-sky-800">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="cursor-pointer">Trung Bình</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-sky-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-sky-200 dark:border-sky-800">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard" className="cursor-pointer">Khó</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-sky-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-sky-200 dark:border-sky-800">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="cursor-pointer">Nâng Cao</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium text-lg flex items-center gap-2">
                  <BrainCircuit size={18} className="text-primary" />
                  Độ Tuổi
                </Label>
                <Select 
                  value={options.ageGroup}
                  onValueChange={handleAgeGroupChange}
                >
                  <SelectTrigger className="w-full bg-sky-50 dark:bg-slate-900 border-sky-200 dark:border-sky-800">
                    <SelectValue placeholder="Chọn độ tuổi phù hợp" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-800">
                    <SelectItem value="kids">Trẻ Em (3-7)</SelectItem>
                    <SelectItem value="children">Thiếu Nhi (8-12)</SelectItem>
                    <SelectItem value="teen">Thiếu Niên (13-17)</SelectItem>
                    <SelectItem value="adult">Người Lớn (18+)</SelectItem>
                    <SelectItem value="all">Mọi Độ Tuổi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-lg flex items-center gap-2">
                    <ListOrdered size={18} className="text-primary" />
                    Số Lượng Câu Hỏi
                  </Label>
                  <div className="w-16">
                    <Input 
                      type="number" 
                      min="1" 
                      max="20"
                      value={options.questionCount || 5} 
                      onChange={handleQuestionCountInput}
                      className="text-center bg-sky-50 dark:bg-slate-900 border-sky-200 dark:border-sky-800"
                    />
                  </div>
                </div>
                <Slider
                  defaultValue={[options.questionCount || 5]}
                  min={1}
                  max={20}
                  step={1}
                  value={[options.questionCount || 5]}
                  onValueChange={handleQuestionCountChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-lg flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    Thời Gian Mỗi Câu (giây)
                  </Label>
                  <div className="w-16">
                    <Input 
                      type="number" 
                      min="5" 
                      max="120"
                      value={options.timePerQuestion || 30} 
                      onChange={handleTimePerQuestionInput}
                      className="text-center bg-sky-50 dark:bg-slate-900 border-sky-200 dark:border-sky-800"
                    />
                  </div>
                </div>
                <Slider
                  defaultValue={[options.timePerQuestion || 30]}
                  min={5}
                  max={120}
                  step={5}
                  value={[options.timePerQuestion || 30]}
                  onValueChange={handleTimePerQuestionChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5s</span>
                  <span>30s</span>
                  <span>60s</span>
                  <span>90s</span>
                  <span>120s</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customContent" className="font-medium text-lg flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  Nội dung tùy chỉnh
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Mô tả chi tiết nội dung bạn muốn đưa vào trò chơi
                </p>
                <Textarea 
                  id="customContent"
                  value={options.customContent || ''}
                  onChange={handleCustomContentChange}
                  placeholder="Nhập nội dung tùy chỉnh cho trò chơi của bạn..."
                  className="min-h-[150px] bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-800"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <Label htmlFor="fileUpload" className="font-medium text-lg flex items-center gap-2">
                  <Upload size={18} className="text-primary" />
                  Tải lên tệp dữ liệu (tùy chọn)
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Hỗ trợ hình ảnh, văn bản và PDF
                </p>
                <div className="border border-dashed border-sky-200 dark:border-sky-800 rounded-md p-6 text-center bg-sky-50/50 dark:bg-slate-900/50">
                  <div className="flex flex-col items-center space-y-3">
                    <Upload size={28} className="text-sky-500" />
                    <div className="flex flex-col items-center">
                      <Label htmlFor="fileUpload" className="font-medium text-sm cursor-pointer text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline">
                        Chọn Tệp
                      </Label>
                      <input 
                        id="fileUpload" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept="image/*,.txt,.pdf,.doc,.docx"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {options.customFile ? `Đã chọn: ${options.customFile.name}` : "Chọn hoặc kéo thả tệp vào đây"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GameOptionsSelector;
