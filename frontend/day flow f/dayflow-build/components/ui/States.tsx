'use client';
import { motion } from 'framer-motion';
import { InboxIcon, AlertCircle } from 'lucide-react';
import { GlassButton } from './GlassButton';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-[rgba(235,227,213,0.7)] flex items-center justify-center text-[#A89F96]">
        {icon ?? <InboxIcon size={28} />}
      </div>
      <div>
        <p className="text-base font-medium text-[#2C2825]">{title}</p>
        {description && <p className="text-sm text-[#857D77] mt-1 max-w-xs">{description}</p>}
      </div>
      {action && (
        <GlassButton variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </GlassButton>
      )}
    </motion.div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[rgba(139,58,46,0.12)] flex items-center justify-center text-[#8B3A2E]">
        <AlertCircle size={26} />
      </div>
      <div>
        <p className="text-base font-medium text-[#2C2825]">Something went wrong</p>
        <p className="text-sm text-[#857D77] mt-1">{message}</p>
      </div>
      {onRetry && (
        <GlassButton variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </GlassButton>
      )}
    </div>
  );
}
