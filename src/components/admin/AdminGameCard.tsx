import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Share2, 
  TrendingUp, 
  Download, 
  Trash2, 
  Users,
  Calendar,
  Clock,
  Shield,
  Eye,
  BarChart3,
  Settings
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AdminGameCardProps {
  game: {
    id: string;
    title: string;
    gameType: string;
    description?: string;
    htmlContent?: string;
    createdAt: number;
    expiresAt: number;
    password?: string;
    maxParticipants?: number;
    showLeaderboard?: boolean;
    shareCount?: number;
    account_id?: string;
    creator_ip?: string;
    requireRegistration?: boolean;
    customDuration?: number;
  };
  onGameClick?: () => void;
  onShareGame?: (gameId: string, e: React.MouseEvent) => void;
  onViewLeaderboard?: (gameId: string, e: React.MouseEvent) => void;
  onExportData?: (gameId: string, e: React.MouseEvent) => void;
  onDeleteGame?: (game: any) => void;
  onViewParticipants?: (gameId: string, e: React.MouseEvent) => void;
}

const AdminGameCard: React.FC<AdminGameCardProps> = ({ 
  game, 
  onGameClick,
  onShareGame,
  onViewLeaderboard,
  onExportData,
  onDeleteGame,
  onViewParticipants
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = () => {
    return new Date().getTime() > game.expiresAt;
  };

  const getTimeUntilExpiry = () => {
    const timeLeft = game.expiresAt - new Date().getTime();
    if (timeLeft <= 0) return 'Đã hết hạn';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} ngày ${hours % 24} giờ`;
    return `${hours} giờ`;
  };

  const getGameTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'custom': 'Game Tùy Chỉnh',
      'quiz': 'Trắc Nghiệm',
      'flashcards': 'Thẻ Ghi Nhớ',
      'matching': 'Ghép Cặp',
      'memory': 'Lật Thẻ',
      'wordsearch': 'Tìm Từ',
      'ordering': 'Sắp Xếp',
      'truefalse': 'Đúng/Sai'
    };
    return typeMap[type] || type;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteGame?.(game);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card 
        className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${
          isExpired() ? 'opacity-75 border-destructive/20' : ''
        }`}
        onClick={onGameClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {game.title}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                {game.description || 'Không có mô tả'}
              </CardDescription>
            </div>
            <Badge 
              variant={isExpired() ? 'destructive' : 'secondary'}
              className="text-xs shrink-0"
            >
              {getGameTypeLabel(game.gameType)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-3 space-y-3">
          {/* Game Status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={isExpired() ? 'text-destructive' : 'text-muted-foreground'}>
                {getTimeUntilExpiry()}
              </span>
            </div>
            {game.shareCount !== undefined && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Share2 className="h-3 w-3" />
                <span>{game.shareCount}</span>
              </div>
            )}
          </div>

          {/* Game Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Tạo:</span>
              </div>
              <span>{formatDate(game.createdAt)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Hết hạn:</span>
              </div>
              <span className={isExpired() ? 'text-destructive' : ''}>
                {formatDate(game.expiresAt)}
              </span>
            </div>

            {game.maxParticipants && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Tối đa:</span>
                </div>
                <span>{game.maxParticipants} người</span>
              </div>
            )}
          </div>

          {/* Security Features */}
          <div className="flex flex-wrap gap-1">
            {game.password && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Có mật khẩu
              </Badge>
            )}
            {game.showLeaderboard && (
              <Badge variant="outline" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Bảng xếp hạng
              </Badge>
            )}
            {game.requireRegistration && (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Cần đăng ký
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="w-full space-y-2">
            {/* Primary Actions */}
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={onGameClick}
              >
                <Play className="h-4 w-4 mr-1" />
                Chơi
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => onShareGame?.(game.id, e)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={(e) => onViewLeaderboard?.(game.id, e)}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Bảng xếp hạng
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={(e) => onViewParticipants?.(game.id, e)}
              >
                <Users className="h-3 w-3 mr-1" />
                Người chơi
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={(e) => onExportData?.(game.id, e)}
              >
                <Download className="h-3 w-3 mr-1" />
                Xuất
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa game</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa game "{game.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminGameCard;