import React, { useState } from 'react';
import { 
  Compass, 
  Wind, 
  Waves, 
  Feather, 
  Eye, 
  MapPin, 
  CloudRain, 
  Sun, 
  Info,
  Globe
} from 'lucide-react';
import { PigeonFlight, DriftBottle, WorldSeason } from '../types';

interface WorldAtlasViewProps {
  flights: PigeonFlight[];
  bottles: DriftBottle[];
  currentSeason: WorldSeason;
}

interface AtlasHotspot {
  id: string;
  name: string;
  category: 'current' | 'flyway' | 'haven';
  coords: { x: number; y: number };
  description: string;
  lore: string;
}

const ATLAS_HOTSPOTS: AtlasHotspot[] = [
  {
    id: 'hs-gulf',
    name: 'North Atlantic Gyre & Gulf Stream',
    category: 'current',
    coords: { x: 40, y: 32 },
    description: 'A powerful clockwise conveyor of warm tropical waters flowing northeast toward Ireland and the Hebrides.',
    lore: 'Over 60% of bottles cast from North American shores eventually pass through these azure currents.',
  },
  {
    id: 'hs-canary',
    name: 'Canary Current & Trade Wind Flow',
    category: 'current',
    coords: { x: 42, y: 44 },
    description: 'Equatorward sweep passing Madeira and the Canary Isles into the vast Sargasso doldrums.',
    lore: 'Known by sailors as the "Slow Carousel of Forgotten Scrolls".',
  },
  {
    id: 'hs-kuroshio',
    name: 'Kuroshio "Black Tide" Current',
    category: 'current',
    coords: { x: 80, y: 36 },
    description: 'Swift, dark blue Pacific current racing past the Ryukyu arc toward Hokkaido.',
    lore: 'Carries bottles across the northern Pacific into the cold waters of Alaska and Mendocino.',
  },
  {
    id: 'hs-flyway-atlantic',
    name: 'East Atlantic Migratory Flyway',
    category: 'flyway',
    coords: { x: 48, y: 26 },
    description: 'Ancient bird highway connecting Scandinavian fjords, the Scottish Isles, and the Iberian Peninsula.',
    lore: 'Carrier pigeons use coastal river mouths and magnetic headlands along this route to hold their heading.',
  },
  {
    id: 'hs-flyway-pacific',
    name: 'Pacific Americas Coastal Flyway',
    category: 'flyway',
    coords: { x: 22, y: 42 },
    description: 'From foggy Alaskan spruce valleys down past California headlands to Chile.',
    lore: 'Favorable coastal sea breezes allow soaring flights over hundreds of miles without wing flapping.',
  },
  {
    id: 'hs-finisterre',
    name: 'Cape Finisterre "End of the Earth"',
    category: 'haven',
    coords: { x: 43, y: 34 },
    description: 'Rocky granite cliffs where pilgrims, lighthouse watchers, and beachcombers gather.',
    lore: 'A premier landfall where both carrier pigeons and ocean bottles frequently make safe arrival.',
  },
];

