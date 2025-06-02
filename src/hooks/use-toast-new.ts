import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  open: boolean;
};

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, 'id' | 'open'>) => void;
  dismiss: (id?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((props: Omit<ToastProps, 'id' | 'open'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...props, id, open: true }]);
  }, []);

  const dismissToast = useCallback((id?: string) => {
    if (id) {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    } else {
      setToasts([]);
    }
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast: addToast,
        dismiss: dismissToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return {
    ...context,
    toast: {
      ...context.toast,
      success: (props: Omit<ToastProps, 'id' | 'open' | 'variant'>) =>
        context.toast({ ...props, variant: 'default' }),
      error: (props: Omit<ToastProps, 'id' | 'open' | 'variant'>) =>
        context.toast({ ...props, variant: 'destructive' }),
    },
  };
}
