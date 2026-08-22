'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  width?: string;
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'w-80 md:w-96' }: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div className="absolute inset-0 bg-[rgba(26,22,18,0.4)] backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className={cn(
              'absolute top-0 bottom-0 glass flex flex-col shadow-lift',
              side === 'right' ? 'right-0 rounded-l-3xl' : 'left-0 rounded-r-3xl',
              width
            )}
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[rgba(200,189,176,0.35)] shrink-0">
              {title && <h2 className="text-sm font-semibold text-[#2C2825]">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[rgba(235,227,213,0.7)] transition-colors text-[#857D77]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
