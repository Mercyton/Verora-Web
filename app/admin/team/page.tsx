'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase';
import type { TeamMember } from '@/types/supabase';

export default function AdminTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, reset } = useForm();

  const fetchTeam = async () => {
    const { data } = await supabase.from('team_members').select('*').order('sort_order');
    setTeam(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTeam(); }, []);

  const openCreate = () => { reset(); setEditing(null); setModal('create'); };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    const socials = member.social_links as Record<string, string>;
    reset({
      ...member,
      instagram: socials?.instagram || '',
      linkedin: socials?.linkedin || '',
      twitter: socials?.twitter || '',
      website: socials?.website || '',
    });
    setModal('edit');
  };

  const onSubmit = async (data: any) => {
    const { instagram, linkedin, twitter, website, ...rest } = data;
    const payload = {
      ...rest,
      social_links: { instagram, linkedin, twitter, website },
      is_active: !!data.is_active,
      sort_order: parseInt(data.sort_order) || 0,
    };
    try {
      if (modal === 'create') {
        const { error } = await supabase.from('team_members').insert(payload);
        if (error) throw error;
        toast.success('Team member added!');
      } else if (editing) {
        const { error } = await supabase.from('team_members').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Team member updated!');
      }
      setModal(null);
      fetchTeam();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    toast.success('Team member removed.');
    fetchTeam();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-cream">Team Members</h1>
          <p className="text-cream/40 font-mono text-sm mt-1">{team.length} members</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs py-3 px-5">
          <Plus size={14} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex items-center gap-4 p-5 bg-ink-800 border border-cream/5 hover:border-cream/10 transition-all duration-200"
            >
              <div className="relative w-14 h-14 overflow-hidden flex-shrink-0">
                {member.avatar_url ? (
                  <Image src={member.avatar_url} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-display font-bold text-lg">{member.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-cream">{member.name}</p>
                <p className="text-gold text-xs font-mono">{member.role}</p>
                <p className={`text-[10px] font-mono mt-1 ${member.is_active ? 'text-green-400/60' : 'text-cream/20'}`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(member)} className="p-2 text-cream/40 hover:text-gold hover:bg-gold/10 transition-all">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteMember(member.id)} className="p-2 text-cream/40 hover:text-accent hover:bg-accent/10 transition-all">
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
              className="bg-ink-800 border border-cream/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-cream/5 sticky top-0 bg-ink-800">
                <h2 className="font-display text-lg font-semibold text-cream">
                  {modal === 'create' ? 'Add Team Member' : 'Edit Member'}
                </h2>
                <button onClick={() => setModal(null)} className="text-cream/40 hover:text-cream"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Name *</label>
                    <input {...register('name', { required: true })} className="input-dark" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Role *</label>
                    <input {...register('role', { required: true })} className="input-dark" placeholder="Creative Director" />
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Avatar URL</label>
                  <input {...register('avatar_url')} className="input-dark" placeholder="https://..." />
                </div>

                <div>
                  <label className="label text-[10px] mb-1.5 block">Bio</label>
                  <textarea {...register('bio')} rows={3} className="input-dark resize-none" placeholder="Short biography..." />
                </div>

                <div>
                  <label className="label text-[10px] mb-3 block">Social Links</label>
                  <div className="space-y-2">
                    {['instagram', 'linkedin', 'twitter', 'website'].map(platform => (
                      <div key={platform} className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-cream/30 w-16 capitalize">{platform}</span>
                        <input {...register(platform)} className="input-dark text-xs py-2" placeholder={`https://${platform}.com/...`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] mb-1.5 block">Sort Order</label>
                    <input {...register('sort_order')} type="number" className="input-dark" defaultValue={0} />
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register('is_active')} type="checkbox" className="w-4 h-4 accent-gold" defaultChecked />
                      <span className="text-cream/60 text-sm font-body">Active Member</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary text-xs py-3 px-6 flex-1 justify-center">
                    <Save size={14} />
                    {modal === 'create' ? 'Add Member' : 'Save Changes'}
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
