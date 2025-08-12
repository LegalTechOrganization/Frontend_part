import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const duration = toast.durationMs ?? 3500;
    const item: ToastItem = { id, ...toast };
    setToasts(prev => [item, ...prev]);
    window.setTimeout(() => remove(id), duration);
  }, [remove]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Container */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map(({ id, title, description, variant = 'info' }) => {
            const palette =
              variant === 'success'
                ? 'border-green-200 bg-white'
                : variant === 'error'
                ? 'border-red-200 bg-white'
                : 'border-gold/20 bg-white';

            const Icon = variant === 'success' ? CheckCircle2 : variant === 'error' ? AlertCircle : Info;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${palette} p-4 shadow-lg`}
              >
                <div className="mt-0.5">
                  <Icon size={18} className={variant === 'error' ? 'text-red-600' : variant === 'success' ? 'text-green-600' : 'text-gold'} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{title}</div>
                  {description && <div className="mt-0.5 text-xs text-ink/70">{description}</div>}
                </div>
                <button
                  onClick={() => remove(id)}
                  className="ml-2 rounded-lg px-2 py-1 text-xs text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  Закрыть
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};


