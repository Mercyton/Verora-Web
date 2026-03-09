'use client';

const items = [
  'Brand Identity', '✦', 'Video Production', '✦', 'UI/UX Design', '✦',
  'Photography', '✦', 'Motion Graphics', '✦', 'Web Design', '✦',
  'Brand Identity', '✦', 'Video Production', '✦', 'UI/UX Design', '✦',
  'Photography', '✦', 'Motion Graphics', '✦', 'Web Design', '✦',
];

export default function MarqueeSection() {
  return (
    <div className="bg-gold py-5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`font-mono text-sm tracking-widest uppercase mx-6 ${
              item === '✦' ? 'text-ink/40 text-xs' : 'text-ink font-medium'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
