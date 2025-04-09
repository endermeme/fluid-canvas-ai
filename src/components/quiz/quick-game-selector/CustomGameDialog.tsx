
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

interface CustomGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
  setTopic: (topic: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CustomGameDialog: React.FC<CustomGameDialogProps> = ({
  open,
  onOpenChange,
  topic,
  setTopic,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            Enter Game Topic
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Describe in detail the game you want to create..."
            className="min-h-[150px] text-base resize-none"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={onSubmit} 
            disabled={!topic.trim() || isSubmitting}
            className={isSubmitting ? "opacity-70" : ""}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : "Create Game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomGameDialog;
