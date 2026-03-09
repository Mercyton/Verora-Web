'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { fadeInLeft, fadeInRight } from '@/lib/animations';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Props {
  data: {
    email?: string;
    phone?: string;
    address?: string;
    social_links?: Record<string, string>;
  };
}

const socialIconMap: Record<string, React.ComponentType<any>> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

export default function ContactContent({ data }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, margin: '-60px' });
  const supabase = createClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || null,
        message: formData.message,
      });
      if (error) throw error;
      toast.success('Message sent! We\'ll be in touch within 24 hours.');
      reset();
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-ink">
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
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="heading-xl text-cream max-w-4xl mb-6"
          >
            Let's Start a<br />
            <span className="text-gradient">Conversation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="body-lg text-cream/50 max-w-xl"
          >
            Ready to work together? Tell us about your project and we'll get back to you within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Contact section */}
      <section className="section bg-ink-900" ref={formRef}>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Info sidebar */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="lg:col-span-2 space-y-10"
            >
              <div>
                <h2 className="heading-md text-cream mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {data.email && (
                    <a href={`mailto:${data.email}`} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 border border-cream/10 group-hover:border-gold/50 flex items-center justify-center text-gold/60 group-hover:text-gold flex-shrink-0 transition-all duration-300 mt-0.5">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-cream/30 mb-1">Email</p>
                        <p className="text-cream group-hover:text-gold transition-colors duration-300">{data.email}</p>
                      </div>
                    </a>
                  )}
                  {data.phone && (
                    <a href={`tel:${data.phone}`} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 border border-cream/10 group-hover:border-gold/50 flex items-center justify-center text-gold/60 group-hover:text-gold flex-shrink-0 transition-all duration-300 mt-0.5">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-cream/30 mb-1">Phone</p>
                        <p className="text-cream group-hover:text-gold transition-colors duration-300">{data.phone}</p>
                      </div>
                    </a>
                  )}
                  {data.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 border border-cream/10 flex items-center justify-center text-gold/60 flex-shrink-0 mt-0.5">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-cream/30 mb-1">Address</p>
                        <p className="text-cream">{data.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social links */}
              {data.social_links && Object.keys(data.social_links).length > 0 && (
                <div>
                  <p className="label mb-5">Follow Us</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(data.social_links).map(([platform, url]) => {
                      const Icon = socialIconMap[platform];
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-cream/10 hover:border-gold/50 text-cream/40 hover:text-gold text-xs font-mono uppercase tracking-wider transition-all duration-300"
                        >
                          {Icon && <Icon size={14} />}
                          {platform}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Availability note */}
              <div className="border border-gold/20 bg-gold/5 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Currently Available</span>
                </div>
                <p className="text-cream/50 text-sm">
                  We're accepting new projects. Typical response time: within 24 hours.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label text-[10px] mb-2 block">Your Name *</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      placeholder="John Doe"
                      className="input-dark"
                    />
                    {errors.name && <p className="text-accent text-xs mt-1 font-mono">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label text-[10px] mb-2 block">Email Address *</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                      })}
                      placeholder="john@company.com"
                      className="input-dark"
                    />
                    {errors.email && <p className="text-accent text-xs mt-1 font-mono">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] mb-2 block">Subject</label>
                  <input
                    {...register('subject')}
                    placeholder="Brand Identity Project"
                    className="input-dark"
                  />
                </div>

                <div>
                  <label className="label text-[10px] mb-2 block">Message *</label>
                  <textarea
                    {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Please add more detail (min 20 chars)' } })}
                    rows={7}
                    placeholder="Tell us about your project, timeline, and budget..."
                    className="input-dark resize-none"
                  />
                  {errors.message && <p className="text-accent text-xs mt-1 font-mono">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
