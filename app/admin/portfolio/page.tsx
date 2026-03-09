'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase';
import type { Project } from '@/types/supabase';

const CATEGORIES = ['design', 'video', 'photography', 'branding', 'web'];

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, reset } = useForm();

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => { reset(); setEditing(null); setModal('create'); };

  const openEdit = (p: Project) => {
    setEditing(p);
    reset({
      ...p,
      tags: p.tags?.join(', '),
      images: p.images?.join('\n'),
    });
    setModal('edit');
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      images: data.images ? data.images.split('\n').filter(Boolean) : [],
      is_featured: !!data.is_featured,
      sort_order: parseInt(data.sort_order) || 0,
    };
    try {
      if (modal === 'create') {
        const { error } = await supabase.from('projects').insert(payload);
        if (error) throw error;
        toast.success('Project created!');
      } else if (editing) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Project updated!');
      }
      setModal(null);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Project deleted.');
    fetchProjects();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-cream">Portfolio</h1>
          <p className="text-cream/40 font-mono text-sm mt-1">{projects.length} projects</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs py-3 px-5">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-ink-800 border border-cream/5 hover:border-cream/10 overflow-hidden transition-all duration-200"
            >
              <div className="relative h-40 overflow-hidden">
                <Image src={project.cover_image} alt={project.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(project)} className="p-2 bg-gold text-ink hover:bg-gold-light transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteProject(project.id)} className="p-2 bg-accent/80 text-cream hover:bg-accent transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                {project.is_featured && (
                  <div className="absolute top-2 right-2 bg-gold text-ink text-[9px] font-mono px-2 py-0.5">★ Featured</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-body font-medium text-cream text-sm leading-tight">{project.title}</h3>
                  <span className="text-[9px] font-mono text-gold/70 border border-gold/20 px-1.5 py-0.5 flex-shrink-0 capitalize">{project.category}</span>
                </div>
                <p className="text-cream/30 text-xs font-mono mt-1">{project.client}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-ink-800 border border-cream/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-cream/5 sticky top-0 bg-ink-800">
                <h2 className="font-display text-lg font-semibold text-cream">
                  {modal === 'create' ? 'New Project' : 'Edit Project'}
                </h2>
                <button onClick={() => setModal(null)} className="text-cream/40 hover:text-cream"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Title *</label>
                    <input {...register('title', { required: true })} className="input-dark" placeholder="Project Name" />
                  </div>
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Slug *</label>
                    <input {...register('slug', { required: true })} className="input-dark" placeholder="project-name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Category *</label>
                    <select {...register('category', { required: true })} className="input-dark">
                      {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Client</label>
                    <input {...register('client')} className="input-dark" placeholder="Client Name" />
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Cover Image URL *</label>
                  <input {...register('cover_image', { required: true })} className="input-dark" placeholder="https://..." />
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Short Description</label>
                  <input {...register('short_description')} className="input-dark" placeholder="Brief tagline" />
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Full Description *</label>
                  <textarea {...register('description', { required: true })} rows={4} className="input-dark resize-none" placeholder="Detailed project description..." />
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Tags (comma separated)</label>
                  <input {...register('tags')} className="input-dark" placeholder="Design, Branding, Identity" />
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Additional Images (one URL per line)</label>
                  <textarea {...register('images')} rows={3} className="input-dark resize-none font-mono text-xs" placeholder="https://..." />
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Project URL</label>
                  <input {...register('project_url')} className="input-dark" placeholder="https://..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Sort Order</label>
                    <input {...register('sort_order')} type="number" className="input-dark" defaultValue={0} />
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register('is_featured')} type="checkbox" className="w-4 h-4 accent-gold" />
                      <span className="text-cream/60 text-sm font-body">Featured Project</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary text-xs py-3 px-6 flex-1 justify-center">
                    <Save size={14} />
                    {modal === 'create' ? 'Create Project' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setModal(null)} className="btn-outline text-xs py-3 px-6">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
