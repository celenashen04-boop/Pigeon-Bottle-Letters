import React, { useState } from 'react';
import { 
  Feather, 
  Waves, 
  Compass, 
  Archive, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Clock, 
  PenTool, 
  Wind,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { WorldSeason } from '../types';
import { toggleAmbientSound } from '../utils/ambientAudio';

interface HeaderNavProps {
  activeTab: 'pigeons' | 'bottles' | 'atlas' | 'archives' | 'chronicles';
  setActiveTab: (tab: 'pigeons' | 'bottles' | 'atlas' | 'archives' | 'chronicles') => void;
  onOpenWriteModal: (mode?: 'pigeon' | 'bottle') => void;
  currentSeason: WorldSeason;
  onAdvanceTime: (days: number) => void;
  deliveredPigeonsCount: number;
  strandedBottlesCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenWriteModal,
  currentSeason,
  onAdvanceTime,
  deliveredPigeonsCount,
  strandedBottlesCount,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);

  const handleAudioToggle = () => {
    const nextState = toggleAmbientSound();
    setIsAudioActive(nextState);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1f1b18]/95 backdrop-blur-md border-b border-[#3d332a] text-[#e8dfd3] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div 
            onClick={() => setActiveTab('pigeons')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#7c2d12] flex items-center justify-center text-[#f7f3e8] border border-[#a14322] shadow-inner group-hover:scale-105 transition-transform">
              <span className="font-cinzel text-lg font-bold tracking-widest">D</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel font-bold text-xl tracking-wider text-[#f5ebd7] group-hover:text-[#e0af68] transition-colors">
                  DRIFT
                </h1>
                <span className="text-[10px] uppercase font-sans tracking-widest px-2 py-0.5 rounded-full bg-[#362b22] text-[#d4b996] border border-[#4d3d30]">
                  Slow Mail
                </span>
              </div>
              <p className="text-xs text-[#a89582] italic font-serif-vintage hidden sm:block">
                Embracing the unknown, slowness & serendipity
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#141210]/80 p-1.5 rounded-xl border border-[#382e25]">
            <button
              onClick={() => setActiveTab('pigeons')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm transition-all relative ${
                activeTab === 'pigeons'
                  ? 'bg-[#3b2e24] text-[#fbf8f2] shadow-sm font-medium border border-[#5a4637]'
                  : 'text-[#a99885] hover:text-[#f0e6d8] hover:bg-[#26201a]'
              }`}
            >
              <Feather className="w-4 h-4 text-[#d97706]" />
              <span>Pigeon Post</span>
              {deliveredPigeonsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('bottles')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm transition-all relative ${
                activeTab === 'bottles'
                  ? 'bg-[#3b2e24] text-[#fbf8f2] shadow-sm font-medium border border-[#5a4637]'
                  : 'text-[#a99885] hover:text-[#f0e6d8] hover:bg-[#26201a]'
              }`}
            >
              <Waves className="w-4 h-4 text-[#06b6d4]" />
              <span>Bottle Mail</span>
              {strandedBottlesCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#0891b2] text-[10px] text-white rounded-full font-sans">
                  {strandedBottlesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('atlas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm transition-all ${
                activeTab === 'atlas'
                  ? 'bg-[#3b2e24] text-[#fbf8f2] shadow-sm font-medium border border-[#5a4637]'
                  : 'text-[#a99885] hover:text-[#f0e6d8] hover:bg-[#26201a]'
              }`}
            >
              <Compass className="w-4 h-4 text-[#10b981]" />
              <span>World Atlas</span>
            </button>

            <button
              onClick={() => setActiveTab('archives')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm transition-all ${
                activeTab === 'archives'
                  ? 'bg-[#3b2e24] text-[#fbf8f2] shadow-sm font-medium border border-[#5a4637]'
                  : 'text-[#a99885] hover:text-[#f0e6d8] hover:bg-[#26201a]'
              }`}
            >
              <Archive className="w-4 h-4 text-[#f59e0b]" />
              <span>Letterbox</span>
            </button>

            <button
              onClick={() => setActiveTab('chronicles')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm transition-all ${
                activeTab === 'chronicles'
                  ? 'bg-[#3b2e24] text-[#fbf8f2] shadow-sm font-medium border border-[#5a4637]'
                  : 'text-[#a99885] hover:text-[#f0e6d8] hover:bg-[#26201a]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#ec4899]" />
              <span>Chronicles</span>
            </button>
          </nav>

          {/* Right Controls: Ambient sound, Time Machine, Write Letter CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* World Season Badge */}
            <button
              onClick={() => setIsSeasonModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#27211b] border border-[#42362b] text-xs text-[#d1bfab] hover:border-[#635140] transition-colors"
              title="Click to view global seasonal conditions"
            >
              <Wind className="w-3.5 h-3.5 text-[#e0af68]" />
              <span className="font-serif-vintage truncate max-w-[120px]">
                {currentSeason.name}
              </span>
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={handleAudioToggle}
              className={`p-2 rounded-lg border transition-all ${
                isAudioActive 
                  ? 'bg-[#1e3a8a]/40 text-[#93c5fd] border-[#3b82f6]' 
                  : 'bg-[#27211b] text-[#9c8976] border-[#3d332a] hover:text-[#e4d6c4]'
              }`}
              title={isAudioActive ? "Mute Ocean Swell & Rain" : "Play Gentle Ocean & Rain Ambient Sound"}
            >
              {isAudioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Advance Simulation Time */}
            <div className="relative">
              <button
                onClick={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b241d] border border-[#48392e] text-xs font-serif-vintage text-[#decbb8] hover:bg-[#382f25] transition-colors"
                title="Advance world clock to simulate slow travel"
              >
                <Clock className="w-3.5 h-3.5 text-[#ca8a04]" />
                <span className="hidden sm:inline">Pass Time</span>
                <ChevronDown className="w-3 h-3 text-[#94816e]" />
              </button>

              {isTimeMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#231d17] border border-[#4f3e30] rounded-xl shadow-2xl py-1.5 z-50 text-xs"
                  onClick={() => setIsTimeMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-sans uppercase tracking-wider text-[#917d69] border-b border-[#382c21]">
                    Simulate Passage of Time
                  </div>
                  <button
                    onClick={() => onAdvanceTime(1)}
                    className="w-full text-left px-3 py-2 text-[#e4d7c7] hover:bg-[#342a20] flex items-center justify-between"
                  >
                    <span>Advance +1 Day</span>
                    <span className="text-[#887460] text-[10px]">Gentle glide</span>
                  </button>
                  <button
                    onClick={() => onAdvanceTime(7)}
                    className="w-full text-left px-3 py-2 text-[#e4d7c7] hover:bg-[#342a20] flex items-center justify-between"
                  >
                    <span>Advance +1 Week</span>
                    <span className="text-[#887460] text-[10px]">Pigeons travel</span>
                  </button>
                  <button
                    onClick={() => onAdvanceTime(30)}
                    className="w-full text-left px-3 py-2 text-[#e4d7c7] hover:bg-[#342a20] flex items-center justify-between"
                  >
                    <span>Advance +1 Month</span>
                    <span className="text-[#887460] text-[10px]">Ocean gyres shift</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action: Write Letter */}
            <button
              onClick={() => onOpenWriteModal()}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#8a3318] to-[#6d2511] text-[#fef9f3] text-sm font-serif-vintage tracking-wide border border-[#b44828] shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">Write Letter</span>
              <span className="sm:hidden">Write</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around gap-1 mt-2.5 pt-2 border-t border-[#362b21] text-xs">
          <button
            onClick={() => setActiveTab('pigeons')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'pigeons' ? 'text-[#f5ebd7] font-semibold bg-[#32271e]' : 'text-[#9c8976]'
            }`}
          >
            <Feather className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Pigeons</span>
          </button>
          <button
            onClick={() => setActiveTab('bottles')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'bottles' ? 'text-[#f5ebd7] font-semibold bg-[#32271e]' : 'text-[#9c8976]'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>Bottles</span>
          </button>
          <button
            onClick={() => setActiveTab('atlas')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'atlas' ? 'text-[#f5ebd7] font-semibold bg-[#32271e]' : 'text-[#9c8976]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Atlas</span>
          </button>
          <button
            onClick={() => setActiveTab('archives')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'archives' ? 'text-[#f5ebd7] font-semibold bg-[#32271e]' : 'text-[#9c8976]'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Letters</span>
          </button>
          <button
            onClick={() => setActiveTab('chronicles')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'chronicles' ? 'text-[#f5ebd7] font-semibold bg-[#32271e]' : 'text-[#9c8976]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#ec4899]" />
            <span>Stories</span>
          </button>
        </div>
      </div>

      {/* Global Season Lore Modal */}
      {isSeasonModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsSeasonModalOpen(false)}
        >
          <div 
            className="bg-[#241d17] border border-[#524132] rounded-2xl max-w-md w-full p-6 text-[#ded2c3] paper-shadow-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4 border-b border-[#3d3126] pb-3">
              <div className="p-2.5 rounded-xl bg-[#362b22] border border-[#564435] text-[#e0af68]">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a8937e]">Current Atmosphere</span>
                <h3 className="text-xl font-display font-bold text-[#f7f1e7]">{currentSeason.name}</h3>
              </div>
            </div>

            <div className="space-y-3.5 text-sm font-serif-vintage leading-relaxed">
              <div className="p-3 rounded-xl bg-[#1b1511] border border-[#382b20]">
                <span className="text-xs uppercase tracking-wider text-[#99836f] block mb-1">Carrier Pigeon Flyways</span>
                <p className="text-[#ebe1d5]">{currentSeason.flywayCondition}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#1b1511] border border-[#382b20]">
                <span className="text-xs uppercase tracking-wider text-[#99836f] block mb-1">Ocean Current Dynamics</span>
                <p className="text-[#ebe1d5]">{currentSeason.seaCurrentSpeed}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#1b1511] border border-[#382b20]">
                <span className="text-xs uppercase tracking-wider text-[#99836f] block mb-1">Prevailing Winds</span>
                <p className="text-[#ebe1d5]">{currentSeason.windPattern}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSeasonModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#3d3126] hover:bg-[#4d3e31] text-[#f2e9de] text-xs font-serif-vintage"
              >
                Close & Gaze at the Skies
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
