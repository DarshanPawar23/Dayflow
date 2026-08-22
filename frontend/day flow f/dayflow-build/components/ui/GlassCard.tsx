'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const padMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function GlassCard({ children, className, hover = true, padding = 'md', ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'glass rounded-2xl',
        padMap[padding],
        hover && 'cursor-default',
        className
      )}
      whileHover={hover ? { y: -2, boxShadow: '0 12px 40px rgba(44,40,37,0.13)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
