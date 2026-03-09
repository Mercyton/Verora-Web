'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { Project } from '@/types/supabase';

const filters = ['All', 'Design', 'Video', 'Photography', 'Branding', 'Web'];

interface Props { projects: Project[]; }

export default function PortfolioContent({ projects }: Props) {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: '-60px' });

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === active.toLowerCase());

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-ink">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#F5F0E8 1px, transparent 1px), linear-gradient(90deg, #F5F0E8 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="container-main relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="label block mb-6"
          >
            Our Work
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="heading-xl text-cream max-w-4xl mb-6"
          >
            Work That Speaks<br />
            <span className="text-gradient">For Itself</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="body-lg text-cream/50 max-w-xl"
          >
            {projects.length} projects spanning brand identity, video, photography, and digital design.
          </motion.p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[65px] z-30 bg-ink/95 backdrop-blur-md border-b border-cream/5 py-4">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 flex-wrap"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-5 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300 border ${
                  active === f
                    ? 'bg-gold text-ink border-gold'
                    : 'border-cream/10 text-cream/40 hover:text-cream hover:border-cream/30'
                }`}
              >
                {f}
                {f !== 'All' && (
                  <span className="ml-2 opacity-50">
                    ({projects.filter(p => p.category.toLowerCase() === f.toLowerCase()).length})
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
      <section className="section bg-ink-900" ref={galleryRef}>
        <div className="container-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  layout
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => setSelected(project)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content on hover */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <span className="label text-[10px] mb-2">{project.category}</span>
                      <h3 className="font-display text-lg font-bold text-cream mb-1">{project.title}</h3>
                      <p className="text-cream/60 text-xs mb-3">{project.client}</p>
                      <div className="flex items-center gap-1 text-gold">
                        <span className="text-xs font-mono">View Project</span>
                        <ArrowUpRight size={12} />
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="label text-[9px] bg-ink/80 backdrop-blur-sm px-2 py-1 text-gold/80 border border-gold/20">
                        {project.category}
                      </span>
                    </div>

                    {/* Featured indicator */}
                    {project.is_featured && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-gold flex items-center justify-center">
                        <span className="text-ink text-[8px] font-mono font-bold">★</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-cream/30 font-mono">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-md overflow-y-auto"
          >
            <div className="min-h-screen">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-ink/95 backdrop-blur-md border-b border-cream/5 px-6 py-4 flex items-center justify-between">
                <span className="label">Project Detail</span>
                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 border border-cream/10 flex items-center justify-center text-cream/50 hover:border-gold/50 hover:text-gold transition-all duration-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-w-5xl mx-auto px-6 py-12">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Cover image */}
                  <div className="relative aspect-video overflow-hidden mb-10">
                    <Image src={selected.cover_image} alt={selected.title} fill className="object-cover" />
                  </div>

                  {/* Meta + title */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="md:col-span-2">
                      <span className="label block mb-3">{selected.category}</span>
                      <h2 className="heading-md text-cream mb-4">{selected.title}</h2>
                      <p className="body-md text-cream/50 leading-relaxed">{selected.description}</p>
                    </div>
                    <div className="space-y-4">
                      {selected.client && (
                        <div>
                          <p className="text-xs font-mono text-gold/60 uppercase tracking-widest mb-1">Client</p>
                          <p className="text-cream font-body">{selected.client}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-mono text-gold/60 uppercase tracking-widest mb-1">Category</p>
                        <p className="text-cream font-body capitalize">{selected.category}</p>
                      </div>
                      {selected.tags?.length > 0 && (
                        <div>
                          <p className="text-xs font-mono text-gold/60 uppercase tracking-widest mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selected.tags.map(t => (
                              <span key={t} className="text-xs font-mono text-cream/40 border border-cream/10 px-2 py-0.5">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selected.project_url && (
                        <a
                          href={selected.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline text-xs py-2 px-4 inline-flex mt-2"
                        >
                          Live Project <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
