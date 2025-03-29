
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, BookOpen, Gamepad2, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface GameOptions {
  contentType: string;
  difficulty: string;
  ageGroup: string;
}

interface GameOptionsSelectorProps {
  options: GameOptions;
  onOptionsChange: (options: GameOptions) => void;
}

const GameOptionsSelector = ({ options, onOptionsChange }: GameOptionsSelectorProps) => {
  const handleContentTypeChange = (value: string) => {
    onOptionsChange({ ...options, contentType: value });
  };

  const handleDifficultyChange = (value: string) => {
    onOptionsChange({ ...options, difficulty: value });
  };

  const handleAgeGroupChange = (value: string) => {
    onOptionsChange({ ...options, ageGroup: value });
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
