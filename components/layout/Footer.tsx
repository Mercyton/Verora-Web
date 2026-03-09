import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  Pages: [
    { label: 'Home', href: '/main' },
    { label: 'About', href: '/main/about' },
    { label: 'Services', href: '/main/services' },
    { label: 'Portfolio', href: '/main/portfolio' },
    { label: 'Contact', href: '/main/contact' },
  ],
  Services: [
    { label: 'Brand Identity', href: '/main/services' },
    { label: 'UI/UX Design', href: '/main/services' },
    { label: 'Video Production', href: '/main/services' },
    { label: 'Photography', href: '/main/services' },
    { label: 'Motion Graphics', href: '/main/services' },
  ],
};

const socials = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-cream/5 pt-20 pb-8">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/main" className="group flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border-2 border-gold flex items-center justify-center">
                <span className="font-display font-bold text-gold">V</span>
              </div>
              <span className="font-display font-bold text-cream text-xl tracking-wider">
                Verola<span className="text-gold">.</span>
              </span>
            </Link>
            <p className="body-md text-cream/50 max-w-xs leading-relaxed mb-8">
              A full-service creative agency crafting brands, films, and digital experiences that move people.
            </p>
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-cream/10 flex items-center justify-center text-cream/40 hover:border-gold/50 hover:text-gold transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="label text-gold mb-6">{title}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-cream/40 text-sm font-body hover:text-cream transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cream/30 text-xs font-mono">
            © {new Date().getFullYear()} Verola Studios. All rights reserved.
          </p>
          <p className="text-cream/20 text-xs font-mono">
            Crafted with precision & purpose
          </p>
        </div>
      </div>
    </footer>
  );
}
