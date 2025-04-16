import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AIGameGenerator, MiniGame } from '../generator/AIGameGenerator';
import { useToast } from '@/hooks/use-toast';

interface CustomGameFormProps {
  onGenerate: (prompt: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Chủ đề phải có ít nhất 2 ký tự.",
  }),
  prompt: z.string().min(10, {
    message: "Nội dung game cần có ít nhất 10 ký tự.",
  }),
})

const CustomGameForm = ({ onGenerate, onCancel }: CustomGameFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      prompt: "",
    },
  })

  const submitHandler = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    if (data.prompt) {
      // Add metadata to request formatted code
      const completePrompt = data.prompt + "\n\n**Additional Requirements:**\n- Provide well-formatted, indented code\n- Include line breaks for readability\n- Avoid using external libraries or CDNs like cloudflare or analytics\n- Use only self-contained code";
      
      onGenerate(completePrompt);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chủ đề</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nhập chủ đề game" 
                  {...field} 
                  className="bg-background"
                />
              </FormControl>
              <FormDescription>
                Nhập một chủ đề ngắn gọn cho trò chơi của bạn.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung game</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung chi tiết về game bạn muốn tạo"
                  className="bg-background resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mô tả chi tiết về trò chơi bạn muốn tạo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            disabled={isGenerating}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={isGenerating}
          >
            {isGenerating ? "Đang tạo..." : "Tạo Game"}
          </Button>
        </div>
      </form>
    </Form>
  )
};

export default CustomGameForm;