export const WorldAtlasView: React.FC<WorldAtlasViewProps> = ({
  flights,
  bottles,
  currentSeason,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<AtlasHotspot | null>(ATLAS_HOTSPOTS[0]);
  const [activeLayer, setActiveLayer] = useState<'all' | 'currents' | 'flyways'>('all');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#241c16] border border-[#4a392b] rounded-2xl p-4 sm:p-6 text-[#ded0bf] paper-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs uppercase tracking-widest text-[#a7f3d0] font-cinzel">
                Community Navigation Atlas
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-[#f5ebd7] mt-1">
              Global Winds, Flyways & Ocean Gyres
            </h2>
            <p className="text-xs sm:text-sm text-[#ab9885] font-serif-vintage max-w-2xl leading-relaxed mt-0.5">
              The world is not a network of instantaneous fiber cables. It is governed by solar warmth, 
              atmospheric pressure, planetary rotation, and bird wings. Trace the natural channels that carry 
              every letter across the globe.
            </p>
          </div>

          {/* Layer Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-[#17120e] p-1 rounded-xl border border-[#382a1f]">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage transition-colors ${
                activeLayer === 'all' ? 'bg-[#3b2d22] text-[#f5ebd7] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveLayer('currents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage transition-colors ${
                activeLayer === 'currents' ? 'bg-[#153e4f] text-[#67e8f9] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Ocean Currents
            </button>
            <button
              onClick={() => setActiveLayer('flyways')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage transition-colors ${
                activeLayer === 'flyways' ? 'bg-[#452b17] text-[#fcd34d] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Bird Flyways
            </button>
          </div>
        </div>
      </div>

      {/* Atlas Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Master Nautical Chart */}
        <div className="lg:col-span-8 bg-[#1a1511] border border-[#3e3023] rounded-2xl p-4 sm:p-6 text-[#ded0bf] paper-shadow">
          <div className="flex items-center justify-between mb-3 border-b border-[#31251a] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#e0af68]" />
              <h3 className="font-cinzel text-base font-bold text-[#f5ebd7]">
                Nautical Chart & Flyway Meridian
              </h3>
            </div>
            <span className="text-xs text-[#8c7967] font-serif-vintage italic">
              Season: {currentSeason.name}
            </span>
          </div>

          {/* Stylized Vintage World Chart */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-[#221c16] rounded-xl border border-[#443527] overflow-hidden paper-shadow-deep">
            
            {/* Vintage Paper Texture & Coordinates Grid */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(#caa579 0.75px, transparent 0.75px), linear-gradient(rgba(202, 165, 121, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(202, 165, 121, 0.08) 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
              }}
            />

            {/* Continents Silhouettes & Streamlines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
              {/* Continents contour approximations */}
              {/* Europe & Africa */}
              <path
                d="M 380,60 Q 420,80 440,140 T 420,240 T 460,340 T 400,380 L 370,240 Z"
                fill="#16120e"
              />
              {/* Americas */}
              <path
                d="M 120,40 Q 180,80 200,160 T 160,220 T 220,320 T 180,420 L 100,240 Z"
                fill="#16120e"
              />
              {/* Asia */}
              <path
                d="M 520,60 Q 640,40 720,100 T 680,220 T 620,320 Z"
                fill="#16120e"
              />

              {/* Major Ocean Currents Streamlines */}
              {(activeLayer === 'all' || activeLayer === 'currents') && (
                <g>
                  {/* North Atlantic Gyre */}
                  <path
                    d="M 220,160 Q 320,120 400,100 T 440,180 T 360,240 T 260,220 Z"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                  />
                  {/* Canary Drift */}
                  <path
                    d="M 400,100 Q 440,160 410,230"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                  />
                  {/* Antarctic Circumpolar Current */}
                  <path
                    d="M 0,390 Q 240,380 480,400 T 800,385"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="8 10"
                  />
                </g>
              )}

              {/* Migratory Bird Flyways (Gold Streamlines) */}
              {(activeLayer === 'all' || activeLayer === 'flyways') && (
                <g>
                  <path
                    d="M 380,40 Q 420,120 400,220 T 390,320"
                    fill="none"
                    stroke="#ca8a04"
                    strokeWidth="2.5"
                    strokeDasharray="5 7"
                  />
                  <path
                    d="M 160,40 Q 180,140 170,240 T 190,360"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2"
                    strokeDasharray="5 7"
                  />
                </g>
              )}
            </svg>

            {/* Interactive Hotspots Rendered */}
            {ATLAS_HOTSPOTS.map((hs) => {
              if (activeLayer === 'currents' && hs.category !== 'current') return null;
              if (activeLayer === 'flyways' && hs.category !== 'flyway') return null;

              const isSelected = selectedHotspot?.id === hs.id;
              const color = hs.category === 'current' ? '#06b6d4' : hs.category === 'flyway' ? '#eab308' : '#10b981';

              return (
                <div
                  key={hs.id}
                  onClick={() => setSelectedHotspot(hs)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  style={{ left: `${hs.coords.x}%`, top: `${hs.coords.y}%` }}
                >
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xl transition-all ${
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {hs.category === 'current' ? <Waves className="w-3 h-3 text-black" /> : <Feather className="w-3 h-3 text-black" />}
                  </div>

                  <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#17120e] border border-[#48372a] px-2 py-0.5 rounded text-[10px] whitespace-nowrap text-[#ded0bf] font-serif-vintage shadow-md">
                    {hs.name}
                  </div>
                </div>
              );
            })}

            {/* Active Pigeons Markers in the Sky */}
            {flights.filter(f => f.status === 'in_flight').map((flight) => (
              <div
                key={flight.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-15"
                style={{
                  left: `${flight.originCoords.x + (flight.destCoords.x - flight.originCoords.x) * (flight.progressPercent / 100)}%`,
                  top: `${flight.originCoords.y + (flight.destCoords.y - flight.originCoords.y) * (flight.progressPercent / 100) - 4}%`,
                }}
                title={`Pigeon in flight: ${flight.recipient}`}
              >
                <div className="w-4 h-4 rounded-full bg-[#d97706] border border-white flex items-center justify-center shadow animate-pulse">
                  <Feather className="w-2.5 h-2.5 text-black" />
                </div>
              </div>
            ))}

            {/* Active Ocean Bottles Markers in the Waters */}
            {bottles.filter(b => b.status === 'drifting').map((b) => (
              <div
                key={b.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-15"
                style={{ left: `${b.currentCoords.x}%`, top: `${b.currentCoords.y}%` }}
                title={`Bottle drifting: ${b.daysAdrift} days`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#06b6d4] border border-white flex items-center justify-center shadow animate-ping" style={{ animationDuration: '3s' }} />
              </div>
            ))}

            {/* Legend at bottom left */}
            <div className="absolute bottom-3 left-3 bg-[#15110e]/85 backdrop-blur-sm border border-[#3b2d21] p-2 rounded-xl text-[10px] font-serif-vintage text-[#a89582] space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                <span>Ocean Gyres & Currents</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span>Migratory Bird Flyways</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span>Coastal Havens & Headlands</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Feature Dossier & Natural Laws */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Feature Dossier */}
          {selectedHotspot && (
            <div className="bg-[#1e1713] border border-[#453426] rounded-2xl p-4 sm:p-5 text-[#ded0bf] paper-shadow">
              <div className="flex items-center gap-2 mb-2 text-[#e0af68]">
                {selectedHotspot.category === 'current' ? <Waves className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
                <span className="text-xs uppercase tracking-wider font-cinzel font-bold">
                  {selectedHotspot.category.toUpperCase()} DOSSIER
                </span>
              </div>

              <h4 className="font-display font-bold text-lg text-[#f5ebd7] mb-2">
                {selectedHotspot.name}
              </h4>

              <p className="text-xs text-[#c9b7a4] font-serif-vintage leading-relaxed mb-3">
                {selectedHotspot.description}
              </p>

              <div className="p-3 rounded-xl bg-[#14100c] border border-[#34271c] text-xs font-serif-vintage italic text-[#caa579]">
                “{selectedHotspot.lore}”
              </div>
            </div>
          )}

          {/* Atmospheric Weather Dynamics in this Season */}
          <div className="bg-[#1e1713] border border-[#453426] rounded-2xl p-4 sm:p-5 text-[#ded0bf] paper-shadow">
            <div className="flex items-center gap-2 mb-3 border-b border-[#36271c] pb-2 text-[#ca8a04]">
              <Wind className="w-4 h-4" />
              <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#f5ebd7]">
                Active Seasonal Forces
              </h4>
            </div>

            <div className="space-y-3 text-xs font-serif-vintage">
              <div>
                <span className="font-bold text-[#e4d6c6] block">Seasonal Weather Phenomenon:</span>
                <p className="text-[#a99885] mt-0.5">{currentSeason.windPattern}</p>
              </div>

              <div>
                <span className="font-bold text-[#e4d6c6] block">Carrier Bird Navigation Index:</span>
                <p className="text-[#a99885] mt-0.5">{currentSeason.flywayCondition}</p>
              </div>

              <div>
                <span className="font-bold text-[#e4d6c6] block">Ocean Swell Velocity:</span>
                <p className="text-[#a99885] mt-0.5">{currentSeason.seaCurrentSpeed}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
