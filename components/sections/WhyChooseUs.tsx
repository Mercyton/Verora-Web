'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Users, Award, Lightbulb } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const reasons = [
  {
    icon: Target,
    title: 'Strategy First',
    description: 'Every creative decision starts with a clear strategy. We align visual excellence with business goals to create work that performs.',
  },
  {
    icon: Users,
    title: 'True Collaboration',
    description: 'We become an extension of your team. Transparent process, regular touchpoints, and genuine partnership.',
  },
  {
    icon: Award,
    title: 'Award-Winning Quality',
    description: 'Our work has been recognized across 15+ industry awards. Quality is not a goal — it\'s our baseline.',
  },
  {
    icon: Lightbulb,
    title: 'Creative Boldness',
    description: 'We push past the expected to find solutions that genuinely surprise and differentiate your brand in the market.',
  },
];

export default function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section relative overflow-hidden bg-ink" ref={ref}>
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-display text-[20rem] font-bold text-cream/[0.015] select-none whitespace-nowrap">
          VEROLA
        </span>
      </div>

      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="label block mb-4"
            >
              Why Verola
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="heading-lg text-cream mb-6"
            >
              The Agency Built<br />
              for <span className="text-gradient">Ambitious Brands</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="body-md text-cream/50 mb-10 max-w-md"
            >
              We don't just deliver creative assets. We build visual systems and narratives that become foundational to how your brand communicates — forever.
            </motion.p>
            
            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full h-[1px] bg-gradient-to-r from-gold/40 to-transparent origin-left mb-10"
            />
            
            {/* Small stat */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6"
            >
              <div>
                <p className="font-display text-4xl font-bold text-gold">98%</p>
                <p className="text-cream/30 text-xs font-mono uppercase tracking-widest mt-1">Client Satisfaction</p>
              </div>
              <div className="w-[1px] h-12 bg-cream/10" />
              <div>
                <p className="font-display text-4xl font-bold text-gold">3×</p>
                <p className="text-cream/30 text-xs font-mono uppercase tracking-widest mt-1">Average Brand Growth</p>
              </div>
            </motion.div>
          </div>

          {/* Right grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {reasons.map((reason) => (
              <motion.div
                key={reason.title}
                variants={fadeInUp}
                className="group p-6 border border-cream/5 hover:border-gold/20 bg-ink-800/50 hover:bg-ink-700/50 transition-all duration-400"
              >
                <div className="w-10 h-10 border border-cream/10 group-hover:border-gold/40 flex items-center justify-center text-gold/60 group-hover:text-gold mb-4 transition-all duration-300">
                  <reason.icon size={18} />
                </div>
                <h3 className="font-display text-lg font-semibold text-cream mb-2 group-hover:text-gold transition-colors duration-300">
                  {reason.title}
                </h3>
                <p className="text-cream/40 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
