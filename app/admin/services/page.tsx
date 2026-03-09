'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase';
import type { Service } from '@/types/supabase';

const iconOptions = ['Palette', 'Monitor', 'Film', 'Camera', 'Zap', 'Globe', 'Layers', 'Brush', 'Code'];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => {
    reset();
    setEditing(null);
    setModal('create');
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    reset({
      title: service.title,
      slug: service.slug,
      description: service.description,
      short_description: service.short_description,
      icon: service.icon,
      features: service.features?.join('\n'),
      price_range: service.price_range,
      is_featured: service.is_featured,
      sort_order: service.sort_order,
    });
    setModal('edit');
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      features: data.features ? data.features.split('\n').filter(Boolean) : [],
      is_featured: !!data.is_featured,
      sort_order: parseInt(data.sort_order) || 0,
    };

    try {
      if (modal === 'create') {
        const { error } = await supabase.from('services').insert(payload);
        if (error) throw error;
        toast.success('Service created!');
      } else if (editing) {
        const { error } = await supabase.from('services').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Service updated!');
      }
      setModal(null);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Service deleted.');
    fetchServices();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-cream">Services</h1>
          <p className="text-cream/40 font-mono text-sm mt-1">{services.length} services</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs py-3 px-5">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-5 bg-ink-800 border border-cream/5 hover:border-cream/10 transition-all duration-200 group"
            >
              <GripVertical size={14} className="text-cream/20 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-body font-medium text-cream">{service.title}</span>
                  {service.is_featured && (
                    <span className="text-[9px] font-mono text-gold border border-gold/30 px-2 py-0.5">Featured</span>
                  )}
                </div>
                <p className="text-cream/40 text-xs font-mono mt-0.5 truncate">{service.short_description}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(service)}
                  className="p-2 text-cream/40 hover:text-gold hover:bg-gold/10 transition-all duration-200"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-2 text-cream/40 hover:text-accent hover:bg-accent/10 transition-all duration-200"
                >
                  <Trash2 size={14} />
                </button>
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
                  {modal === 'create' ? 'New Service' : 'Edit Service'}
                </h2>
                <button onClick={() => setModal(null)} className="text-cream/40 hover:text-cream">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Title *</label>
                    <input {...register('title', { required: true })} className="input-dark" placeholder="Brand Identity" />
                  </div>
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Slug *</label>
                    <input {...register('slug', { required: true })} className="input-dark" placeholder="brand-identity" />
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Short Description</label>
                  <input {...register('short_description')} className="input-dark" placeholder="Brief tagline" />
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Full Description *</label>
                  <textarea {...register('description', { required: true })} rows={4} className="input-dark resize-none" placeholder="Detailed service description..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Icon</label>
                    <select {...register('icon')} className="input-dark">
                      {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Price Range</label>
                    <input {...register('price_range')} className="input-dark" placeholder="From $2,000" />
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Features (one per line)</label>
                  <textarea {...register('features')} rows={5} className="input-dark resize-none font-mono text-xs" placeholder={"Logo Design\nBrand Guidelines\nColor Palette"} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Sort Order</label>
                    <input {...register('sort_order')} type="number" className="input-dark" defaultValue={0} />
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register('is_featured')} type="checkbox" className="w-4 h-4 accent-gold" />
                      <span className="text-cream/60 text-sm font-body">Featured Service</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary text-xs py-3 px-6 flex-1 justify-center">
                    <Save size={14} />
                    {modal === 'create' ? 'Create Service' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setModal(null)} className="btn-outline text-xs py-3 px-6">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
