'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async ({ email, password }: FormData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        toast.success('Welcome back, Admin!');
        router.push('/admin/dashboard');
      } else {
        toast.success('Welcome back!');
        router.push('/main');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Back link */}
        <Link href="/main/about" className="btn-ghost text-cream/30 hover:text-cream/60 mb-10 block">
          <ArrowLeft size={14} />
          Back to Site
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 border-2 border-gold flex items-center justify-center">
            <span className="font-display font-bold text-gold">V</span>
          </div>
          <span className="font-display font-bold text-cream text-xl tracking-wider">
            Verola<span className="text-gold">.</span>
          </span>
        </div>

        <div className="mb-8">
          <h1 className="heading-md text-cream mb-2">Sign In</h1>
          <p className="text-cream/40 text-sm font-body">Access your account or the admin panel.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label text-[10px] mb-2 block">Email Address</label>
            <input
              {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
              type="email"
              placeholder="you@example.com"
              className="input-dark"
            />
            {errors.email && <p className="text-accent text-xs mt-1 font-mono">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label text-[10px] mb-2 block">Password</label>
            <div className="relative">
              <input
                {...register('password', { required: 'Password required' })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-dark pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-accent text-xs mt-1 font-mono">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-6 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              <>Sign In <LogIn size={16} /></>
            )}
          </button>
        </form>

        <p className="text-cream/20 text-xs text-center mt-8 font-mono">
          Admin access is restricted to authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
}
