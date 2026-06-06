import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, type = 'info', duration = 4000 }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex gap-3 p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-in bg-black/85 text-white"
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="size-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="size-5 text-red-400" />}
              {t.type === 'warning' && <AlertTriangle className="size-5 text-amber-400" />}
              {t.type === 'info' && <Info className="size-5 text-sky-400" />}
            </div>
            
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold tracking-wide">{t.title}</h4>
              {t.description && <p className="text-xs text-white/60 leading-relaxed">{t.description}</p>}
            </div>
            
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 size-6 rounded hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast faqat ToastProvider ichida ishlatilishi kerak');
  }
  return context;
}