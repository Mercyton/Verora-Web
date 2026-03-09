'use client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Palette, Monitor, Film, Camera, Zap, Globe, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { Service } from '@/types/supabase';

const iconMap: Record<string, React.ComponentType<any>> = {
  Palette, Monitor, Film, Camera, Zap, Globe, Layers,
};

interface Props { services: Service[]; }

export default function ServicesContent({ services }: Props) {
  const heroRef = useRef(null);
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: '-60px' });

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-ink">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#F5F0E8 1px, transparent 1px), linear-gradient(90deg, #F5F0E8 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-gold/3 to-transparent pointer-events-none" />
        <div className="container-main relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="label block mb-6"
          >
            What We Offer
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="heading-xl text-cream max-w-4xl mb-8"
          >
            Creative Services<br />
            <span className="text-gradient">That Drive Results</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="body-lg text-cream/50 max-w-2xl"
          >
            A complete creative arsenal — from brand conception to video production to digital design — all under one roof.
          </motion.p>
        </div>
      </section>

      {/* Services list */}
      <section className="section bg-ink-900" ref={listRef}>
        <div className="container-main">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={listInView ? 'visible' : 'hidden'}
            className="space-y-px"
          >
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Layers;
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-0 bg-ink-800/40 hover:bg-ink-700/50 border border-cream/5 hover:border-gold/20 transition-all duration-500 p-8 md:p-10"
                >
                  {/* Number */}
                  <div className="lg:col-span-1 mb-6 lg:mb-0 flex items-start">
                    <span className="font-mono text-xs text-cream/20 group-hover:text-gold/40 transition-colors duration-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="lg:col-span-3 mb-6 lg:mb-0 flex items-start gap-4">
                    <div className="w-12 h-12 border border-cream/10 group-hover:border-gold/40 flex items-center justify-center text-gold/60 group-hover:text-gold transition-all duration-300 flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300 mb-1">
                        {service.title}
                      </h2>
                      {service.price_range && (
                        <span className="text-xs font-mono text-gold/60">{service.price_range}</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-4 mb-6 lg:mb-0 lg:px-6">
                    <p className="text-cream/50 text-sm leading-relaxed">{service.description}</p>
                  </div>

                  {/* Features */}
                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features?.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle size={12} className="text-gold/50 flex-shrink-0" />
                          <span className="text-cream/40 text-xs font-mono">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-ink">
        <div className="container-main text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="label block mb-4">Ready to Start?</span>
            <h2 className="heading-lg text-cream mb-6">
              Let's Create Together
            </h2>
            <p className="body-md text-cream/50 max-w-lg mx-auto mb-10">
              Tell us about your project. We'll get back to you within 24 hours to discuss how we can bring your vision to life.
            </p>
            <Link href="/main/contact" className="btn-primary group">
              Start a Project
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
