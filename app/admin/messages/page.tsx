'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase';
import type { ContactSubmission } from '@/types/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const supabase = createClient();

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id);
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, is_read: true } : msg));
    if (selected?.id === id) setSelected(s => s ? { ...s, is_read: true } : null);
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_submissions').delete().eq('id', id);
    setMessages(m => m.filter(msg => msg.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success('Message deleted.');
  };

  const openMessage = async (msg: ContactSubmission) => {
    setSelected(msg);
    if (!msg.is_read) await markRead(msg.id);
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-cream">Messages</h1>
          <p className="text-cream/40 font-mono text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All read'} · {messages.length} total
          </p>
        </div>
        <button onClick={fetchMessages} className="btn-ghost text-cream/40">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[600px]">
        {/* List */}
        <div className="md:col-span-2 bg-ink-800 border border-cream/5 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-cream/30 text-sm font-mono text-center p-10">No messages yet.</p>
          ) : (
            messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 border-b border-cream/5 hover:bg-ink-700 transition-colors duration-200 ${
                  selected?.id === msg.id ? 'bg-ink-700 border-l-2 border-l-gold' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.is_read
                    ? <MailOpen size={12} className="text-cream/20 mt-0.5 flex-shrink-0" />
                    : <Mail size={12} className="text-gold mt-0.5 flex-shrink-0" />
                  }
                  <div className="overflow-hidden">
                    <p className={`text-sm font-body truncate ${msg.is_read ? 'text-cream/50' : 'text-cream font-medium'}`}>
                      {msg.name}
                    </p>
                    <p className="text-cream/30 text-xs font-mono truncate">{msg.email}</p>
                    <p className="text-cream/40 text-xs truncate mt-1">{msg.subject || msg.message.slice(0, 40)}...</p>
                    <p className="text-cream/20 text-[10px] font-mono mt-1">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="md:col-span-3 bg-ink-800 border border-cream/5 overflow-y-auto">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-semibold text-cream">{selected.subject || 'No Subject'}</h2>
                  <p className="text-cream/50 text-sm font-mono mt-1">{selected.name} · {selected.email}</p>
                  <p className="text-cream/20 text-xs font-mono mt-0.5">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => deleteMessage(selected.id)} className="p-2 text-cream/30 hover:text-accent hover:bg-accent/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="border-t border-cream/5 pt-6">
                <p className="text-cream/70 font-body text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="mt-8">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Enquiry'}`}
                  className="btn-primary text-xs py-3 px-6"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <MailOpen size={32} className="text-cream/10 mb-3" />
              <p className="text-cream/20 font-mono text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
