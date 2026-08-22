'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Sliders, ChevronRight, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

// Simple toggle switch
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(122,139,110,0.7)]',
        checked ? 'bg-[#7A8B6E]' : 'bg-[rgba(200,189,176,0.5)]'
      )}
    >
      <span className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-6' : 'translate-x-1'
      )} />
    </button>
  );
}

function SettingRow({ label, desc, control }: { label: string; desc?: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[rgba(200,189,176,0.2)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#2C2825]">{label}</p>
        {desc && <p className="text-xs text-[#A89F96] mt-0.5">{desc}</p>}
      </div>
      {control}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState({
    leaveUpdates: true,
    attendanceAlerts: true,
    payrollNotifs: true,
    systemAlerts: false,
  });
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('light');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'security', label: 'Security', icon: <Shield size={14} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
  ];

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-[#2C2825]">Settings</h1>
        <p className="text-sm text-[#857D77] mt-1">Manage your account and preferences.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Tabs tabs={tabs}>
          {(active) => (
            <GlassCard className="space-y-0" padding="none">
              {active === 'account' && (
                <div className="px-5 py-1">
                  {/* Profile preview */}
                  <div className="flex items-center gap-4 py-5 border-b border-[rgba(200,189,176,0.2)]">
                    <Avatar name={user?.name ?? 'User'} size="lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#2C2825]">{user?.name}</p>
                      <p className="text-sm text-[#857D77]">{user?.email}</p>
                      <p className="text-xs text-[#A89F96] capitalize mt-0.5">{user?.role} · {user?.employeeId}</p>
                    </div>
                    <GlassButton variant="secondary" size="sm">Change Photo</GlassButton>
                  </div>
                  <SettingRow
                    label="Display Name"
                    desc="How your name appears across the platform"
                    control={<input defaultValue={user?.name} className="w-48 px-3 py-1.5 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]" />}
                  />
                  <SettingRow
                    label="Language"
                    desc="Interface language"
                    control={
                      <select className="px-3 py-1.5 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] bg-transparent focus:outline-none">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                      </select>
                    }
                  />
                  <SettingRow
                    label="Timezone"
                    desc="Used for attendance and scheduling"
                    control={
                      <select className="px-3 py-1.5 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] bg-transparent focus:outline-none">
                        <option>UTC-05:00 (ET)</option>
                        <option>UTC+05:30 (IST)</option>
                        <option>UTC+00:00 (GMT)</option>
                      </select>
                    }
                  />
                </div>
              )}

              {active === 'notifications' && (
                <div className="px-5 py-1">
                  <SettingRow
                    label="Leave Updates"
                    desc="Approvals, rejections and new requests"
                    control={<Toggle id="notif-leave" checked={notifs.leaveUpdates} onChange={v => setNotifs(n => ({ ...n, leaveUpdates: v }))} />}
                  />
                  <SettingRow
                    label="Attendance Alerts"
                    desc="Late check-ins and absenteeism notices"
                    control={<Toggle id="notif-att" checked={notifs.attendanceAlerts} onChange={v => setNotifs(n => ({ ...n, attendanceAlerts: v }))} />}
                  />
                  <SettingRow
                    label="Payroll Notifications"
                    desc="Salary processing and payslip availability"
                    control={<Toggle id="notif-pay" checked={notifs.payrollNotifs} onChange={v => setNotifs(n => ({ ...n, payrollNotifs: v }))} />}
                  />
                  <SettingRow
                    label="System Alerts"
                    desc="Maintenance windows and platform updates"
                    control={<Toggle id="notif-sys" checked={notifs.systemAlerts} onChange={v => setNotifs(n => ({ ...n, systemAlerts: v }))} />}
                  />
                </div>
              )}

              {active === 'security' && (
                <div className="px-5 py-1">
                  <SettingRow
                    label="Change Password"
                    desc="Last changed 3 months ago"
                    control={<GlassButton variant="secondary" size="sm">Update</GlassButton>}
                  />
                  <SettingRow
                    label="Two-Factor Authentication"
                    desc="Add an extra layer of security"
                    control={<GlassButton variant="secondary" size="sm">Enable 2FA</GlassButton>}
                  />
                  <SettingRow
                    label="Active Sessions"
                    desc="1 active session on this device"
                    control={<GlassButton variant="ghost" size="sm" className="text-[#8B3A2E]">Sign Out All</GlassButton>}
                  />
                </div>
              )}

              {active === 'appearance' && (
                <div className="px-5 py-1">
                  <div className="py-5 border-b border-[rgba(200,189,176,0.2)]">
                    <p className="text-sm font-medium text-[#2C2825] mb-3">Theme</p>
                    <div className="flex gap-3">
                      {[
                        { value: 'light' as const, label: 'Light', icon: <Sun size={18} /> },
                        { value: 'system' as const, label: 'System', icon: <Monitor size={18} /> },
                        { value: 'dark' as const, label: 'Dark', icon: <Moon size={18} />, disabled: true },
                      ].map(({ value, label, icon, disabled }) => (
                        <button
                          key={value}
                          onClick={() => !disabled && setAppearance(value)}
                          disabled={disabled}
                          className={cn(
                            'flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-sm',
                            appearance === value
                              ? 'border-[#2C2825] bg-[rgba(44,40,37,0.05)] text-[#2C2825]'
                              : 'border-[rgba(200,189,176,0.4)] text-[#857D77] hover:border-[rgba(200,189,176,0.7)]',
                            disabled && 'opacity-40 cursor-not-allowed'
                          )}
                        >
                          {icon}
                          <span className="font-medium">{label}</span>
                          {disabled && <span className="text-[10px] text-[#A89F96]">Soon</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SettingRow
                    label="Compact Mode"
                    desc="Reduce spacing for denser information display"
                    control={<Toggle id="compact" checked={false} onChange={() => {}} />}
                  />
                  <SettingRow
                    label="Reduce Motion"
                    desc="Minimize animations for accessibility"
                    control={<Toggle id="reduce-motion" checked={false} onChange={() => {}} />}
                  />
                </div>
              )}

              {/* Save button */}
              <div className="px-5 py-4 border-t border-[rgba(200,189,176,0.2)]">
                <GlassButton variant="primary" size="md" onClick={handleSave}>
                  {saved ? '✓ Changes Saved' : 'Save Changes'}
                </GlassButton>
              </div>
            </GlassCard>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
}
