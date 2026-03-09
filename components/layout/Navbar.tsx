'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Profile } from '@/types/supabase';

const navLinks = [
  { href: '/main', label: 'Home' },
  { href: '/main/about', label: 'About' },
  { href: '/main/services', label: 'Services' },
  { href: '/main/portfolio', label: 'Portfolio' },
  { href: '/main/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/main');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-ink/95 backdrop-blur-md border-b border-cream/5 py-4' : 'py-6'
        }`}
      >
        <div className="container-main flex items-center justify-between">
          {/* Logo */}
          <Link href="/main" className="group flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold flex items-center justify-center transition-all duration-300 group-hover:bg-gold">
              <span className="font-display font-bold text-gold text-sm group-hover:text-ink transition-colors duration-300">V</span>
            </div>
            <span className="font-display font-bold text-cream text-lg tracking-wider">
              Verola<span className="text-gold">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 group ${
                  pathname === link.href ? 'text-gold' : 'text-cream/60 hover:text-cream'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-300 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 border border-cream/20 px-3 py-2 hover:border-gold/50 transition-colors duration-300">
                  <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center">
                    <User size={12} className="text-gold" />
                  </div>
                  <span className="text-cream/70 text-xs font-mono">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-ink-700 border border-cream/10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                  {profile?.role === 'admin' && (
                    <Link href="/admin/dashboard" className="block px-4 py-3 text-sm text-cream/70 hover:text-gold hover:bg-ink-600 transition-colors duration-200 font-mono">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm text-cream/70 hover:text-accent hover:bg-ink-600 transition-colors duration-200 font-mono"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/main/contact" className="btn-primary text-xs py-3 px-6">
                Get In Touch
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-cream/70 hover:text-cream transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: '0%' }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-ink flex flex-col justify-center items-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-display text-4xl font-bold transition-colors duration-300 ${
                    pathname === link.href ? 'text-gold' : 'text-cream/50 hover:text-cream'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              {user ? (
                <button onClick={handleSignOut} className="btn-outline text-xs">Sign Out</button>
              ) : (
                <Link href="/main/contact" onClick={() => setMobileOpen(false)} className="btn-primary">
                  Get In Touch
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
