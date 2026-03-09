'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, Palette, Monitor, Film, Camera, Zap, Globe, Layers } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { Service } from '@/types/supabase';

const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette size={24} />,
  Monitor: <Monitor size={24} />,
  Film: <Film size={24} />,
  Camera: <Camera size={24} />,
  Zap: <Zap size={24} />,
  Globe: <Globe size={24} />,
  Layers: <Layers size={24} />,
};

interface Props { services: Service[]; }

export default function ServicesSection({ services }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section bg-ink relative" ref={ref}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cream/5 to-transparent" />

      <div className="container-main">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="label block mb-4"
            >
              What We Do
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="heading-lg text-cream"
            >
              Creative Services<br />
              <span className="text-gradient">Built to Perform</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p className="body-md text-cream/50 mb-6">
              From brand conception to digital execution, we offer a complete suite of creative services tailored to ambitious brands.
            </p>
            <Link href="/main/services" className="btn-ghost group">
              Explore All Services
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Services grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/5"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              variants={fadeInUp}
              className="bg-ink p-8 group cursor-pointer border-b border-r border-cream/5 hover:bg-ink-800 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 border border-cream/10 flex items-center justify-center text-gold/70 mb-6 group-hover:border-gold/50 group-hover:text-gold transition-all duration-300">
                  {iconMap[service.icon] || <Layers size={24} />}
                </div>

                {/* Content */}
                <h3 className="heading-sm text-cream mb-3 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="body-md text-cream/40 text-sm mb-6 leading-relaxed">
                  {service.short_description}
                </p>

                {/* Features preview */}
                {service.features?.slice(0, 3).map((f) => (
                  <div key={f} className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-1 bg-gold/50 rounded-full" />
                    <span className="text-cream/30 text-xs font-mono">{f}</span>
                  </div>
                ))}

                {/* CTA */}
                <div className="mt-6 flex items-center gap-2 text-gold/0 group-hover:text-gold transition-all duration-300">
                  <span className="text-xs font-mono uppercase tracking-widest">Learn More</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
