import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search…', className, id = 'search' }: SearchBarProps) {
  return (
    <label htmlFor={id} className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 text-[#A89F96]" size={16} />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 text-sm bg-[rgba(253,250,245,0.8)] border border-[rgba(200,189,176,0.4)] rounded-xl text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] focus:border-[rgba(122,139,110,0.5)] transition-all"
      />
    </label>
  );
}
