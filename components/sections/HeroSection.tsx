'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  data: {
    hero_headline?: string;
    hero_headline_accent?: string;
    hero_subtext?: string;
    stats?: { value: string; label: string }[];
  };
}

export default function HeroSection({ data }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const headline = data.hero_headline || 'We Build Brands That';
  const accent = data.hero_headline_accent || 'Cannot Be Ignored.';
  const subtext = data.hero_subtext || 'A full-service creative agency crafting compelling visual identities, immersive video productions, and digital experiences.';
  const stats = data.stats || [];

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-ink">
      {/* Background elements */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#F5F0E8 1px, transparent 1px), linear-gradient(90deg, #F5F0E8 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/3 rounded-full blur-[80px]" />
      </motion.div>

      {/* Floating geometric shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 right-16 w-16 h-16 border border-gold/20 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-32 left-12 w-8 h-8 bg-gold/10 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 right-8 w-[1px] h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden xl:block"
      />

      <motion.div style={{ opacity }} className="relative z-10 container-main pt-32 pb-20">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-12 h-[1px] bg-gold" />
          <span className="label">Full-Service Creative Agency</span>
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="heading-xl text-cream max-w-4xl"
          >
            {headline}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="heading-xl text-gradient max-w-4xl"
          >
            {accent}
          </motion.h1>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="body-lg text-cream/50 max-w-2xl mb-12"
        >
          {subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap items-center gap-5 mb-20"
        >
          <Link href="/main/portfolio" className="btn-primary group">
            View Portfolio
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/main/contact" className="btn-outline group">
            Hire Us
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <button className="btn-ghost group ml-4">
            <div className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/10 transition-all duration-300">
              <Play size={12} fill="currentColor" />
            </div>
            Our Story
          </button>
        </motion.div>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-cream/5 pt-10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
              >
                <p className="font-display text-3xl font-bold text-gold mb-1">{stat.value}</p>
                <p className="text-cream/40 text-xs font-mono uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="label text-cream/20 text-[10px]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
