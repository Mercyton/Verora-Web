'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { Project } from '@/types/supabase';

interface Props { projects: Project[]; }

export default function FeaturedWork({ projects }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section bg-ink-900" ref={ref}>
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="label block mb-4"
            >
              Our Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="heading-lg text-cream"
            >
              Featured<br />
              <span className="text-gradient">Projects</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link href="/main/portfolio" className="btn-outline group">
              All Projects
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.slice(0, 4).map((project, i) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className={`group relative overflow-hidden cursor-pointer ${i === 0 ? 'md:row-span-2' : ''}`}
            >
              <Link href={`/main/portfolio`}>
                <div className={`relative overflow-hidden ${i === 0 ? 'h-[500px] md:h-full min-h-[400px]' : 'h-[300px]'}`}>
                  <Image
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="label text-[10px] bg-gold/20 backdrop-blur-sm px-3 py-1 text-gold border border-gold/30">
                      {project.category}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-4 right-4 w-10 h-10 border border-cream/20 flex items-center justify-center text-cream/0 group-hover:text-cream group-hover:border-cream/60 transition-all duration-300 backdrop-blur-sm">
                    <ArrowUpRight size={16} />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-cream/50 text-xs font-mono mb-2">{project.client}</p>
                    <h3 className="font-display text-xl font-bold text-cream mb-2">{project.title}</h3>
                    <p className="text-cream/50 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {project.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] text-cream/40 font-mono border border-cream/10 px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
