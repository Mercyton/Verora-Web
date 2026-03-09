'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Testimonial } from '@/types/supabase';

interface Props { testimonials: Testimonial[]; }

export default function TestimonialsSection({ testimonials }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);

  if (!testimonials.length) return null;

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);
  const current = testimonials[active];

  return (
    <section className="section bg-ink-900 relative overflow-hidden" ref={ref}>
      {/* Background element */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="label block mb-4">Client Stories</span>
          <h2 className="heading-lg text-cream">
            What Our Clients<br />
            <span className="text-gradient">Say About Us</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Quote card */}
          <div className="relative p-10 md:p-14 border border-cream/10 bg-ink-800/50">
            {/* Quote icon */}
            <Quote size={48} className="text-gold/20 mb-6" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#C9A84C" className="text-gold" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="font-display text-xl md:text-2xl text-cream leading-relaxed mb-8">
                  "{current.content}"
                </blockquote>

                {/* Client info */}
                <div className="flex items-center gap-4">
                  {current.client_avatar ? (
                    <div className="w-12 h-12 relative overflow-hidden rounded-full">
                      <Image src={current.client_avatar} alt={current.client_name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gold/20 flex items-center justify-center">
                      <span className="font-display font-bold text-gold text-lg">
                        {current.client_name[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-body font-semibold text-cream">{current.client_name}</p>
                    <p className="text-cream/40 text-sm font-mono">
                      {current.client_role}{current.client_company && `, ${current.client_company}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-cream/5">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-[2px] transition-all duration-300 ${
                      i === active ? 'w-8 bg-gold' : 'w-4 bg-cream/20 hover:bg-cream/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 border border-cream/10 flex items-center justify-center text-cream/40 hover:border-gold/50 hover:text-gold transition-all duration-300"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 border border-cream/10 flex items-center justify-center text-cream/40 hover:border-gold/50 hover:text-gold transition-all duration-300"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
