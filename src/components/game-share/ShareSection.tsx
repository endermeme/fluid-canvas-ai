
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StoredGame } from '@/utils/types';
// getRemainingTime utility moved inline

interface ShareSectionProps {
  game: StoredGame;
  gameId: string;
}

// Inline utility for remaining time
const getRemainingTimeInline = (expiresAt: Date | number): string => {
  const now = new Date();
  const expTimestamp = typeof expiresAt === 'number' ? expiresAt : expiresAt.getTime();
  const diff = expTimestamp - now.getTime();
  
  if (diff <= 0) return 'Đã hết hạn';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} ngày ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const ShareSection: React.FC<ShareSectionProps> = ({
  game,
  gameId
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = `${window.location.origin}/game/${gameId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Đã sao chép",
          description: "Đường dẫn đã được sao chép vào clipboard.",
        });
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
        toast({
          title: "Lỗi sao chép", 
          description: "Không thể sao chép liên kết.",
          variant: "destructive"
        });
      });
  };

  const formatDate = (timestamp: number | Date) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chia sẻ game</CardTitle>
          <CardDescription>
            Chia sẻ game này với bạn bè để họ có thể tham gia chơi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG value={shareUrl} size={200} />
          </div>
          
          <div className="space-y-2">
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
                onClick={handleCopyLink}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiêu đề:</span>
            <span className="font-medium">{game.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ngày tạo:</span>
            <span>{formatDate(game.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hết hạn sau:</span>
            <span>{getRemainingTimeInline(game.expiresAt)}</span>
          </div>
          {game.password && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bảo mật:</span>
              <span className="text-green-600">🔒 Có mật khẩu</span>
            </div>
          )}
          {game.maxParticipants && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giới hạn:</span>
              <span>{game.maxParticipants} người chơi</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bảng xếp hạng:</span>
            <span>{game.showLeaderboard ? "✅ Hiển thị" : "❌ Ẩn"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareSection;
