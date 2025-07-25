
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const playerFormSchema = z.object({
  playerName: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  playerAge: z.string().refine((val) => {
    const age = parseInt(val, 10);
    return !isNaN(age) && age >= 6 && age <= 100;
  }, {
    message: "Tuổi phải từ 6 đến 100",
  })
});

type PlayerFormValues = z.infer<typeof playerFormSchema>;

interface GameShareFormProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  gameTitle: string;
  hasRegistered: boolean;
  isSubmitting: boolean;
  onSubmit: (values: PlayerFormValues) => void;
}

const GameShareForm: React.FC<GameShareFormProps> = ({
  showDialog,
  setShowDialog,
  gameTitle,
  hasRegistered,
  isSubmitting,
  onSubmit
}) => {
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      playerName: "",
      playerAge: ""
    },
  });

  return (
    <Dialog open={showDialog} onOpenChange={(open) => !isSubmitting && setShowDialog(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tham gia game</DialogTitle>
          <DialogDescription>
            Vui lòng nhập thông tin để tham gia game "{gameTitle}"
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="playerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên của bạn</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên của bạn" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="playerAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuổi</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="6" max="100" placeholder="Nhập tuổi của bạn" disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Thông tin này chỉ dùng cho mục đích thống kê
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : (hasRegistered ? "Cập nhật" : "Tham gia")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GameShareForm;
