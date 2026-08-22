'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppShell } from '@/components/layout/AppShell';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen bg-tonal flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[rgba(200,189,176,0.5)] border-t-[#2C2825] rounded-full animate-spin" />
    </div>
  );

  return <AppShell>{children}</AppShell>;
}
