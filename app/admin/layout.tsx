'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Layers, FolderOpen, Users, Settings,
  Mail, LogOut, ChevronRight, Menu, X, MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import type { Profile } from '@/types/supabase';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/services', icon: Layers, label: 'Services' },
  { href: '/admin/portfolio', icon: FolderOpen, label: 'Portfolio' },
  { href: '/admin/team', icon: Users, label: 'Team' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!data || data.role !== 'admin') { router.push('/main'); return; }
      setProfile(data);
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Sidebar = () => (
    <aside className="w-64 bg-ink-900 border-r border-cream/5 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-cream/5">
        <Link href="/main" className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
            <span className="font-display font-bold text-gold text-sm">V</span>
          </div>
          <div>
            <span className="font-display font-bold text-cream text-base tracking-wider">
              Verola<span className="text-gold">.</span>
            </span>
            <p className="text-[9px] font-mono text-cream/30 uppercase tracking-widest -mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 text-sm font-body transition-all duration-200 group ${
                isActive
                  ? 'bg-gold/10 border border-gold/20 text-gold'
                  : 'text-cream/40 hover:text-cream hover:bg-ink-700/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                {label}
              </div>
              <ChevronRight size={12} className={`transition-transform ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-cream/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-gold text-xs font-display font-bold">
              {profile.full_name?.[0] || profile.email[0].toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-cream text-xs font-body truncate">{profile.full_name || 'Admin'}</p>
            <p className="text-cream/30 text-[10px] font-mono truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-4 py-2 text-cream/30 hover:text-accent text-xs font-mono uppercase tracking-widest transition-colors duration-200"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/80" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="relative w-64 h-full"
          >
            <Sidebar />
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="bg-ink-900 border-b border-cream/5 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-cream/50 hover:text-cream"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-cream font-body font-medium text-sm">
                {navItems.find(n => n.href === pathname)?.label || 'Admin'}
              </h1>
              <p className="text-cream/30 text-xs font-mono">Verola Studios CMS</p>
            </div>
          </div>
          <Link href="/main" className="text-cream/30 hover:text-gold text-xs font-mono uppercase tracking-widest transition-colors">
            View Site →
          </Link>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
