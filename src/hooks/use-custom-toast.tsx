import { useState, useCallback, createContext, useContext } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toastData: Omit<Toast, 'id'>) => { id: string; dismiss: () => void };
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = (++toastId).toString();
    const newToast = { ...toastData, id };
    
    setToasts(prev => [newToast]); // Remplace le toast précédent
    
    return {
      id,
      dismiss: () => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }
    };
  }, []);

  const dismiss = useCallback((id?: string) => {
    if (id) {
      setToasts(prev => prev.filter(t => t.id !== id));
    } else {
      setToasts([]);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useCustomToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useCustomToast must be used within a ToastProvider');
  }
  return context;
};
