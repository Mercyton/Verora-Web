import { createServerSupabaseClient } from '@/lib/supabase';
import ContactContent from './ContactContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact' };

export default async function ContactPage() {
  const supabase = createServerSupabaseClient();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('key', 'contact').single();
  return <ContactContent data={(settings?.value as any) || {}} />;
}
