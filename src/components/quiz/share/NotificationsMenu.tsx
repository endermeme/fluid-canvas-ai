import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuFooter
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  StorageNotification 
} from '@/services/storage';

const NotificationsMenu: React.FC = () => {
  const [notifications, setNotifications] = useState<StorageNotification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Tải thông báo
  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = getNotifications();
      setNotifications(allNotifications);
    };
    
    loadNotifications();
    
    // Set interval để kiểm tra thông báo mới mỗi phút
    const intervalId = setInterval(loadNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Mở thông báo game
  const handleOpenGame = (gameId: string) => {
    if (!gameId) return;
    navigate(`/game/${gameId}/dashboard`);
    setOpen(false);
  };
  
  // Đánh dấu thông báo đã đọc
  const handleMarkAsRead = (notification: StorageNotification, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationAsRead(notification.id);
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
  };
  
  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  // Lấy icon theo loại thông báo
  const getNotificationIcon = (type: StorageNotification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-6 text-xs">
              <Check className="h-3 w-3 mr-1" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`p-3 cursor-pointer ${notification.read ? 'opacity-70' : 'bg-accent/50'}`}
                onClick={() => notification.relatedGameId && handleOpenGame(notification.relatedGameId)}
              >
                <div className="flex gap-2">
                  <span className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => handleMarkAsRead(notification, e)}
                          className="h-6 p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              <p>Không có thông báo nào</p>
            </div>
          )}
        </div>
        
        <DropdownMenuFooter className="text-xs text-muted-foreground">
          Thông báo tự động hết hạn sau 7 ngày
        </DropdownMenuFooter>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu; 