
import * as React from 'react';

// Định nghĩa loại toast
type ToastVariant = 'default' | 'destructive';

// Cấu trúc của một toast
type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  open: boolean;
};

// Options khi tạo toast (không cần id và open vì được quản lý nội bộ)
type ToastOptions = Omit<Toast, 'id' | 'open'>;

// Context API cho toast
type ToastContextType = {
  toasts: Toast[];
  toast: (options: ToastOptions) => void;
  dismiss: (id?: string) => void;
  success: (options: Omit<ToastOptions, 'variant'>) => void;
  error: (options: Omit<ToastOptions, 'variant'>) => void;
};

// Tạo Context với giá trị mặc định là undefined
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Tạo Provider để bọc ứng dụng
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State lưu trữ danh sách toast
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  
  // Hàm thêm toast mới
  const addToast = React.useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...options, id, open: true }]);
  }, []);
  
  // Hàm đóng toast theo id hoặc đóng tất cả nếu không cung cấp id
  const dismiss = React.useCallback((id?: string) => {
    if (id) {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    } else {
      setToasts([]);
    }
  }, []);
  
  // Hàm tiện ích tạo toast thành công
  const success = React.useCallback((options: Omit<ToastOptions, 'variant'>) => {
    addToast({ ...options, variant: 'default' });
  }, [addToast]);
  
  // Hàm tiện ích tạo toast lỗi
  const error = React.useCallback((options: Omit<ToastOptions, 'variant'>) => {
    addToast({ ...options, variant: 'destructive' });
  }, [addToast]);
  
  // Tạo giá trị context với memo
  const contextValue = React.useMemo(() => ({
    toasts,
    toast: addToast,
    dismiss,
    success,
    error
  }), [toasts, addToast, dismiss, success, error]);
  
  return React.createElement(
    ToastContext.Provider, 
    { value: contextValue },
    children
  );
};

// Hook sử dụng toast context
export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}
