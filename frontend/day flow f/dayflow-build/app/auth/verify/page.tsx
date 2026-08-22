'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Waves, Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';

export default function VerifyPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
    setResent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-tonal">
      <div className="w-full max-w-sm text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-3xl p-10 space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
            className="w-16 h-16 rounded-2xl bg-[rgba(122,139,110,0.12)] flex items-center justify-center mx-auto text-[#7A8B6E]"
          >
            <Mail size={30} />
          </motion.div>

          <div>
            <h1 className="text-xl font-semibold text-[#2C2825]">Check your inbox</h1>
            <p className="text-sm text-[#857D77] mt-2 leading-relaxed">
              We&apos;ve sent a verification link to your email address. Click the link to confirm your account.
            </p>
          </div>

          {resent && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 justify-center text-sm text-[#4A5E40]"
            >
              <CheckCircle size={15} /> Email resent successfully.
            </motion.div>
          )}

          <div className="flex flex-col gap-3">
            <a href="mailto:" target="_blank" rel="noopener noreferrer">
              <GlassButton variant="primary" size="md" className="w-full" icon={<Mail size={15} />}>
                Open Email App
              </GlassButton>
            </a>
            <GlassButton variant="secondary" size="md" loading={resending} onClick={handleResend} className="w-full" icon={<RefreshCw size={14} />}>
              {resending ? 'Resending…' : 'Resend Email'}
            </GlassButton>
          </div>

          <Link href="/auth/signup" className="flex items-center justify-center gap-1.5 text-sm text-[#857D77] hover:text-[#2C2825] transition-colors">
            <ArrowLeft size={14} /> Change email address
          </Link>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-6 h-6 rounded-lg bg-[#2C2825] flex items-center justify-center">
            <Waves size={12} className="text-[#EBE3D5]" />
          </div>
          <span className="text-sm font-medium text-[#2C2825]">DAYFLOW</span>
        </div>
      </div>
    </div>
  );
}
