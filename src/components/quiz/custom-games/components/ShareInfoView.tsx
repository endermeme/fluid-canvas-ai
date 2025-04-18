
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Copy, Check } from 'lucide-react';

interface ShareInfoViewProps {
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
  title: string;
}

const ShareInfoView: React.FC<ShareInfoViewProps> = ({
  shareUrl,
  copied,
  onCopyLink,
  title,
}) => {
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
                onClick={onCopyLink}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Tham gia game
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiêu đề:</span>
            <span className="font-medium">{title}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareInfoView;
