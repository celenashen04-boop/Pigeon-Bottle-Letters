import { PaperStyle } from '../types';

export function isDarkPaper(paper: PaperStyle | string): boolean {
  return paper === 'ocean-drift' || paper === 'midnight-vellum';
}

export function isLightColor(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return true;
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
  }
  return true;
}

/**
 * Returns an accessible, high-contrast ink color for a given paper surface.
 * Guarantees WCAG AAA (>= 7:1) contrast ratio on both dark and light paper surfaces.
 */
export function getAccessibleInk(paper: PaperStyle | string, currentInk?: string): string {
  const dark = isDarkPaper(paper);
  if (dark) {
    if (paper === 'ocean-drift') {
      return '#e0f2fe'; // Sky 100 on dark cyan (#0b1e2c) -> contrast > 12:1
    }
    return '#f8fafc'; // Slate 50 on midnight vellum (#191c24) -> contrast > 14:1
  } else {
    if (paper === 'sea-mist') {
      return '#0c2b3d'; // Deep Navy 950 on glacial white (#f0f8fb) -> contrast > 13:1
    }
    return '#1c1917'; // Deep Stone 900 on parchment/tea-stained/linen -> contrast > 12:1
  }
}

/**
 * Returns comprehensive styling classes for container, title, body, placeholder,
 * and borders for complete WCAG contrast accessibility across all paper surfaces.
 */
export function getPaperThemeClasses(paper: PaperStyle | string) {
  switch (paper) {
    case 'ocean-drift':
      return {
        isDark: true,
        container: 'bg-ocean-drift text-[#f0f9ff] border-[#1e4768] shadow-[0_4px_30px_rgba(2,132,199,0.25)]',
        title: 'text-[#f0f9ff] placeholder:text-sky-200/60 border-sky-300/30',
        body: 'text-[#e0f2fe] placeholder:text-sky-200/60',
        meta: 'text-[#bae6fd]',
        divider: 'border-white/20',
        badge: 'bg-white/10 border-white/20 text-[#e0f2fe]',
        ink: '#e0f2fe',
      };
    case 'midnight-vellum':
      return {
        isDark: true,
        container: 'bg-midnight-vellum text-[#f8fafc] border-[#3b4354] shadow-2xl',
        title: 'text-[#f8fafc] placeholder:text-slate-300/60 border-white/25',
        body: 'text-[#f8fafc] placeholder:text-slate-300/60',
        meta: 'text-[#cbd5e1]',
        divider: 'border-white/20',
        badge: 'bg-white/10 border-white/20 text-[#f8fafc]',
        ink: '#f8fafc',
      };
    case 'sea-mist':
      return {
        isDark: false,
        container: 'bg-sea-mist text-[#0c2b3d] border-[#93c5fd] shadow-[0_4px_25px_rgba(56,189,248,0.2)]',
        title: 'text-[#0c2b3d] placeholder:text-sky-900/60 border-sky-900/25',
        body: 'text-[#0c2b3d] placeholder:text-sky-900/60',
        meta: 'text-[#164e63]',
        divider: 'border-sky-950/15',
        badge: 'bg-sky-900/5 border-sky-900/15 text-[#0c2b3d]',
        ink: '#0c2b3d',
      };
    case 'tea-stained':
      return {
        isDark: false,
        container: 'bg-tea-stained text-[#1c1917] border-[#c4b18f] shadow-md',
        title: 'text-[#1c1917] placeholder:text-stone-700/70 border-stone-800/25',
        body: 'text-[#1c1917] placeholder:text-stone-700/70',
        meta: 'text-[#44403c]',
        divider: 'border-black/15',
        badge: 'bg-black/5 border-black/15 text-[#1c1917]',
        ink: '#1c1917',
      };
    case 'linen':
      return {
        isDark: false,
        container: 'bg-linen text-[#1c1917] border-[#d8cbbb] shadow-md',
        title: 'text-[#1c1917] placeholder:text-stone-700/70 border-stone-800/25',
        body: 'text-[#1c1917] placeholder:text-stone-700/70',
        meta: 'text-[#44403c]',
        divider: 'border-black/15',
        badge: 'bg-black/5 border-black/15 text-[#1c1917]',
        ink: '#1c1917',
      };
    case 'botanical-pressed':
      return {
        isDark: false,
        container: 'bg-botanical-pressed text-[#1c1917] border-[#c5d0ba] shadow-md',
        title: 'text-[#1c1917] placeholder:text-stone-700/70 border-stone-800/25',
        body: 'text-[#1c1917] placeholder:text-stone-700/70',
        meta: 'text-[#3f4538]',
        divider: 'border-black/15',
        badge: 'bg-black/5 border-black/15 text-[#1c1917]',
        ink: '#1c1917',
      };
    case 'parchment':
    default:
      return {
        isDark: false,
        container: 'bg-parchment text-[#1c1917] border-[#cfbea0] shadow-md',
        title: 'text-[#1c1917] placeholder:text-stone-700/70 border-stone-800/25',
        body: 'text-[#1c1917] placeholder:text-stone-700/70',
        meta: 'text-[#44403c]',
        divider: 'border-black/15',
        badge: 'bg-black/5 border-black/15 text-[#1c1917]',
        ink: '#1c1917',
      };
  }
}
