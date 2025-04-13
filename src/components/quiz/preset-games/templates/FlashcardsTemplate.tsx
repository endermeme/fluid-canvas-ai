import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { saveGameForSharing } from '@/services/storage';
import { PlusCircle } from 'lucide-react';

interface Flashcard {
  term: string;
  definition: string;
}

const FlashcardsTemplate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([{ term: '', definition: '' }]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addFlashcard = () => {
    setFlashcards([...flashcards, { term: '', definition: '' }]);
  };

  const updateFlashcard = (index: number, field: string, value: string) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index][field] = value;
    setFlashcards(updatedFlashcards);
  };

  const removeFlashcard = (index: number) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards.splice(index, 1);
    setFlashcards(updatedFlashcards);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !description.trim() || flashcards.some(card => !card.term.trim() || !card.definition.trim())) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin và đảm bảo không có flashcard nào bị bỏ trống.",
        variant: "destructive",
      });
      return;
    }

    const flashcardsHtml = flashcards.map(card => `
      <div class="flashcard">
        <h3>${card.term}</h3>
        <p>${card.definition}</p>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          .flashcard { border: 1px solid #ccc; padding: 10px; margin: 10px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
        ${flashcardsHtml}
      </body>
      </html>
    `;

    try {
      const shareUrl = await saveGameForSharing(title, description, htmlContent);
      toast({
        title: "Game đã được tạo",
        description: "Đang chuyển hướng đến trang chia sẻ...",
      });
      navigate(shareUrl);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo game. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tạo Flashcards</CardTitle>
        <CardDescription>Nhập thông tin chi tiết cho bộ flashcards của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            id="title"
            placeholder="Ví dụ: Từ vựng tiếng Anh"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            placeholder="Ví dụ: Bộ flashcards giúp học từ vựng tiếng Anh hiệu quả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          {flashcards.map((card, index) => (
            <div key={index} className="grid gap-4 border rounded-md p-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor={`term-${index}`}>Thuật ngữ {index + 1}</Label>
                <Input
                  type="text"
                  id={`term-${index}`}
                  placeholder="Ví dụ: Hello"
                  value={card.term}
                  onChange={(e) => updateFlashcard(index, 'term', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`definition-${index}`}>Định nghĩa {index + 1}</Label>
                <Textarea
                  id={`definition-${index}`}
                  placeholder="Ví dụ: Lời chào"
                  value={card.definition}
                  onChange={(e) => updateFlashcard(index, 'definition', e.target.value)}
                />
              </div>
              <Button type="button" variant="destructive" size="sm" onClick={() => removeFlashcard(index)}>
                Xóa
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2 flex items-center" onClick={addFlashcard}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm Flashcard
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Tạo Game</Button>
      </CardFooter>
    </Card>
  );
};

export default FlashcardsTemplate;
