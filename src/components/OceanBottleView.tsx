import React, { useState } from 'react';
import { 
  Waves, 
  Compass, 
  MapPin, 
  Eye, 
  Sparkles, 
  ChevronRight, 
  Search, 
  Plus, 
  Anchor, 
  Clock, 
  Archive, 
  Shell,
  Briefcase
} from 'lucide-react';
import { DriftBottle, Letter } from '../types';
import { beachcombShore } from '../simulation/worldEngine';
import { playWaxSealThud } from '../utils/ambientAudio';

interface OceanBottleViewProps {
  bottles: DriftBottle[];
  onOpenLetter: (letter: Letter, bottle?: DriftBottle) => void;
  onOpenWriteModal: () => void;
  onRefreshBottles: () => void;
}

export const OceanBottleView: React.FC<OceanBottleViewProps> = ({
  bottles,
  onOpenLetter,
  onOpenWriteModal,
  onRefreshBottles,
}) => {
  const [beachcombNotification, setBeachcombNotification] = useState<{
    message: string;
    foundBottle?: DriftBottle;
    keepsakeName?: string;
  } | null>(null);
  const [isBeachcombing, setIsBeachcombing] = useState(false);

  // Filter bottles
  const driftingBottles = bottles.filter(b => b.status === 'drifting');
  const discoveredBottles = bottles.filter(b => b.status === 'discovered');
  const strandedBottles = bottles.filter(b => b.status === 'stranded');

  const handleWalkTheBeach = () => {
    setIsBeachcombing(true);
    setBeachcombNotification(null);

    setTimeout(() => {
      const result = beachcombShore();
      playWaxSealThud();
      setBeachcombNotification({
        message: result.message,
        foundBottle: result.bottle || undefined,
        keepsakeName: result.foundKeepsake,
      });
      setIsBeachcombing(false);
      onRefreshBottles();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: The Ocean & The Unknown */}
      <div className="bg-[#18232c] border border-[#2c404e] rounded-2xl p-4 sm:p-6 text-[#d6e7f0] paper-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-[#67e8f9] font-cinzel">
                The Global Shared Ocean
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-[#f0f9ff]">
              Messages Adrift in the Currents
            </h2>
            <p className="text-xs sm:text-sm text-[#9ec1d4] font-serif-vintage max-w-2xl leading-relaxed">
              When you cast a bottle into the sea, you forfeit all control. It is carried by the 
              Canary Current, the North Atlantic Gyre, or the Great Equatorial Drift. Months or years 
              later, a stranger walking the morning wrackline on a distant continent will pull the cork.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleWalkTheBeach}
              disabled={isBeachcombing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e3b4a] hover:bg-[#134e62] text-[#a5f3fc] text-sm font-serif-vintage font-bold border border-[#1b6b85] shadow-md disabled:opacity-50 transition-all active:scale-95"
            >
              <Search className={`w-4 h-4 ${isBeachcombing ? 'animate-spin' : ''}`} />
              <span>{isBeachcombing ? 'Searching the Tideline...' : 'Comb the Shore'}</span>
            </button>

            <button
              onClick={onOpenWriteModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white text-sm font-serif-vintage font-bold border border-[#38bdf8] shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Waves className="w-4 h-4" />
              <span>Cast a Bottle into the Sea</span>
            </button>
          </div>
        </div>

        {/* Beachcombing Alert Event Banner */}
        {beachcombNotification && (
          <div className="mt-5 p-4 rounded-xl bg-[#0d2a36] border border-[#1e5a70] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#154b5f] border border-[#2b82a0] text-[#67e8f9] flex items-center justify-center shrink-0">
                <Shell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-xs uppercase font-sans font-bold tracking-wider text-[#38bdf8] block">
                  Discovery in the Morning Surf
                </span>
                <p className="text-xs text-[#cce8f5] font-serif-vintage">
                  {beachcombNotification.message}
                </p>
                {beachcombNotification.keepsakeName && (
                  <span className="text-[11px] text-[#7dd3fc] font-serif-vintage italic mt-0.5 block">
                    Enclosed: {beachcombNotification.keepsakeName}
                  </span>
                )}
              </div>
            </div>

            {beachcombNotification.foundBottle && (
              <button
                onClick={() => onOpenLetter(beachcombNotification.foundBottle!.letter, beachcombNotification.foundBottle)}
                className="px-4 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-serif-vintage font-bold whitespace-nowrap shadow ml-auto"
              >
                Uncork & Read Scroll →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Ocean Swell & Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Ocean Currents Map & Active Bottles Adrift */}
        <div className="lg:col-span-7 bg-[#141d24] border border-[#243745] rounded-2xl p-4 sm:p-6 text-[#d6e7f0] paper-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#213442] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#06b6d4]" />
                <h3 className="font-cinzel text-base font-bold text-[#f0f9ff]">
                  Global Ocean Currents & Gyre Drift
                </h3>
              </div>
              <span className="text-xs text-[#7c9fb3] font-serif-vintage italic">
                Simulated Drift Mechanics
              </span>
            </div>

            {/* Stylized Ocean Canvas Representation */}
            <div className="relative w-full h-[320px] sm:h-[380px] bg-[#0c161d] rounded-xl border border-[#1e3444] overflow-hidden paper-shadow-deep">
              
              {/* Bathymetric depth contours */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(#38bdf8 0.75px, transparent 0.75px), linear-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.08) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Dynamic Ocean Current Streamlines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                {/* Gulf Stream current arc */}
                <path
                  d="M 20,240 Q 140,210 240,150 T 460,90 T 680,60"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeDasharray="6 8"
                />
                {/* Canary Current south loop */}
                <path
                  d="M 460,90 Q 520,180 440,260 T 260,290"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="5 7"
                />
                {/* North Pacific Gyre clockwise circle */}
                <path
                  d="M 100,100 Q 200,60 220,140 T 140,200 T 80,140 Z"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  opacity="0.4"
                />
                {/* Antarctic Circumpolar Current */}
                <path
                  d="M -20,340 Q 180,330 380,350 T 740,340"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="8 10"
                />
                <text x="320" y="110" fill="#38bdf8" fontSize="10" fontFamily="serif" opacity="0.6">
                  Gulf Stream & North Atlantic Drift (2.4 kn)
                </text>
                <text x="360" y="270" fill="#06b6d4" fontSize="10" fontFamily="serif" opacity="0.6">
                  Equatorial Trade Winds Loop
                </text>
              </svg>

              {/* Floating Bottles on Map */}
              {bottles.map((bottle) => {
                const isDiscovered = bottle.status === 'discovered';
                const isStranded = bottle.status === 'stranded';

                return (
                  <div
                    key={bottle.id}
                    onClick={() => onOpenLetter(bottle.letter, bottle)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                    style={{
                      left: `${bottle.currentCoords.x}%`,
                      top: `${bottle.currentCoords.y}%`,
                    }}
                    title={`Bottle: ${bottle.letter.title || 'Adrift'} · ${bottle.daysAdrift} days adrift`}
                  >
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                        isDiscovered 
                          ? 'bg-[#10b981] text-[#064e3b] border-2 border-white' 
                          : isStranded 
                          ? 'bg-[#f59e0b] text-[#78350f] border-2 border-white animate-pulse' 
                          : 'bg-[#06b6d4] text-[#083344] border-2 border-[#a5f3fc] animate-bounce'
                      }`}
                    >
                      <Waves className="w-3.5 h-3.5" />
                    </div>

                    <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#0c1821] border border-[#2b4b60] px-2 py-1 rounded text-[10px] whitespace-nowrap text-[#d6e7f0] font-serif-vintage shadow-xl z-30">
                      {bottle.daysAdrift} days adrift · {bottle.currentOceanRegion}
                    </div>
                  </div>
                );
              })}

              {/* Ocean Legend */}
              <div className="absolute bottom-3 left-3 bg-[#0a141b]/80 backdrop-blur-sm border border-[#1f3747] px-2.5 py-1.5 rounded-lg text-[10px] font-serif-vintage text-[#8ba8b9] space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                  <span>Adrift in Gyre</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>Washed Ashore (Stranded)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Found by Beachcomber</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ocean Simulation Stats */}
          <div className="mt-4 pt-3 border-t border-[#1d303d] grid grid-cols-3 gap-2 text-center text-xs font-serif-vintage">
            <div className="p-2 rounded-lg bg-[#0e1921] border border-[#1e3444]">
              <span className="text-[10px] uppercase text-[#6ca4bf] block">Bottles Adrift</span>
              <span className="text-base font-bold text-[#67e8f9]">{driftingBottles.length}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0e1921] border border-[#1e3444]">
              <span className="text-[10px] uppercase text-[#6ca4bf] block">Washed on Rocks</span>
              <span className="text-base font-bold text-[#fcd34d]">{strandedBottles.length}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0e1921] border border-[#1e3444]">
              <span className="text-[10px] uppercase text-[#6ca4bf] block">Rescued by Seekers</span>
              <span className="text-base font-bold text-[#34d399]">{discoveredBottles.length}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Beachcomber's Cabinet & Adrift Log */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Found Bottles Cabinet */}
          <div className="bg-[#141d24] border border-[#243745] rounded-2xl p-4 sm:p-5 text-[#d6e7f0] paper-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-[#213442] pb-2.5">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="font-cinzel text-sm font-bold text-[#f0f9ff]">
                  Beachcomber's Cabinet ({discoveredBottles.length})
                </h3>
              </div>
              <span className="text-xs text-[#7ba2b8] font-serif-vintage">Rescued Scrolls</span>
            </div>

            {discoveredBottles.length === 0 ? (
              <div className="text-center py-6 text-xs font-serif-vintage text-[#7395a8] space-y-2">
                <p>No bottles discovered along your coast yet.</p>
                <button
                  onClick={handleWalkTheBeach}
                  className="px-3 py-1.5 rounded-lg bg-[#0d2e3b] text-[#67e8f9] hover:bg-[#124254] transition-colors"
                >
                  Walk the Tideline Now
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {discoveredBottles.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onOpenLetter(b.letter, b)}
                    className="p-3 rounded-xl bg-[#0f1922] hover:bg-[#152533] border border-[#203747] cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0d3444] border border-[#165670] text-[#38bdf8] flex items-center justify-center shrink-0">
                        <Waves className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#f0f9ff] group-hover:text-[#67e8f9] transition-colors">
                          {b.letter.title || 'Ocean Scroll'}
                        </div>
                        <div className="text-[11px] text-[#7fa3b7] font-serif-vintage">
                          {b.isAnonymous ? 'From an Anonymous Soul' : `From ${b.senderName}`} · {b.daysAdrift} days at sea
                        </div>
                        {b.discoveredBy && (
                          <div className="text-[10px] text-[#34d399] font-serif-vintage mt-0.5">
                            Recovered by {b.discoveredBy}
                            {b.discoveredByPosition ? ` (${b.discoveredByPosition})` : ''}
                          </div>
                        )}
                        {(b.targetIndustry || b.targetPosition) && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-[#38bdf8] font-mono">
                            <Briefcase className="w-2.5 h-2.5" />
                            <span>{b.targetPosition ? `${b.targetPosition} · ` : ''}{b.targetIndustry}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#52798f] group-hover:text-[#f0f9ff] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Your Bottles Adrift Tracker */}
          <div className="bg-[#141d24] border border-[#243745] rounded-2xl p-4 sm:p-5 text-[#d6e7f0] paper-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-[#213442] pb-2.5">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-[#06b6d4]" />
                <h3 className="font-cinzel text-sm font-bold text-[#f0f9ff]">
                  Your Messages Adrift ({driftingBottles.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {driftingBottles.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onOpenLetter(b.letter, b)}
                  className="p-3 rounded-xl bg-[#0f1922] border border-[#203747] text-xs hover:border-[#06b6d4] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#f0f9ff] font-serif-vintage">
                      {b.letter.title || 'Unsealed Drift Scroll'}
                    </span>
                    <span className="text-[10px] text-[#38bdf8] font-mono">
                      {b.nauticalMilesTravelled} nm
                    </span>
                  </div>
                  <p className="text-[#8cb1c4] text-[11px] font-serif-vintage italic">
                    Drifting in {b.currentOceanRegion} ({b.daysAdrift} days adrift)
                  </p>
                  {(b.targetIndustry || b.targetPosition) && (
                    <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0b2836] border border-[#0284c7]/40 text-[10px] text-[#38bdf8] font-mono">
                      <Briefcase className="w-2.5 h-2.5" />
                      <span>Targeting: {b.targetPosition ? `${b.targetPosition} · ` : ''}{b.targetIndustry}</span>
                    </div>
                  )}
                  {b.letter.keepsake && (
                    <div className="mt-1 text-[10px] text-[#67e8f9] font-serif-vintage">
                      ✦ Keepsake enclosed: {b.letter.keepsake.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
