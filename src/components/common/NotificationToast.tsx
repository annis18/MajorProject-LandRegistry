import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  txHash?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white ${
              toast.type === 'success'
                ? 'border-[#b2f2bb] text-[#1a1a1a]'
                : toast.type === 'error'
                ? 'border-[#ffc9c9] text-[#1a1a1a]'
                : 'border-[#a5d8ff] text-[#1a1a1a]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#0ca678]" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#e03131]" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#1971c2]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#1a1a1a] tracking-tight">{toast.title}</h4>
              <p className="text-xs text-[#495057] mt-0.5 leading-relaxed">{toast.message}</p>
              {toast.txHash && (
                <div className="mt-2 text-[11px] font-mono text-[#495057] bg-[#f8f9fa] px-2 py-1 rounded border border-[#e9ecef] flex items-center justify-between">
                  <span className="truncate">Tx: {toast.txHash}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#adb5bd] hover:text-[#1a1a1a] p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
