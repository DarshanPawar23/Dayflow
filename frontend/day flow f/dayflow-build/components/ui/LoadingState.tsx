'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingStateProps { className?: string; rows?: number; }

function SkeletonLine({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={cn('shimmer rounded-lg', w, h)} />;
}

export function LoadingState({ className, rows = 4 }: LoadingStateProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.07 }}
          className="glass rounded-xl p-4 space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="shimmer w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine w="w-1/3" />
              <SkeletonLine w="w-1/2" h="h-3" />
            </div>
            <SkeletonLine w="w-16" h="h-6" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('glass rounded-2xl p-5 space-y-4', className)}>
      <SkeletonLine w="w-1/3" h="h-3" />
      <SkeletonLine w="w-1/2" h="h-7" />
      <div className="flex gap-2">
        <SkeletonLine w="w-16" h="h-5" />
        <SkeletonLine w="w-20" h="h-5" />
      </div>
    </div>
  );
}
