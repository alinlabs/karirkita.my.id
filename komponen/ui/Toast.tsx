import React from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-slate-800'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn("fixed bottom-4 right-4 z-[100] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3", bgColors[type])}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-75 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};