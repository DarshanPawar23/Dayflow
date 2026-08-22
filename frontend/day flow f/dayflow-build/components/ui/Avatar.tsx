import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs:  'w-6 h-6 text-[10px]',
  sm:  'w-8 h-8 text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-14 h-14 text-base',
  xl:  'w-20 h-20 text-xl',
};

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// Warm deterministic color based on name
const palettes = [
  'bg-[rgba(122,139,110,0.2)] text-[#4A5E40]',
  'bg-[rgba(160,112,96,0.2)] text-[#7A4838]',
  'bg-[rgba(100,105,160,0.15)] text-[#4A4E80]',
  'bg-[rgba(192,148,80,0.2)] text-[#8B6A2E]',
  'bg-[rgba(139,58,46,0.15)] text-[#8B3A2E]',
];

function colorFor(name: string) {
  const i = name.charCodeAt(0) % palettes.length;
  return palettes[i];
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover border border-[rgba(200,189,176,0.4)]', sizeMap[size], className)}
      />
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold border border-[rgba(200,189,176,0.4)]',
        sizeMap[size],
        colorFor(name),
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}
