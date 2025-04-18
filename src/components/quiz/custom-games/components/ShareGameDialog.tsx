
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ShareGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
}

const ShareGameDialog: React.FC<ShareGameDialogProps> = ({
  open,
  onOpenChange,
  shareUrl,
  copied,
  onCopyLink,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ game</DialogTitle>
          <DialogDescription>
            Sao chép hoặc quét mã QR để chia sẻ game này với bạn bè
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="p-4 bg-white rounded-lg">
            <QRCodeSVG value={shareUrl} size={200} />
          </div>
          
          <div className="w-full space-y-2">
            <Label htmlFor="share-link">Liên kết chia sẻ</Label>
            <div className="flex">
              <Input 
                id="share-link" 
                value={shareUrl} 
                readOnly 
                className="rounded-r-none"
              />
              <Button 
                variant="outline" 
                className="rounded-l-none"
                onClick={onCopyLink}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareGameDialog;
