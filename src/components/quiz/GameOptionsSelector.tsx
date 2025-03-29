
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
import { Star, BookOpen, Gamepad2, BrainCircuit, FileText, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface GameOptions {
  contentType: string;
  difficulty: string;
  ageGroup: string;
  customContent?: string;
  customFile?: File | null;
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

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-sky-200 dark:border-sky-900 shadow-md">
      <CardContent className="p-5">
        <div className="space-y-6">
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
            
            <Collapsible 
              open={isCustomContentOpen}
              onOpenChange={setIsCustomContentOpen} 
              className="mt-3 space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`w-full flex items-center justify-center gap-2 text-sm ${options.contentType === 'custom' ? 'bg-sky-100 dark:bg-sky-900/30' : ''}`}>
                  <FileText size={16} />
                  {isCustomContentOpen ? "Ẩn Tùy Chỉnh" : "Hiển Thị Tùy Chỉnh"}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3">
                <div>
                  <Label htmlFor="customContent" className="text-sm mb-1 block">
                    Nội dung tùy chỉnh
                  </Label>
                  <Textarea 
                    id="customContent"
                    value={options.customContent || ''}
                    onChange={handleCustomContentChange}
                    placeholder="Nhập nội dung tùy chỉnh cho trò chơi của bạn..."
                    className="min-h-[120px] bg-white dark:bg-slate-900"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Mô tả chi tiết nội dung bạn muốn đưa vào trò chơi
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="fileUpload" className="text-sm mb-1 block">
                    Tải lên tệp dữ liệu (tùy chọn)
                  </Label>
                  <div className="border border-dashed border-sky-200 dark:border-sky-800 rounded-md p-4 text-center bg-sky-50/50 dark:bg-slate-900/50">
                    <div className="flex flex-col items-center space-y-2">
                      <Upload size={24} className="text-sky-500" />
                      <Label htmlFor="fileUpload" className="font-medium text-sm cursor-pointer text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
                        Chọn Tệp
                      </Label>
                      <input 
                        id="fileUpload" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept="image/*,.txt,.pdf,.doc,.docx"
                      />
                      <p className="text-xs text-muted-foreground">
                        {options.customFile ? options.customFile.name : "Hỗ trợ hình ảnh, văn bản và PDF"}
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
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
      </CardContent>
    </Card>
  );
};

export default GameOptionsSelector;
