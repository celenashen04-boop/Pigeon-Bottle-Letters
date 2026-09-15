/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DeliveryMode, 
  Letter, 
  PigeonFlight, 
  DriftBottle, 
  LetterNotification,
  StampReaction, 
  WorldSeason 
} from './types';
import { 
  loadWorldSimulation, 
  saveWorldSimulation, 
  advanceWorldSimulation, 
  dispatchCarrierPigeon, 
  castBottleIntoOcean 
} from './simulation/worldEngine';
import { toggleProceduralOcean, setMasterVolume, playWaxSealThud } from './utils/ambientAudio';
import { DashboardMap } from './components/DashboardMap';
import { NotificationsFeed } from './components/NotificationsFeed';
import { WriteLetterModal } from './components/WriteLetterModal';
import { LetterReaderModal } from './components/LetterReaderModal';
import { 
  Feather, 
  Waves, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Compass, 
  CheckCircle, 
  Send, 
  Bell, 
  FastForward,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [isMuted, setIsMuted] = useState(true);

  // Simulation state
  const [pigeonFlights, setPigeonFlights] = useState<PigeonFlight[]>([]);
  const [bottles, setBottles] = useState<DriftBottle[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [notifications, setNotifications] = useState<LetterNotification[]>([]);
  const [currentSeason, setCurrentSeason] = useState<WorldSeason>({
    name: 'Early Autumn Mist',
    code: 'autumn',
    description: 'Equinoctial tailwinds across northern flyways, crisp sea swells.',
    windPattern: 'North-westerly moderate breeze with morning valley fog',
    seaCurrentSpeed: '1.8 knots south-eastward gyre',
    flywayCondition: 'Favorable tailwinds, migratory flocks gathering',
    skyColor: 'from-[#1e1712] via-[#241a13] to-[#120f0c]',
  });
  const [dayCount, setDayCount] = useState(38);

  // Modals state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [writeModalMode, setWriteModalMode] = useState<DeliveryMode>('pigeon');
  const [replyTargetLetter, setReplyTargetLetter] = useState<Letter | undefined>(undefined);

  const [selectedReadingLetter, setSelectedReadingLetter] = useState<Letter | null>(null);
  const [readingFlightContext, setReadingFlightContext] = useState<PigeonFlight | undefined>(undefined);
  const [readingBottleContext, setReadingBottleContext] = useState<DriftBottle | undefined>(undefined);

  // Ephemeral toast notification
  const [eventNotice, setEventNotice] = useState<string | null>(null);

  // Load initial simulation state on mount
  useEffect(() => {
    const sim = loadWorldSimulation();
    setPigeonFlights(sim.pigeonFlights);
    setBottles(sim.bottles);
    setLetters(sim.letters);
    setNotifications(sim.notifications || []);
    setCurrentSeason(sim.worldSeason);
    setDayCount(sim.dayCount);
  }, []);

  // Persist state to local storage
  const persistState = (
    flights: PigeonFlight[], 
    bList: DriftBottle[], 
    lList: Letter[], 
    notifs: LetterNotification[],
    season: WorldSeason, 
    days: number
  ) => {
    saveWorldSimulation({
      pigeonFlights: flights,
      bottles: bList,
      letters: lList,
      notifications: notifs,
      worldSeason: season,
      dayCount: days,
    });
  };

  // Toggle ambient procedural ocean audio
  const handleToggleSound = () => {
    const isPlaying = toggleProceduralOcean();
    setIsMuted(!isPlaying);
  };

  // Advance simulation by N days
  const handleAdvanceSimulation = (daysToAdvance: number = 1) => {
    const updated = advanceWorldSimulation(daysToAdvance);
    setPigeonFlights([...updated.pigeonFlights]);
    setBottles([...updated.bottles]);
    setLetters([...updated.letters]);
    setNotifications([...updated.notifications]);
    setCurrentSeason(updated.worldSeason);
    setDayCount(updated.dayCount);

    let message = `Advanced ${daysToAdvance} day${daysToAdvance > 1 ? 's' : ''} to Day ${updated.dayCount}. Winds and ocean swells have shifted.`;
    if (updated.arrivedPigeons.length > 0) {
      message = `🕊️ Day ${updated.dayCount}: Carrier pigeon "${updated.arrivedPigeons[0].pigeonName || 'Homer'}" completed its journey!`;
    } else if (updated.strandedBottles.length > 0) {
      message = `🌊 Day ${updated.dayCount}: An ocean drift bottle was discovered along the shores!`;
    }
    setEventNotice(message);
    setTimeout(() => setEventNotice(null), 5000);
  };

  // Open Writer
  const handleOpenWriteModal = (mode: DeliveryMode = 'pigeon', replyLetter?: Letter) => {
    setWriteModalMode(mode);
    setReplyTargetLetter(replyLetter);
    setIsWriteModalOpen(true);
  };

  // Open Reader (Reread previously written letter or incoming dispatch)
  const handleOpenLetter = (letter: Letter, flight?: PigeonFlight, bottle?: DriftBottle) => {
    // Mark letter as read
    const updatedLetters = letters.map(l => l.id === letter.id ? { ...l, isRead: true } : l);
    setLetters(updatedLetters);
    persistState(pigeonFlights, bottles, updatedLetters, notifications, currentSeason, dayCount);

    setSelectedReadingLetter({ ...letter, isRead: true });
    setReadingFlightContext(flight);
    setReadingBottleContext(bottle);
  };

  // Reply from reader
  const handleReplyFromReader = (letter: Letter) => {
    setSelectedReadingLetter(null);
    handleOpenWriteModal('pigeon', letter);
  };

  // Mark a notification as read
  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    persistState(pigeonFlights, bottles, letters, updated, currentSeason, dayCount);
  };

  // Add stamp reaction
  const handleAddReaction = (letterId: string, reaction: StampReaction) => {
    const updatedLetters = letters.map(l => {
      if (l.id === letterId) {
        return {
          ...l,
          reactions: [...(l.reactions || []), reaction],
        };
      }
      return l;
    });
    setLetters(updatedLetters);

    if (selectedReadingLetter && selectedReadingLetter.id === letterId) {
      setSelectedReadingLetter({
        ...selectedReadingLetter,
        reactions: [...(selectedReadingLetter.reactions || []), reaction],
      });
    }

    persistState(pigeonFlights, bottles, updatedLetters, notifications, currentSeason, dayCount);
  };

  // Send Pigeon with assigned name, clothes, and recipient position
  const handleSendPigeon = (
    newLetter: Letter, 
    recipient: string, 
    coords: { x: number; y: number }, 
    city: string,
    pigeonName?: string,
    pigeonClothes?: string,
    recipientCompany?: string,
    recipientPosition?: string
  ) => {
    const flight = dispatchCarrierPigeon(newLetter, recipient, coords, city, pigeonName, pigeonClothes, recipientCompany, recipientPosition);
    const updatedFlights = [flight, ...pigeonFlights];
    const updatedLetters = [newLetter, ...letters];

    setPigeonFlights(updatedFlights);
    setLetters(updatedLetters);
    persistState(updatedFlights, bottles, updatedLetters, notifications, currentSeason, dayCount);

    const posTag = recipientPosition ? ` (${recipientPosition})` : '';
    setEventNotice(`🕊️ Carrier pigeon "${flight.pigeonName || 'Homer'}" released toward ${recipient}${posTag} in ${city}. Flight path plotted on the map.`);
    setTimeout(() => setEventNotice(null), 5000);
  };

  // Cast Bottle into Ocean with glass color, wax seal, and targeted career fields
  const handleCastBottle = (
    newLetter: Letter, 
    isAnonymous: boolean,
    bottleColor?: string,
    waxSealColor?: string,
    waxSealInsignia?: string,
    targetIndustry?: string,
    targetPosition?: string
  ) => {
    const bottle = castBottleIntoOcean(newLetter, isAnonymous, bottleColor, waxSealColor, waxSealInsignia, targetIndustry, targetPosition);
    const updatedBottles = [bottle, ...bottles];
    const updatedLetters = [newLetter, ...letters];

    setBottles(updatedBottles);
    setLetters(updatedLetters);
    persistState(pigeonFlights, updatedBottles, updatedLetters, notifications, currentSeason, dayCount);

    const targetDesc = targetPosition 
      ? `targeting ${targetPosition} (${targetIndustry || 'specialized field'})`
      : (targetIndustry && targetIndustry !== 'Open to All Professions' ? `targeting ${targetIndustry}` : 'into open oceanic gyres');

    setEventNotice(`🌊 Drift bottle sealed and cast ${targetDesc}. Tracking buoy active on world chart.`);
    setTimeout(() => setEventNotice(null), 5500);
  };

  // -------------------------------------------------------------
  // STATS CALCULATIONS (# pigeons/bottles sent, # delivered)
  // -------------------------------------------------------------
  const mySentPigeons = pigeonFlights.filter(p => p.sender === 'You');
  const pigeonsSentCount = mySentPigeons.length;
  const pigeonsDeliveredCount = mySentPigeons.filter(p => p.status === 'delivered').length;

  const mySentBottles = bottles.filter(b => b.senderName === 'You' || b.letter?.author === 'You');
  const bottlesSentCount = mySentBottles.length;
  const bottlesDeliveredCount = mySentBottles.filter(b => b.status === 'discovered' || b.isTaken).length;

  return (
    <div className="min-h-screen bg-[#110d0a] text-[#ded0bf] flex flex-col selection:bg-[#7c2d12] selection:text-[#fef3c7]">
      
      {/* Toast Notification */}
      {eventNotice && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#231b15] border border-[#d97706] text-[#f5ebd7] p-3.5 rounded-xl shadow-2xl flex items-start gap-3 animate-fadeIn">
          <div className="w-7 h-7 rounded-lg bg-[#3d2b1c] text-[#e0af68] flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs font-serif-vintage leading-relaxed">
            {eventNotice}
          </div>
          <button
            onClick={() => setEventNotice(null)}
            className="text-[#8e7a68] hover:text-[#f5ebd7] text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* ============================================================ */}
        {/* 1. OVERVIEW OF APP AT THE TOP                                */}
        {/* ============================================================ */}
        <section className="bg-[#1c1511] border border-[#3b2d22] rounded-2xl p-5 sm:p-7 text-[#ded0bf] paper-shadow relative overflow-hidden">
          {/* Subtle vintage texture overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#e0af68 0.75px, transparent 0.75px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🕊️</span>
                <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-widest text-[#f5ebd7]">
                  DRIFT
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#342419] text-[#e0af68] font-mono border border-[#523b2b]">
                  Slow Epistolary Sanctuary
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#d1c1af] font-serif-vintage leading-relaxed">
                A messaging platform built around <strong className="text-[#fef3c7] font-normal">uncertainty, slowness, and serendipity</strong>. 
                Unlike modern apps that guarantee immediate delivery and demand read receipts, Drift embraces the unknown. 
                Pigeons navigate wind, weather, and distance without typing indicators. Ocean bottles float across global currents 
                until discovered by a stranger.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#9d8a78] font-serif-vintage pt-1">
                <span>✦ No Read Receipts</span>
                <span>✦ No Online Status</span>
                <span>✦ No Instant Gratification</span>
                <span>✦ Authentic Anticipation</span>
              </div>
            </div>

            {/* World Cycle & Simulation Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0 bg-[#140f0c]/80 p-3.5 rounded-xl border border-[#302319]">
              <div className="text-left sm:text-right">
                <div className="flex items-center gap-1.5 text-xs font-cinzel text-[#e0af68] justify-start sm:justify-end">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>World Cycle · Day {dayCount}</span>
                </div>
                <div className="text-[11px] text-[#8e7a68] font-serif-vintage mt-0.5">
                  Season: <span className="text-[#d8c7b5]">{currentSeason.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Toggle */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 font-serif-vintage transition-colors ${
                    !isMuted 
                      ? 'bg-[#293d4a] border-[#38bdf8] text-[#38bdf8]' 
                      : 'bg-[#211913] border-[#382b20] text-[#8e7a68] hover:text-[#d6c5b2]'
                  }`}
                  title={isMuted ? "Unmute ocean surf ambient sound" : "Mute ocean surf"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
                  <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Ocean Ambience'}</span>
                </button>

                {/* Advance Time Button */}
                <button
                  type="button"
                  onClick={() => handleAdvanceSimulation(1)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#302318] hover:bg-[#423122] text-[#f5ebd7] text-xs font-serif-vintage font-bold border border-[#523d2b] transition-colors active:scale-95"
                  title="Simulate 1 passing day in the world"
                >
                  <FastForward className="w-3.5 h-3.5 text-[#e0af68]" />
                  <span>Advance 1 Day</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. WRITE A NEW LETTER BUTTON ("Send Letter with Pigeon")     */}
        {/* ============================================================ */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#241a13] via-[#2c1d14] to-[#1a1410] border border-[#543b2a] rounded-2xl p-4 sm:p-5 shadow-lg">
          <div>
            <h3 className="font-cinzel text-base font-bold text-[#f5ebd7] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e0af68]" />
              <span>Entrust Words to the Wind & Waves</span>
            </h3>
            <p className="text-xs text-[#a3907e] font-serif-vintage mt-0.5">
              Choose your recipient, select customized pigeon flight clothes or tinted glass bottle with wax insignia.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Primary button: "Send Letter with Pigeon" */}
            <button
              type="button"
              onClick={() => handleOpenWriteModal('pigeon')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a3318] to-[#611e10] text-[#fef9f3] text-sm font-bold tracking-wide border border-[#b44828] shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4 text-[#fde68a]" />
              <span>Send Letter with Pigeon</span>
            </button>

            {/* Companion Bottle Button - increased to identical size as Send Letter with Pigeon */}
            <button
              type="button"
              onClick={() => handleOpenWriteModal('bottle')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0c2f45] to-[#071f2e] hover:from-[#103a55] hover:to-[#0a273b] text-[#f0f9ff] text-sm font-bold tracking-wide border border-[#38bdf8]/60 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Waves className="w-4 h-4 text-[#38bdf8]" />
              <span>Cast Ocean Bottle</span>
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. STATS COUNTERS: # pigeons/bottles sent, # delivered       */}
        {/* ============================================================ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Pigeons Sent */}
          <div className="bg-[#18130f] border border-[#382a1e] rounded-xl p-4 flex items-center gap-3.5 shadow">
            <div className="w-11 h-11 rounded-xl bg-[#36261a] border border-[#523c2a] flex items-center justify-center text-xl text-[#f59e0b] shrink-0">
              🕊️
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#9d8975] font-mono">
                Pigeons Sent
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#f5ebd7]">
                {pigeonsSentCount}
              </div>
              <div className="text-[10px] text-[#7d6c5d] font-serif-vintage">
                Homing flights dispatched
              </div>
            </div>
          </div>

          {/* Pigeons Delivered */}
          <div className="bg-[#18130f] border border-[#382a1e] rounded-xl p-4 flex items-center gap-3.5 shadow">
            <div className="w-11 h-11 rounded-xl bg-[#064e3b]/80 border border-[#059669] flex items-center justify-center text-xl text-[#34d399] shrink-0">
              ✓
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#9d8975] font-mono">
                Pigeons Delivered
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#a7f3d0]">
                {pigeonsDeliveredCount}
              </div>
              <div className="text-[10px] text-[#7d6c5d] font-serif-vintage">
                Safely reached windowsill
              </div>
            </div>
          </div>

          {/* Bottles Sent */}
          <div className="bg-[#18130f] border border-[#382a1e] rounded-xl p-4 flex items-center gap-3.5 shadow">
            <div className="w-11 h-11 rounded-xl bg-[#0f2c38] border border-[#0284c7] flex items-center justify-center text-xl text-[#38bdf8] shrink-0">
              🍾
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#9d8975] font-mono">
                Bottles Sent
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#f5ebd7]">
                {bottlesSentCount}
              </div>
              <div className="text-[10px] text-[#7d6c5d] font-serif-vintage">
                Cast into ocean swells
              </div>
            </div>
          </div>

          {/* Bottles Delivered / Washed Up */}
          <div className="bg-[#18130f] border border-[#382a1e] rounded-xl p-4 flex items-center gap-3.5 shadow">
            <div className="w-11 h-11 rounded-xl bg-[#1e293b] border border-[#475569] flex items-center justify-center text-xl text-[#cbd5e1] shrink-0">
              🐚
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#9d8975] font-mono">
                Bottles Washed Up
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#bae6fd]">
                {bottlesDeliveredCount}
              </div>
              <div className="text-[10px] text-[#7d6c5d] font-serif-vintage">
                Retrieved & taken by souls
              </div>
            </div>
          </div>

        </section>

        {/* ============================================================ */}
        {/* 3. MAP (LAND AND SEA)                                        */}
        {/* ============================================================ */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#e0af68]" />
              <h2 className="font-cinzel text-lg font-bold text-[#f5ebd7]">
                Land & Sea Live Chart
              </h2>
            </div>
            <span className="text-xs text-[#a89582] font-serif-vintage italic">
              Click any pigeon or bottle to reread its parchment letter
            </span>
          </div>

          {/* Dedicated Map Component */}
          <DashboardMap
            pigeons={pigeonFlights}
            bottles={bottles}
            letters={letters}
            onOpenLetter={handleOpenLetter}
          />
        </section>

        {/* ============================================================ */}
        {/* 5. NOTIFICATIONS ON RECEIVED LETTERS, WASHED BOTTLES, ETC.   */}
        {/* ============================================================ */}
        <section className="space-y-2">
          <NotificationsFeed
            notifications={notifications}
            letters={letters}
            flights={pigeonFlights}
            bottles={bottles}
            onOpenLetter={handleOpenLetter}
            onReplyToPigeon={handleReplyFromReader}
            onMarkNotificationRead={handleMarkNotificationRead}
          />
        </section>

      </main>

      {/* Epistolary Aesthetic Footer */}
      <footer className="border-t border-[#292018] bg-[#0c0907] py-6 px-4 text-center text-xs text-[#7d6b5b] font-serif-vintage mt-10">
        <div className="max-w-xl mx-auto space-y-1.5">
          <p className="italic">
            “The weight of a message is measured by the wind it has weathered and the days spent waiting.”
          </p>
          <div className="text-[11px] text-[#5e5043]">
            Drift Epistolary Sanctuary · Day {dayCount} of the World Cycle
          </div>
        </div>
      </footer>

      {/* Compose Letter Modal */}
      <WriteLetterModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        defaultMode={writeModalMode}
        replyToLetter={replyTargetLetter}
        onSendPigeon={handleSendPigeon}
        onCastBottle={handleCastBottle}
      />

      {/* Read Letter Modal */}
      <LetterReaderModal
        letter={selectedReadingLetter}
        onClose={() => setSelectedReadingLetter(null)}
        onReply={handleReplyFromReader}
        onAddReaction={handleAddReaction}
        flightContext={readingFlightContext}
        bottleContext={readingBottleContext}
      />

    </div>
  );
}
