import React from 'react';
import { PigeonClothing } from '../types';
import { PIGEON_CLOTHING_OPTIONS } from '../simulation/constants';

interface PigeonVisualProps {
  attireId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const PigeonVisual: React.FC<PigeonVisualProps> = ({
  attireId = 'aviator_goggles',
  size = 'md',
  className = '',
  animated = false,
}) => {
  const clothing: PigeonClothing =
    PIGEON_CLOTHING_OPTIONS.find((c) => c.id === attireId) || PIGEON_CLOTHING_OPTIONS[0];

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-36 h-36',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${
        animated ? 'animate-bounce-subtle' : ''
      } ${className}`}
      title={`${clothing.name}: ${clothing.description}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible transition-all duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Iridescent neck sheen gradient */}
          <linearGradient id="pigeonSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>

          {/* Slate feather gradient */}
          <linearGradient id="pigeonBody" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="60%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Wing gradient */}
          <linearGradient id="pigeonWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* BASE PIGEON BODY                                         */}
        {/* ======================================================== */}

        {/* Tail Feathers */}
        <path
          d="M 66 65 L 94 76 C 96 77 94 81 91 80 L 64 73 Z"
          fill="#334155"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M 68 67 L 96 79 C 97 80 95 83 92 82 L 65 75 Z"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Perched Feet */}
        <path
          d="M 44 80 L 41 87 M 44 80 L 44 88 M 44 80 L 48 87"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 56 80 L 53 87 M 56 80 L 56 88 M 56 80 L 60 87"
          stroke="#e11d48"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Body & Breast */}
        <path
          d="M 32 38 C 24 46 22 62 30 73 C 36 81 54 82 66 74 C 74 68 76 56 70 46 C 64 38 56 36 48 35 Z"
          fill="url(#pigeonBody)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Head */}
        <circle cx="44" cy="30" r="14" fill="#64748b" stroke="#334155" strokeWidth="1.5" />

        {/* Neck Iridescence */}
        <path
          d="M 35 37 C 32 46 32 54 36 61 C 42 62 48 58 48 50 C 48 42 44 37 35 37 Z"
          fill="url(#pigeonSheen)"
        />

        {/* Beak & Cere (classic pigeon nostril bump) */}
        <path
          d="M 31 31 C 28 32 23 34 20 35 C 24 37 28 38 31 38 Z"
          fill="#fbbf24"
          stroke="#d97706"
          strokeWidth="1"
        />
        {/* Soft pale cere bump */}
        <ellipse cx="30" cy="32" rx="2.5" ry="1.8" fill="#f1f5f9" opacity="0.9" />

        {/* Eye */}
        <circle cx="41" cy="28" r="3.6" fill="#f97316" stroke="#c2410c" strokeWidth="0.8" />
        <circle cx="41" cy="28" r="1.8" fill="#0f172a" />
        <circle cx="40" cy="27" r="0.8" fill="#ffffff" />

        {/* Folded Wing */}
        <path
          d="M 44 46 C 41 53 44 65 52 70 C 62 76 77 74 84 66 C 85 64 80 58 72 52 C 64 46 51 44 44 46 Z"
          fill="url(#pigeonWing)"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
        {/* Wing feather covert bars */}
        <path d="M 52 54 Q 63 56 74 61" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <path d="M 50 61 Q 61 63 76 67" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* ======================================================== */}
        {/* DYNAMIC ATTIRE LAYER (CHANGES BASED ON OUTFIT SELECTED)  */}
        {/* ======================================================== */}

        {/* 1. Aviator Goggles & Cap */}
        {attireId === 'aviator_goggles' && (
          <g className="transition-all duration-300">
            {/* Leather Cap Crown */}
            <path
              d="M 33 28 C 34 18 45 16 56 22 C 58 27 57 32 54 35 C 50 35 40 33 33 28 Z"
              fill="#78350f"
              stroke="#451a03"
              strokeWidth="1.5"
            />
            {/* Ear Flap */}
            <path
              d="M 49 27 L 53 38 C 53 40 50 42 47 40 L 46 31 Z"
              fill="#92400e"
              stroke="#451a03"
              strokeWidth="1.2"
            />
            {/* Goggles Strap */}
            <path d="M 33 27 Q 45 23 57 28" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            {/* Brass Goggles Frame & Lens */}
            <circle cx="39" cy="27" r="4.8" fill="#38bdf8" stroke="#f59e0b" strokeWidth="1.8" />
            <circle cx="39" cy="27" r="3.2" fill="#0284c7" opacity="0.6" />
            <line x1="37" y1="25" x2="41" y2="29" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="49" cy="28" r="4.2" fill="#38bdf8" stroke="#f59e0b" strokeWidth="1.6" />
            <path d="M 43.5 27 L 45 27.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* 2. Woolen Amber Scarf */}
        {attireId === 'knitted_scarf' && (
          <g className="transition-all duration-300">
            {/* Scarf loop around neck */}
            <path
              d="M 32 39 C 30 46 33 50 48 48 C 55 47 55 42 51 38 C 45 37 38 37 32 39 Z"
              fill="#d97706"
              stroke="#92400e"
              strokeWidth="1.8"
            />
            {/* Knit ribs */}
            <line x1="36" y1="40" x2="37" y2="46" stroke="#b45309" strokeWidth="1.2" />
            <line x1="41" y1="39" x2="42" y2="47" stroke="#b45309" strokeWidth="1.2" />
            <line x1="46" y1="39" x2="47" y2="46" stroke="#b45309" strokeWidth="1.2" />
            {/* Hanging tails with fringes */}
            <path
              d="M 34 47 L 30 65 L 37 66 L 40 48 Z"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            <path
              d="M 38 47 L 37 61 L 43 62 L 44 47 Z"
              fill="#d97706"
              stroke="#92400e"
              strokeWidth="1.5"
            />
            {/* Fringes */}
            <path d="M 30 65 L 29 69 M 32 65 L 32 70 M 35 66 L 35 70 M 37 66 L 38 70" stroke="#92400e" strokeWidth="1.2" />
          </g>
        )}

        {/* 3. Leather Post Satchel */}
        {attireId === 'postal_satchel' && (
          <g className="transition-all duration-300">
            {/* Shoulder Strap */}
            <path
              d="M 37 41 Q 48 50 63 67"
              stroke="#542307"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Satchel Bag Body */}
            <rect
              x="52"
              y="53"
              width="20"
              height="16"
              rx="3"
              fill="#78350f"
              stroke="#451a03"
              strokeWidth="1.5"
            />
            {/* Satchel Flap */}
            <path
              d="M 52 53 L 62 61 L 72 53 Z"
              fill="#92400e"
              stroke="#451a03"
              strokeWidth="1.2"
            />
            {/* Brass Buckle */}
            <circle cx="62" cy="61" r="2.2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
          </g>
        )}

        {/* 4. Crimson Royal Cape */}
        {attireId === 'royal_cape' && (
          <g className="transition-all duration-300">
            {/* Gilded Brooch Clasp */}
            <circle cx="48" cy="40" r="3.2" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            <circle cx="48" cy="40" r="1.4" fill="#ef4444" />
            {/* Flowing Velvet Mantle */}
            <path
              d="M 48 41 C 53 43 65 47 77 56 C 85 64 88 74 81 77 C 72 73 65 67 56 59 C 48 52 46 45 48 41 Z"
              fill="#991b1b"
              stroke="#7f1d1d"
              strokeWidth="1.5"
            />
            {/* Gilded Gold Embroidered Hem */}
            <path
              d="M 77 56 C 85 64 88 74 81 77"
              stroke="#fbbf24"
              strokeWidth="2.2"
              strokeDasharray="3 2"
            />
          </g>
        )}

        {/* 5. Navy Sailor Neckerchief */}
        {attireId === 'sailor_collar' && (
          <g className="transition-all duration-300">
            {/* Back Flap Collar */}
            <path
              d="M 36 38 C 42 36 54 38 56 46 L 46 50 L 36 44 Z"
              fill="#1e3a8a"
              stroke="#172554"
              strokeWidth="1.5"
            />
            {/* White Marine Stripes */}
            <path d="M 38 41 Q 46 39 53 45" stroke="#ffffff" strokeWidth="1.2" fill="none" />
            {/* Sailor Knot & Front Tie */}
            <circle cx="37" cy="44" r="2.8" fill="#1e3a8a" stroke="#172554" strokeWidth="1" />
            <path
              d="M 37 45 L 34 54 L 38 53 L 41 46 Z"
              fill="#2563eb"
              stroke="#1e3a8a"
              strokeWidth="1"
            />
            <path
              d="M 37 45 L 39 55 L 43 53 L 40 45 Z"
              fill="#1d4ed8"
              stroke="#172554"
              strokeWidth="1"
            />
          </g>
        )}

        {/* 6. Botanical Laurel Wreath */}
        {attireId === 'laurel_wreath' && (
          <g className="transition-all duration-300">
            {/* Laurel Vines & Leaves circling the head */}
            <path
              d="M 32 26 Q 44 19 56 26"
              stroke="#065f46"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Individual Laurel Leaves */}
            <path d="M 34 23 Q 32 18 36 19 Q 38 23 34 23" fill="#10b981" stroke="#047857" strokeWidth="0.8" />
            <path d="M 40 20 Q 40 15 44 16 Q 44 20 40 20" fill="#34d399" stroke="#047857" strokeWidth="0.8" />
            <path d="M 47 20 Q 49 15 52 17 Q 50 21 47 20" fill="#10b981" stroke="#047857" strokeWidth="0.8" />
            <path d="M 53 23 Q 56 20 58 22 Q 56 26 53 23" fill="#34d399" stroke="#047857" strokeWidth="0.8" />
            {/* Golden Berries */}
            <circle cx="38" cy="22" r="1.4" fill="#fbbf24" />
            <circle cx="45" cy="19" r="1.4" fill="#fbbf24" />
            <circle cx="51" cy="22" r="1.4" fill="#fbbf24" />
          </g>
        )}

        {/* 7. Cozy Fair Isle Knit */}
        {attireId === 'cozy_sweater' && (
          <g className="transition-all duration-300">
            {/* Sweater Torso Wrapping */}
            <path
              d="M 34 40 C 30 48 30 62 38 72 C 48 76 60 74 66 67 C 62 55 54 44 48 40 Z"
              fill="#047857"
              stroke="#064e3b"
              strokeWidth="1.5"
            />
            {/* Ribbed Turtle Collar */}
            <path
              d="M 34 40 C 38 38 46 39 48 40 L 47 44 C 44 43 38 42 34 44 Z"
              fill="#065f46"
              stroke="#064e3b"
              strokeWidth="1.2"
            />
            {/* Fair Isle Geometric Zigzag Pattern */}
            <path
              d="M 33 49 L 36 46 L 39 49 L 42 46 L 45 49 L 48 46 L 51 49"
              stroke="#fef08a"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 34 56 L 37 53 L 40 56 L 43 53 L 46 56 L 49 53 L 53 56"
              stroke="#fed7aa"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Snowflake Dot Accents */}
            <circle cx="36" cy="62" r="1.2" fill="#ffffff" />
            <circle cx="42" cy="62" r="1.2" fill="#ffffff" />
            <circle cx="48" cy="62" r="1.2" fill="#ffffff" />
          </g>
        )}

        {/* 8. Compass Chest Harness */}
        {attireId === 'brass_compass' && (
          <g className="transition-all duration-300">
            {/* Leather Cross-Harness Straps */}
            <path d="M 35 39 Q 44 46 54 55" stroke="#92400e" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 47 38 Q 42 46 36 56" stroke="#92400e" strokeWidth="2.4" strokeLinecap="round" />
            {/* Gimbaled Brass Compass Casing */}
            <circle cx="42" cy="48" r="6.5" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="42" cy="48" r="4.8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
            {/* Compass Dial Cardinal Marks */}
            <line x1="42" y1="44.5" x2="42" y2="46" stroke="#fef08a" strokeWidth="1" />
            <line x1="42" y1="50" x2="42" y2="51.5" stroke="#fef08a" strokeWidth="1" />
            <line x1="38.5" y1="48" x2="40" y2="48" stroke="#fef08a" strokeWidth="1" />
            <line x1="44" y1="48" x2="45.5" y2="48" stroke="#fef08a" strokeWidth="1" />
            {/* Magnetic North Needle */}
            <polygon points="42,44.5 43.5,48 40.5,48" fill="#ef4444" />
            <polygon points="42,51.5 43.5,48 40.5,48" fill="#94a3b8" />
            <circle cx="42" cy="48" r="1" fill="#fbbf24" />
          </g>
        )}

        {/* 9. Natural Plumage */}
        {attireId === 'natural_plumage' && (
          <g className="transition-all duration-300">
            {/* Glowing Gorget Plumage Sheen */}
            <ellipse cx="38" cy="48" rx="5" ry="9" fill="url(#pigeonSheen)" opacity="0.9" />
            {/* Delicate iridescent plume details */}
            <path d="M 36 43 Q 40 45 42 48" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M 36 49 Q 40 51 41 54" stroke="#c084fc" strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
};
