import React, { useState } from 'react';
import { 
  Compass, 
  Wind, 
  Waves, 
  MapPin, 
  Navigation,
  Eye,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { PigeonFlight, DriftBottle, Letter } from '../types';
import { PIGEON_CLOTHING_OPTIONS, WAX_INSIGNIAS, BOTTLE_GLASS_COLORS } from '../simulation/constants';
import { PigeonVisual } from './PigeonVisual';

interface DashboardMapProps {
  pigeons: PigeonFlight[];
  bottles: DriftBottle[];
  letters: Letter[];
  onOpenLetter: (letter: Letter, flight?: PigeonFlight, bottle?: DriftBottle) => void;
}

export const DashboardMap: React.FC<DashboardMapProps> = ({
  pigeons,
  bottles,
  letters,
  onOpenLetter,
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<{
    id: string;
    type: 'pigeon' | 'bottle';
    title: string;
    subtitle: string;
    detail: string;
    x: number;
    y: number;
    letter?: Letter;
    flight?: PigeonFlight;
    bottle?: DriftBottle;
  } | null>(null);

  // Filter only active bottles: when taken/discovered, the bottle disappears from the map!
  const activeFloatingBottles = bottles.filter(b => b.status !== 'discovered');

  // Sent pigeons (by you)
  const sentPigeons = pigeons.filter(p => p.sender === 'You');

  // Helper to find letter by ID
  const findLetter = (letterId: string): Letter | undefined => {
    return letters.find(l => l.id === letterId);
  };

  // Helper to get clothing details
  const getClothing = (id?: string) => {
    return PIGEON_CLOTHING_OPTIONS.find(c => c.id === id) || PIGEON_CLOTHING_OPTIONS[0];
  };

  // Helper to get wax seal insignia
  const getInsignia = (id?: string) => {
    return WAX_INSIGNIAS.find(w => w.id === id) || WAX_INSIGNIAS[0];
  };

  // Helper to calculate quadratic bezier control point for arched flight routes
  const getFlightPathArc = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    // Arch upward
    const midY = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.22 - 6;
    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  // Helper to get current pigeon position along quadratic curve
  const getPigeonPositionOnCurve = (x1: number, y1: number, x2: number, y2: number, progress: number) => {
    const t = Math.max(0, Math.min(1, progress / 100));
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.22 - 6;
    
    // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const curX = Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * midX + Math.pow(t, 2) * x2;
    const curY = Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * midY + Math.pow(t, 2) * y2;
    return { x: curX, y: curY };
  };

  const handleEntityClick = (entityLetter?: Letter, flight?: PigeonFlight, bottle?: DriftBottle) => {
    if (entityLetter) {
      onOpenLetter(entityLetter, flight, bottle);
    }
  };

  return (
    <div className="relative w-full bg-[#101920] border border-[#2d3d49] rounded-2xl overflow-hidden shadow-2xl">
      {/* Map Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 bg-[#132029] border-b border-[#223542] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#67e8f9] font-cinzel font-bold tracking-wider">
            <Compass className="w-4 h-4 text-[#38bdf8]" />
            <span>GLOBAL SEA & FLIGHT MAP</span>
          </div>
          <span className="hidden sm:inline-block text-[#527184]">•</span>
          <span className="text-[#8baec2] font-serif-vintage hidden sm:inline-block">
            Tracking your homing pigeons & ocean drift bottles
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-serif-vintage text-[#8baec2]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#f59e0b] rounded"></span>
            <span className="text-[#fed7aa]">Pigeon Flight Path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse"></span>
            <span className="text-[#bae6fd]">Drifting Bottle</span>
          </div>
          <span className="text-[#4e6a7c] hidden md:inline">
            (Click any marker to reread written letter)
          </span>
        </div>
      </div>

      {/* Main Map Viewport (SVG Container) */}
      <div className="relative w-full h-[460px] sm:h-[560px] bg-[#0c151c] overflow-hidden select-none">
        
        {/* Ocean Graticule & Sounding Grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 0.75px, transparent 0.75px), linear-gradient(rgba(56, 189, 248, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.06) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* SVG Landmasses and Ocean Currents */}
        <svg 
          viewBox="0 0 1000 600" 
          className="absolute inset-0 w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Sea Pattern Gradient */}
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b171f" />
              <stop offset="50%" stopColor="#0f202b" />
              <stop offset="100%" stopColor="#091319" />
            </linearGradient>

            {/* Land Texture Gradient */}
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#241c14" />
              <stop offset="100%" stopColor="#1a140e" />
            </linearGradient>

            {/* Route Glow Filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sea Base */}
          <rect width="1000" height="600" fill="url(#seaGrad)" />

          {/* Ocean Currents & Wave Swells */}
          <g opacity="0.35" stroke="#1d4354" fill="none" strokeWidth="1.5">
            {/* North Atlantic Drift */}
            <path d="M 280,180 Q 420,130 520,110 T 580,210 T 470,290 T 340,260 Z" strokeDasharray="8 10" />
            {/* Mid Ocean Currents */}
            <path d="M 100,280 Q 240,260 400,290 T 700,270 T 950,290" strokeDasharray="12 14" />
            <path d="M 50,440 Q 300,420 550,450 T 980,430" strokeDasharray="14 16" />
            {/* Equatorial Swells */}
            <path d="M 380,340 C 460,370 520,380 580,350" strokeDasharray="6 8" />
          </g>

          {/* Landmasses (Detailed Continental Polygons) */}
          <g fill="url(#landGrad)" stroke="#4a3727" strokeWidth="2" opacity="0.92">
            {/* North America */}
            <path d="M 80,60 Q 140,40 220,50 Q 260,90 280,140 Q 250,170 270,220 Q 240,270 210,260 Q 180,230 150,250 Q 120,290 90,270 Q 70,210 100,160 Q 70,120 80,60 Z" />
            
            {/* Greenland / Iceland */}
            <path d="M 340,40 Q 390,30 410,70 Q 370,95 330,80 Z" />
            <path d="M 435,90 Q 460,85 465,105 Q 445,115 435,90 Z" />

            {/* South America */}
            <path d="M 220,300 Q 280,320 310,380 Q 320,460 270,520 Q 240,540 225,500 Q 210,430 200,370 Q 210,330 220,300 Z" />

            {/* Europe */}
            <path d="M 490,90 Q 560,70 600,110 Q 580,160 540,170 Q 510,190 480,180 Q 470,130 490,90 Z" />
            {/* British Isles */}
            <path d="M 470,110 Q 490,100 485,135 Q 465,140 470,110 Z" />

            {/* Africa */}
            <path d="M 490,210 Q 590,200 620,270 Q 640,360 580,450 Q 540,510 500,480 Q 460,400 470,300 Q 470,240 490,210 Z" />

            {/* Asia */}
            <path d="M 610,80 Q 740,60 880,110 Q 920,210 850,290 Q 770,310 710,240 Q 670,210 650,150 Q 600,130 610,80 Z" />

            {/* Indian Subcontinent */}
            <path d="M 680,240 Q 730,230 740,290 Q 710,350 680,300 Z" />

            {/* Australia / Oceania */}
            <path d="M 780,400 Q 890,380 910,460 Q 870,510 800,500 Q 760,460 780,400 Z" />
          </g>

          {/* Compass Rose Ornamentation */}
          <g transform="translate(130, 480)" opacity="0.4">
            <circle r="40" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="3 3" />
            <circle r="25" fill="none" stroke="#67e8f9" strokeWidth="1" />
            <path d="M 0,-40 L 6,-15 L 0,0 L -6,-15 Z" fill="#38bdf8" />
            <path d="M 0,40 L 6,15 L 0,0 L -6,15 Z" fill="#1d4ed8" />
            <path d="M 40,0 L 15,6 L 0,0 L 15,-6 Z" fill="#38bdf8" />
            <path d="M -40,0 L -15,6 L 0,0 L -15,-6 Z" fill="#1d4ed8" />
            <text x="0" y="-45" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="Cinzel">N</text>
            <text x="48" y="4" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="Cinzel">E</text>
            <text x="0" y="55" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="Cinzel">S</text>
            <text x="-48" y="4" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="Cinzel">W</text>
          </g>

          {/* Nautical Latitude/Longitude Labels */}
          <text x="15" y="150" fill="#3d5a6c" fontSize="9" fontFamily="monospace">60° N</text>
          <text x="15" y="300" fill="#3d5a6c" fontSize="9" fontFamily="monospace">0° EQUATOR</text>
          <text x="15" y="450" fill="#3d5a6c" fontSize="9" fontFamily="monospace">60° S</text>

          {/* ==================================================== */}
          {/* PIGEON FLIGHT ROUTES (Land to Land / Haven)          */}
          {/* ==================================================== */}
          {sentPigeons.map((pigeon) => {
            const letter = findLetter(pigeon.letterId);
            const clothing = getClothing(pigeon.pigeonClothes);
            
            // Map percentage coordinates (0-100) to SVG viewbox (1000x600)
            const originX = (pigeon.originCoords?.x ?? 48) * 10;
            const originY = (pigeon.originCoords?.y ?? 35) * 6;
            const destX = (pigeon.destinationCoords?.x ?? 55) * 10;
            const destY = (pigeon.destinationCoords?.y ?? 40) * 6;

            const pathD = getFlightPathArc(originX, originY, destX, destY);
            const currentPos = getPigeonPositionOnCurve(originX, originY, destX, destY, pigeon.progressPercent);

            const isSelected = selectedEntityId === pigeon.id;
            const isDelivered = pigeon.status === 'delivered';

            return (
              <g key={pigeon.id} className="cursor-pointer">
                {/* Dashed flight route line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isDelivered ? '#10b981' : '#f59e0b'}
                  strokeWidth="2.5"
                  strokeDasharray="6 8"
                  opacity={isDelivered ? 0.45 : 0.85}
                  filter="url(#routeGlow)"
                />

                {/* Sender Origin Marker (Your Loft) */}
                <circle
                  cx={originX}
                  cy={originY}
                  r="5"
                  fill="#78350f"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />

                {/* Recipient Destination Haven Marker */}
                <circle
                  cx={destX}
                  cy={destY}
                  r="5.5"
                  fill={isDelivered ? '#065f46' : '#831843'}
                  stroke={isDelivered ? '#34d399' : '#f472b6'}
                  strokeWidth="1.5"
                />
                
                {/* Destination Label - Shown on hover or selection */}
                {(isSelected || hoveredEntity?.id === pigeon.id) && (
                  <text
                    x={destX}
                    y={destY + 14}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="10"
                    fontFamily="sans-serif"
                    opacity="0.9"
                  >
                    {pigeon.destinationName}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* ==================================================== */}
        {/* INTERACTIVE MARKERS (HTML OVERLAY FOR CRISP HOVER) */}
        {/* ==================================================== */}

        {/* 1. SENT PIGEONS - Just the pigeon with custom skin; details on hover */}
        {sentPigeons.map((pigeon) => {
          const letter = findLetter(pigeon.letterId);
          const clothing = getClothing(pigeon.pigeonClothes);
          
          const originX = (pigeon.originCoords?.x ?? 48);
          const originY = (pigeon.originCoords?.y ?? 35);
          const destX = (pigeon.destinationCoords?.x ?? 55);
          const destY = (pigeon.destinationCoords?.y ?? 40);

          // Position in %
          const curPos = getPigeonPositionOnCurve(originX, originY, destX, destY, pigeon.progressPercent);
          const isDelivered = pigeon.status === 'delivered';
          const isSelected = selectedEntityId === pigeon.id;

          return (
            <div
              key={pigeon.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-transform duration-300"
              style={{ left: `${curPos.x}%`, top: `${curPos.y}%` }}
              onClick={() => {
                setSelectedEntityId(pigeon.id);
                handleEntityClick(letter, pigeon, undefined);
              }}
              onMouseEnter={() => {
                setHoveredEntity({
                  id: pigeon.id,
                  type: 'pigeon',
                  title: `🕊️ Pigeon "${pigeon.pigeonName || 'Homer'}"`,
                  subtitle: `Heading: ${pigeon.destinationName} (${pigeon.recipient})`,
                  detail: isDelivered 
                    ? `Delivered safely in ${pigeon.destinationName}. Click to reread written letter.`
                    : `Flying with ${clothing.name}. Day ${pigeon.currentDay} en route (${pigeon.progressPercent}%). Click to reread written letter.`,
                  x: curPos.x,
                  y: curPos.y,
                  letter,
                  flight: pigeon,
                });
              }}
              onMouseLeave={() => setHoveredEntity(null)}
            >
              {/* Animated Flight Ring */}
              {!isDelivered && (
                <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />
              )}

              {/* Pigeon with custom skin only */}
              <div 
                className={`relative flex items-center justify-center transition-transform duration-300 ${
                  isSelected ? 'scale-125 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]' : 'hover:scale-125'
                }`}
              >
                <PigeonVisual
                  attireId={pigeon.pigeonClothes}
                  size="sm"
                  animated={!isDelivered}
                />
              </div>
            </div>
          );
        })}

        {/* 2. SENT OCEAN BOTTLES - Bottle emoji only; details on hover */}
        {activeFloatingBottles.map((bottle) => {
          const letter = findLetter(bottle.letterId);
          const insignia = getInsignia(bottle.waxSealInsignia);
          const glassColor = bottle.bottleColor || '#14b8a6';
          
          const curX = bottle.currentCoords?.x ?? 50;
          const curY = bottle.currentCoords?.y ?? 50;
          const isSelected = selectedEntityId === bottle.id;

          return (
            <div
              key={bottle.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-transform duration-500"
              style={{ left: `${curX}%`, top: `${curY}%` }}
              onClick={() => {
                setSelectedEntityId(bottle.id);
                handleEntityClick(letter, undefined, bottle);
              }}
              onMouseEnter={() => {
                setHoveredEntity({
                  id: bottle.id,
                  type: 'bottle',
                  title: `🍾 Glass Drift Bottle (${insignia.name} Wax Seal)`,
                  subtitle: `Adrift: ${bottle.daysAdrift} days · ${bottle.nauticalMilesTravelled} nmi`,
                  detail: `Floating freely in ocean gyres without fixed route. When found by a stranger, it will disappear from this chart. Click to reread written letter.`,
                  x: curX,
                  y: curY,
                  letter,
                  bottle,
                });
              }}
              onMouseLeave={() => setHoveredEntity(null)}
            >
              {/* Oceanic Ripple */}
              <div 
                className="absolute -inset-2 rounded-full border opacity-40 animate-pulse pointer-events-none"
                style={{ borderColor: glassColor }}
              />

              {/* Bottle emoji only */}
              <div 
                className={`relative flex items-center justify-center text-2xl select-none transition-transform duration-300 ${
                  isSelected ? 'scale-125 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]' : 'hover:scale-125'
                }`}
              >
                <span className="inline-block filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] animate-bounce-subtle">
                  🍾
                </span>
              </div>
            </div>
          );
        })}

        {/* Hover / Tooltip Card */}
        {hoveredEntity && (
          <div 
            className="absolute z-30 pointer-events-none bg-[#19232b]/95 border border-[#3b5567] text-[#f1f5f9] p-3 rounded-xl shadow-2xl max-w-xs text-xs font-serif-vintage transition-all animate-fadeIn"
            style={{
              left: `${Math.min(78, Math.max(22, hoveredEntity.x))}%`,
              top: hoveredEntity.y > 60 ? `${hoveredEntity.y - 18}%` : `${hoveredEntity.y + 10}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-sm text-[#fed7aa] flex items-center gap-1.5 mb-1">
              <span>{hoveredEntity.title}</span>
            </div>
            <div className="text-[11px] text-[#93c5fd] font-sans font-medium mb-1.5">
              {hoveredEntity.subtitle}
            </div>
            <p className="text-[#cbd5e1] text-[11px] leading-relaxed mb-2">
              {hoveredEntity.detail}
            </p>
            <div className="pt-1.5 border-t border-[#314859] text-[10px] text-[#fde047] flex items-center gap-1 font-sans">
              <Eye className="w-3 h-3" />
              <span>Click marker to open letter parchment</span>
            </div>
          </div>
        )}

        {/* Empty State Banner if no items sent */}
        {sentPigeons.length === 0 && activeFloatingBottles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
            <div className="bg-[#142028]/85 backdrop-blur-sm border border-[#2e4758] rounded-2xl p-6 text-center max-w-md shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#1e3444] text-[#67e8f9] flex items-center justify-center mx-auto mb-3">
                <Wind className="w-6 h-6" />
              </div>
              <h4 className="font-cinzel text-base font-bold text-[#f1f5f9] mb-1">
                The Skies & Tides Await Dispatches
              </h4>
              <p className="text-xs text-[#94a3b8] font-serif-vintage leading-relaxed">
                Click "Send Letter with Pigeon" or cast an ocean bottle to begin tracking your dispatches across the world map.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Map Footer Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#0f1922] border-t border-[#20313e] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#718d9f] font-serif-vintage">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>
            Pigeons navigate via natural flyways toward their recipient. Bottles drift randomly on global tides until discovered and removed.
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans">
          <span>Active Pigeons: <strong className="text-[#fde68a]">{sentPigeons.length}</strong></span>
          <span>Bottles Adrift: <strong className="text-[#38bdf8]">{activeFloatingBottles.length}</strong></span>
        </div>
      </div>
    </div>
  );
};
