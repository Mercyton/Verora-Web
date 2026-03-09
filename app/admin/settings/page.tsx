'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, UserPlus, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase';
import type { Profile } from '@/types/supabase';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminSettings() {
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [inviting, setInviting] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setCurrentProfile(profile);

      const { data: allAdmins } = await supabase.from('profiles').select('*').eq('role', 'admin');
      setAdmins(allAdmins || []);
    };
    init();
  }, []);

  const isPrimaryAdmin = currentProfile?.email === ADMIN_EMAIL;

  const inviteAdmin = async ({ email }: { email: string }) => {
    if (!isPrimaryAdmin) { toast.error('Only the primary admin can invite new admins.'); return; }
    setInviting(true);
    try {
      // Look up if user exists and update their role
      const { data: existing } = await supabase.from('profiles').select('*').eq('email', email).single();
      if (existing) {
        const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('email', email);
        if (error) throw error;
        toast.success(`${email} is now an admin.`);
        const { data: allAdmins } = await supabase.from('profiles').select('*').eq('role', 'admin');
        setAdmins(allAdmins || []);
      } else {
        toast.error('User not found. They need to create an account first.');
      }
      reset();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setInviting(false);
    }
  };

  const revokeAdmin = async (profileId: string, email: string) => {
    if (!isPrimaryAdmin) { toast.error('Only the primary admin can revoke admin access.'); return; }
    if (email === ADMIN_EMAIL) { toast.error('Cannot revoke the primary admin.'); return; }
    if (!confirm(`Revoke admin access for ${email}?`)) return;
    await supabase.from('profiles').update({ role: 'user' }).eq('id', profileId);
    toast.success('Admin access revoked.');
    setAdmins(a => a.filter(p => p.id !== profileId));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-cream">Settings</h1>
        <p className="text-cream/40 font-mono text-sm mt-1">Site configuration & access control</p>
      </div>

      {/* Admin Access Control */}
      <div className="bg-ink-800 border border-cream/5 mb-6">
        <div className="flex items-center gap-3 p-6 border-b border-cream/5">
          <Shield size={18} className="text-gold" />
          <div>
            <h2 className="font-body font-semibold text-cream">Admin Access Control</h2>
            <p className="text-cream/30 text-xs font-mono mt-0.5">
              {isPrimaryAdmin ? 'You are the primary admin.' : 'Only the primary admin can manage admins.'}
            </p>
          </div>
        </div>

        {/* Current admins list */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} className="text-cream/40" />
            <h3 className="text-cream/70 text-sm font-mono">Current Admins ({admins.length})</h3>
          </div>
          <div className="space-y-2 mb-6">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between py-2 px-3 bg-ink-700/50 border border-cream/5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-gold text-xs font-display font-bold">{admin.email[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-cream text-xs font-mono">{admin.email}</p>
                    {admin.email === ADMIN_EMAIL && (
                      <span className="text-[9px] font-mono text-gold">Primary Admin</span>
                    )}
                  </div>
                </div>
                {isPrimaryAdmin && admin.email !== ADMIN_EMAIL && (
                  <button
                    onClick={() => revokeAdmin(admin.id, admin.email)}
                    className="text-xs font-mono text-accent/60 hover:text-accent transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Invite form */}
          {isPrimaryAdmin && (
            <div>
              <h3 className="text-cream/70 text-sm font-mono mb-3 flex items-center gap-2">
                <UserPlus size={14} />
                Invite Admin
              </h3>
              <form onSubmit={handleSubmit(inviteAdmin)} className="flex gap-3">
                <input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="admin@example.com"
                  className="input-dark flex-1"
                />
                <button type="submit" disabled={inviting} className="btn-primary text-xs py-3 px-5 flex-shrink-0">
                  {inviting ? (
                    <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  ) : (
                    <><UserPlus size={14} /> Invite</>
                  )}
                </button>
              </form>
              <p className="text-cream/20 text-xs font-mono mt-2">
                Note: The user must have an existing account before being granted admin access.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Site info */}
      <div className="bg-ink-800 border border-cream/5 p-6">
        <h2 className="font-body font-semibold text-cream mb-4">Site Information</h2>
        <div className="space-y-3">
          {[
            { label: 'Site Name', value: 'Verola Studios' },
            { label: 'Admin Email', value: ADMIN_EMAIL || 'sinkalamercyton24@gmail.com' },
            { label: 'Database', value: 'Supabase PostgreSQL' },
            { label: 'Hosting', value: 'Netlify' },
            { label: 'Framework', value: 'Next.js 14 App Router' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-cream/5">
              <span className="text-cream/40 text-xs font-mono">{item.label}</span>
              <span className="text-cream/70 text-xs font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
