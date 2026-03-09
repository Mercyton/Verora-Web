'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Instagram, Linkedin, Twitter } from 'lucide-react';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import type { TeamMember } from '@/types/supabase';

interface Props {
  data: {
    vision?: string;
    mission?: string;
    values?: { title: string; description: string }[];
    process_steps?: { step: string; title: string; description: string }[];
  };
  team: TeamMember[];
}

export default function AboutContent({ data, team }: Props) {
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const processRef = useRef(null);
  const ctaRef = useRef(null);

  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' });
  const teamInView = useInView(teamRef, { once: true, margin: '-80px' });
  const processInView = useInView(processRef, { once: true, margin: '-80px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-24 pt-36 overflow-hidden bg-ink" ref={heroRef}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#F5F0E8 1px, transparent 1px), linear-gradient(90deg, #F5F0E8 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-main relative z-10">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="label block mb-6"
          >
            About Verola Studios
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="heading-xl text-cream max-w-4xl mb-8"
          >
            We Are Storytellers,<br />
            <span className="text-gradient">Strategists & Makers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="body-lg text-cream/50 max-w-2xl"
          >
            Founded on the belief that great creative work can change how the world sees a brand — and how a brand sees itself.
          </motion.p>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="section bg-ink-900" ref={valuesRef}>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate={valuesInView ? 'visible' : 'hidden'}
              className="p-10 border border-gold/20 bg-gold/5"
            >
              <span className="label block mb-4">Our Vision</span>
              <p className="font-display text-xl text-cream leading-relaxed">
                {data.vision || 'To become the most recognized creative force shaping how brands communicate their stories.'}
              </p>
            </motion.div>
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              animate={valuesInView ? 'visible' : 'hidden'}
              className="p-10 border border-cream/10 bg-ink-800/50"
            >
              <span className="label block mb-4">Our Mission</span>
              <p className="font-display text-xl text-cream leading-relaxed">
                {data.mission || 'We partner with ambitious brands to create visually stunning, strategically sound creative work.'}
              </p>
            </motion.div>
          </div>

          {/* Values */}
          {data.values && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={valuesInView ? 'visible' : 'hidden'}
            >
              <span className="label block mb-10">Core Values</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.values.map((value, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="group p-6 border border-cream/5 hover:border-gold/20 transition-all duration-400 bg-ink-800/30 hover:bg-ink-700/50"
                  >
                    <div className="w-8 h-8 border border-gold/30 flex items-center justify-center mb-4">
                      <span className="font-mono text-xs text-gold">0{i + 1}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-cream mb-2 group-hover:text-gold transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-cream/40 text-sm leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Team */}
      <section className="section bg-ink" ref={teamRef}>
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={teamInView ? { opacity: 1 } : {}}
                className="label block mb-4"
              >
                The Team
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                className="heading-lg text-cream"
              >
                The People Behind<br />
                <span className="text-gradient">The Magic</span>
              </motion.h2>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={teamInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => {
              const socials = member.social_links as Record<string, string>;
              return (
                <motion.div key={member.id} variants={fadeInUp} className="group">
                  {/* Image */}
                  <div className="relative overflow-hidden mb-5 aspect-[3/4]">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-ink-700 flex items-center justify-center">
                        <span className="font-display text-5xl font-bold text-gold/30">{member.name[0]}</span>
                      </div>
                    )}
                    {/* Overlay with social links */}
                    <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-start p-5">
                      <div className="flex gap-2">
                        {socials.instagram && (
                          <a href={socials.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-all duration-300">
                            <Instagram size={14} />
                          </a>
                        )}
                        {socials.linkedin && (
                          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-all duration-300">
                            <Linkedin size={14} />
                          </a>
                        )}
                        {socials.twitter && (
                          <a href={socials.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-all duration-300">
                            <Twitter size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-cream mb-1">{member.name}</h3>
                  <p className="text-gold text-xs font-mono uppercase tracking-widest mb-3">{member.role}</p>
                  {member.bio && (
                    <p className="text-cream/40 text-sm leading-relaxed">{member.bio}</p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Creative Process */}
      {data.process_steps && (
        <section className="section bg-ink-900" ref={processRef}>
          <div className="container-main">
            <div className="mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                animate={processInView ? { opacity: 1 } : {}}
                className="label block mb-4"
              >
                How We Work
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                className="heading-lg text-cream"
              >
                Our Creative<br />
                <span className="text-gradient">Process</span>
              </motion.h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={processInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
            >
              {data.process_steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group relative p-8 border-b border-r border-cream/5 hover:bg-ink-700/40 transition-all duration-400"
                >
                  {/* Step number */}
                  <span className="font-display text-6xl font-bold text-cream/5 group-hover:text-gold/10 transition-colors duration-500 block mb-4">
                    {step.step}
                  </span>
                  <div className="w-8 h-[2px] bg-gold mb-6" />
                  <h3 className="font-display text-xl font-semibold text-cream mb-3 group-hover:text-gold transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-cream/40 text-sm leading-relaxed">{step.description}</p>

                  {/* Connector arrow on desktop */}
                  {i < data.process_steps!.length - 1 && (
                    <div className="hidden lg:block absolute top-8 right-0 w-4 h-4 border-t border-r border-gold/20 rotate-45 translate-x-2 z-10 bg-ink-900" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA / Login gateway */}
      <section className="section bg-ink" ref={ctaRef}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            className="border border-gold/20 p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <span className="label block mb-4">Ready to Work Together?</span>
              <h2 className="heading-md text-cream mb-6">
                Let's Build Something<br />
                <span className="text-gradient">Extraordinary</span>
              </h2>
              <p className="body-md text-cream/50 max-w-lg mx-auto mb-10">
                Partner with us and experience the difference that strategic creativity makes. Your brand deserves to be unforgettable.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/main/contact" className="btn-primary group">
                  Start a Project
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/auth/login" className="btn-ghost group text-cream/40 hover:text-cream/70">
                  Team Login
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
