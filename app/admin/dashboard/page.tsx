'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, FolderOpen, Users, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface Stats {
  services: number;
  projects: number;
  team: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ services: 0, projects: 0, team: 0, messages: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const [services, projects, team, messages, unread] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
      ]);
      setStats({
        services: services.count || 0,
        projects: projects.count || 0,
        team: team.count || 0,
        messages: messages.count || 0,
        unreadMessages: unread.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: Layers, label: 'Services', value: stats.services, href: '/admin/services', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: FolderOpen, label: 'Projects', value: stats.projects, href: '/admin/portfolio', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { icon: Users, label: 'Team Members', value: stats.team, href: '/admin/team', color: 'text-green-400', bg: 'bg-green-400/10' },
    { icon: MessageSquare, label: 'Messages', value: stats.messages, badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined, href: '/admin/messages', color: 'text-gold', bg: 'bg-gold/10' },
  ];

  const quickActions = [
    { label: 'Add Service', href: '/admin/services', desc: 'Create a new service offering' },
    { label: 'Add Project', href: '/admin/portfolio', desc: 'Upload a new portfolio item' },
    { label: 'Add Team Member', href: '/admin/team', desc: 'Add a new team member profile' },
    { label: 'View Messages', href: '/admin/messages', desc: `${stats.unreadMessages} unread messages` },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl font-bold text-cream mb-1">Dashboard</h1>
        <p className="text-cream/40 font-mono text-sm">Welcome back. Here's what's happening.</p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        {cards.map((card) => (
          <motion.div key={card.label} variants={fadeInUp}>
            <Link
              href={card.href}
              className="block p-6 bg-ink-800 border border-cream/5 hover:border-gold/20 transition-all duration-300 group"
            >
              <div className={`w-10 h-10 ${card.bg} flex items-center justify-center mb-4`}>
                <card.icon size={18} className={card.color} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-3xl font-bold text-cream group-hover:text-gold transition-colors">
                    {loading ? '—' : card.value}
                  </p>
                  <p className="text-cream/40 text-xs font-mono mt-1">{card.label}</p>
                </div>
                {card.badge && (
                  <span className="bg-accent text-cream text-[10px] font-mono px-2 py-0.5 rounded-full">
                    {card.badge} new
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-cream mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-4 bg-ink-800 border border-cream/5 hover:border-gold/20 hover:bg-ink-700 transition-all duration-300 group"
              >
                <div>
                  <p className="text-cream text-sm font-body group-hover:text-gold transition-colors">{action.label}</p>
                  <p className="text-cream/30 text-xs font-mono">{action.desc}</p>
                </div>
                <TrendingUp size={14} className="text-cream/20 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-cream mb-4">Site Overview</h2>
          <div className="p-6 bg-ink-800 border border-cream/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-cream/5">
                <span className="text-cream/50 text-xs font-mono">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-green-400 text-xs font-mono">Live</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-cream/5">
                <span className="text-cream/50 text-xs font-mono">Admin Email</span>
                <span className="text-cream/70 text-xs font-mono">sinkalamercyton24@gmail.com</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-cream/50 text-xs font-mono">Role</span>
                <span className="text-gold text-xs font-mono uppercase tracking-wider">Primary Admin</span>
              </div>
            </div>
            <Link
              href="/main"
              className="flex items-center gap-2 text-cream/40 hover:text-gold text-xs font-mono mt-6 transition-colors"
            >
              <Eye size={12} />
              View Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
