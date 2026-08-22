'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const variantMap: Record<Variant, string> = {
  primary:   'bg-[#2C2825] text-[#FDFAF5] border-[#2C2825] hover:bg-[#1A1612]',
  secondary: 'glass text-[#2C2825] border-[rgba(200,189,176,0.5)] hover:bg-[rgba(235,227,213,0.8)]',
  ghost:     'bg-transparent text-[#2C2825] border-transparent hover:bg-[rgba(235,227,213,0.6)]',
  danger:    'bg-[#8B3A2E] text-[#FDFAF5] border-[#8B3A2E] hover:bg-[#7A3227]',
};

const sizeMap: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl',
};

export function GlassButton({
  variant = 'secondary',
  size = 'md',
  loading,
  icon,
  children,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center font-medium border transition-colors select-none',
        variantMap[variant],
        sizeMap[size],
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={14} /> : icon}
      {children}
    </motion.button>
  );
}
