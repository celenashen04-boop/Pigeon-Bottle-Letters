import React, { useState } from 'react';
import { 
  X, 
  Feather, 
  Waves, 
  Stamp, 
  Sparkles, 
  Languages, 
  Reply, 
  Compass, 
  Check, 
  Loader2,
  Calendar,
  MapPin,
  Heart
} from 'lucide-react';
import { Letter, PostalStamp, StampReaction, DriftBottle, PigeonFlight } from '../types';
import { POSTAL_STAMPS } from '../simulation/constants';
import { playWaxSealThud } from '../utils/ambientAudio';

interface LetterReaderModalProps {
  letter: Letter | null;
  onClose: () => void;
  onReply: (letter: Letter) => void;
  onAddReaction: (letterId: string, reaction: StampReaction) => void;
  flightContext?: PigeonFlight;
  bottleContext?: DriftBottle;
}

export const LetterReaderModal: React.FC<LetterReaderModalProps> = ({
  letter,
  onClose,
  onReply,
  onAddReaction,
  flightContext,
  bottleContext,
}) => {
  const [selectedStampForReaction, setSelectedStampForReaction] = useState<PostalStamp | null>(null);
  const [reactionNote, setReactionNote] = useState('');
  const [showStampPicker, setShowStampPicker] = useState(false);

  // AI states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [journeyChronicle, setJourneyChronicle] = useState<{ title: string; story: string; milestones: string[] } | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState('French');

  if (!letter) return null;

  const handleApplyReaction = () => {
    if (!selectedStampForReaction) return;
    playWaxSealThud();
    const reaction: StampReaction = {
      id: `rx-${Date.now()}`,
      stampId: selectedStampForReaction.id,
      stampName: selectedStampForReaction.name,
      addedBy: 'You',
      addedAt: 'Just now',
      note: reactionNote.trim() || undefined,
    };
    onAddReaction(letter.id, reaction);
    setSelectedStampForReaction(null);
    setReactionNote('');
    setShowStampPicker(false);
  };

  // AI Journey Story Generator
  const handleGenerateJourneyStory = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/journey-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: letter.deliveryMode,
          origin: flightContext?.originName || bottleContext?.originCoast || "Coastal Haven",
          destination: flightContext?.destinationName || bottleContext?.discoveredLocation || "This Shore",
          daysPassed: flightContext?.actualDurationDays || bottleContext?.daysAdrift || 24,
          weatherHistory: flightContext?.weatherHistory || bottleContext?.journalEntries || [],
          status: 'delivered',
        }),
      });
      const data = await res.json();
      setJourneyChronicle(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Translation
  const handleTranslatePoetically = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterContent: letter.content,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data.translatedLetter) {
        setTranslatedContent(data.translatedLetter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Font family class helper
  const getFontClass = () => {
    switch (letter.fontStyle) {
      case 'cursive': return 'font-handwriting text-2xl leading-relaxed';
      case 'serif': return 'font-serif-vintage text-lg leading-relaxed';
      case 'typewriter': return 'font-typewriter text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#211a14] border border-[#4a3a2c] rounded-2xl max-w-3xl w-full p-4 sm:p-6 text-[#ded0bf] paper-shadow-deep relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3b2e23] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#362b21] border border-[#524131] flex items-center justify-center text-[#e0af68]">
              {letter.deliveryMode === 'pigeon' ? <Feather className="w-4 h-4" /> : <Waves className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#c8b29c]">
                  {letter.deliveryMode === 'pigeon' ? 'Carrier Pigeon Dispatch' : 'Ocean Drift Scroll'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#32271d] text-[#b39d88] border border-[#48382a]">
                  {letter.dateCreated}
                </span>
              </div>
              <p className="text-xs text-[#9d8975] font-serif-vintage">
                From {letter.author} {letter.recipientLocation ? `→ ${letter.recipientLocation}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9d8975] hover:text-[#f2e6d6] hover:bg-[#34281f] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Exploration Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-[#191410] px-3 py-2 rounded-xl border border-[#382b1f]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e0af68]" />
            <span className="text-xs font-serif-vintage text-[#d4c3b0]">Atmospheric AI Exploration:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isAiLoading}
              onClick={handleGenerateJourneyStory}
              className="text-xs px-2.5 py-1 rounded-md bg-[#2d2219] hover:bg-[#3b2d21] text-[#e0af68] border border-[#4f3d2f] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              {isAiLoading && !translatedContent ? <Loader2 className="w-3 h-3 animate-spin" /> : <Compass className="w-3 h-3" />}
              <span>Unfold Journey Story</span>
            </button>

            <div className="flex items-center gap-1">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-[#241c15] border border-[#453427] rounded text-[11px] px-1.5 py-1 text-[#d6c5b2]"
              >
                <option value="French">French</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
              </select>
              <button
                type="button"
                disabled={isAiLoading}
                onClick={handleTranslatePoetically}
                className="text-xs px-2.5 py-1 rounded-md bg-[#2d2219] hover:bg-[#3b2d21] text-[#93c5fd] border border-[#4f3d2f] disabled:opacity-50 flex items-center gap-1 transition-colors"
              >
                <Languages className="w-3 h-3" />
                <span>Translate</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Journey Chronicle Display */}
        {journeyChronicle && (
          <div className="mb-4 p-4 rounded-xl bg-[#1b1511] border border-[#4a392b] text-xs font-serif-vintage space-y-2">
            <div className="flex items-center justify-between border-b border-[#3b2d21] pb-2">
              <div className="flex items-center gap-2 text-[#e0af68] font-bold text-sm font-display">
                <Compass className="w-4 h-4" />
                <span>{journeyChronicle.title}</span>
              </div>
              <button
                onClick={() => setJourneyChronicle(null)}
                className="text-[#8d7967] hover:text-[#f0e4d4]"
              >
                ✕
              </button>
            </div>
            <p className="text-[#e2d5c5] leading-relaxed italic whitespace-pre-wrap">
              {journeyChronicle.story}
            </p>
            {journeyChronicle.milestones && journeyChronicle.milestones.length > 0 && (
              <div className="pt-2 border-t border-[#34271c] flex flex-wrap gap-2">
                {journeyChronicle.milestones.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#2a2018] text-[#c9b49f] text-[11px] border border-[#423326]">
                    ✦ {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* The Open Letter Canvas */}
        <div 
          className={`rounded-2xl p-6 sm:p-10 paper-shadow border relative overflow-hidden transition-all duration-300 ${
            letter.paperStyle === 'parchment' ? 'bg-parchment text-[#28211b] border-[#cfbea0]' :
            letter.paperStyle === 'tea-stained' ? 'bg-tea-stained text-[#261f18] border-[#c4b18f]' :
            letter.paperStyle === 'linen' ? 'bg-linen text-[#2d2620] border-[#d8cbbb]' :
            letter.paperStyle === 'midnight-vellum' ? 'bg-midnight-vellum text-[#e2e8f0] border-[#32394a]' :
            'bg-botanical-pressed text-[#252a20] border-[#c5d0ba]'
          }`}
        >
          {/* Top Header: Stamps & Keepsake badge */}
          <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4 mb-6">
            <div>
              {letter.title && (
                <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-1">
                  {letter.title}
                </h3>
              )}
              <div className="text-xs font-serif-vintage italic opacity-75">
                Penned by {letter.author}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Attached Keepsake badge if bottle letter */}
              {letter.keepsake && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/15 text-xs font-serif-vintage">
                  <span>✦ Enclosed:</span>
                  <span className="font-bold">{letter.keepsake.name}</span>
                </div>
              )}

              {/* Postal Stamps */}
              {letter.stamps?.map((st) => (
                <div 
                  key={st.id}
                  className="w-11 h-14 rounded border-2 border-dashed flex flex-col items-center justify-between p-1 text-[9px] font-mono shadow-sm"
                  style={{ backgroundColor: st.color + '22', borderColor: st.color }}
                  title={`${st.name} — "${st.quote}"`}
                >
                  <span className="font-bold">{st.denomination}</span>
                  <Stamp className="w-4 h-4 opacity-85" style={{ color: st.color }} />
                  <span className="text-[8px] uppercase tracking-tighter truncate w-full text-center">Post</span>
                </div>
              ))}
            </div>
          </div>

          {/* Letter Body */}
          <div 
            className={`whitespace-pre-wrap ${getFontClass()} my-4 min-h-[140px]`}
            style={{ color: letter.inkColor || '#292524' }}
          >
            {translatedContent || letter.content}
          </div>

          {translatedContent && (
            <div className="mt-4 pt-2 border-t border-black/10 text-xs italic font-serif-vintage flex items-center justify-between opacity-70">
              <span>Translated into {targetLang} with preserved emotional cadence</span>
              <button 
                onClick={() => setTranslatedContent(null)}
                className="underline hover:opacity-100"
              >
                Revert to Original
              </button>
            </div>
          )}

          {/* Attached Keepsake detail banner on mobile */}
          {letter.keepsake && (
            <div className="sm:hidden mt-4 p-2.5 rounded-lg bg-black/5 border border-black/10 text-xs font-serif-vintage">
              <span className="font-bold">✦ Enclosed Keepsake: {letter.keepsake.name}</span>
              <p className="opacity-75 italic text-[11px] mt-0.5">{letter.keepsake.lore}</p>
            </div>
          )}

          {/* Wax Seal Insignia & Letter Reactions */}
          <div className="mt-8 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
            
            {/* Margin Stamp Reactions */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-serif-vintage opacity-75">Stamps Affixed:</span>
              
              {letter.reactions && letter.reactions.length > 0 ? (
                letter.reactions.map((rx) => (
                  <div 
                    key={rx.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/5 border border-black/15 text-xs font-serif-vintage"
                    title={rx.note ? `Note: "${rx.note}"` : undefined}
                  >
                    <Stamp className="w-3.5 h-3.5 text-amber-700" />
                    <span>{rx.stampName}</span>
                    {rx.note && <span className="italic text-[10px] opacity-70">("{rx.note}")</span>}
                  </div>
                ))
              ) : (
                <span className="text-xs italic opacity-60 font-serif-vintage">No stamps affixed yet</span>
              )}

              {/* Add Stamp Reaction Button */}
              <button
                type="button"
                onClick={() => setShowStampPicker(!showStampPicker)}
                className="text-xs px-2.5 py-1 rounded-md bg-black/10 hover:bg-black/15 text-black/80 font-serif-vintage border border-black/15 flex items-center gap-1 transition-colors"
              >
                + Affix Stamp Reaction
              </button>
            </div>

            {/* Wax Seal Stamp */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-cinzel font-bold shadow-lg border-2 border-amber-100/30"
              style={{ backgroundColor: letter.sealColor || '#7c2d12' }}
              title="Wax seal unbroken upon arrival"
            >
              D
            </div>
          </div>
        </div>

        {/* Vintage Stamp Picker Popover */}
        {showStampPicker && (
          <div className="mt-4 p-4 rounded-xl bg-[#1b1511] border border-[#48372a] text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#36291f] pb-2">
              <span className="font-bold text-[#f5ebd7] font-serif-vintage">
                Select a Vintage Postal Stamp to React (Rather than an emoji):
              </span>
              <button
                onClick={() => setShowStampPicker(false)}
                className="text-[#8a7664] hover:text-[#e4d6c6]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POSTAL_STAMPS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStampForReaction(st)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedStampForReaction?.id === st.id
                      ? 'bg-[#3b2d22] border-[#d97706] text-[#fef9f3]'
                      : 'bg-[#231b15] border-[#382b20] text-[#a89582] hover:bg-[#2c221a]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#f5ebd7]">{st.name}</span>
                    <span className="font-mono text-[10px] text-[#ca8a04]">{st.denomination}</span>
                  </div>
                  <p className="text-[11px] italic font-serif-vintage line-clamp-1">{st.quote}</p>
                </button>
              ))}
            </div>

            {selectedStampForReaction && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a handwritten note with this stamp (optional)..."
                  value={reactionNote}
                  onChange={(e) => setReactionNote(e.target.value)}
                  className="flex-1 bg-[#241c16] border border-[#453527] rounded-lg px-3 py-1.5 text-xs text-[#f5ebd7] focus:outline-none"
                />
                <button
                  onClick={handleApplyReaction}
                  className="px-4 py-1.5 rounded-lg bg-[#8a3318] text-[#fef9f3] font-serif-vintage font-bold hover:bg-[#a33d1f]"
                >
                  Affix Seal
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3b2e23]">
          <div className="text-xs text-[#9d8975] font-serif-vintage">
            {letter.author === 'You'
              ? '📜 Rereading your own sent dispatch.'
              : letter.deliveryMode === 'pigeon' 
                ? '🕊️ Carrier pigeon arrived with safe passage. Reply enabled.' 
                : '🌊 Rescued from the salt ocean surf. Bottles adrift cannot receive direct replies.'}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#271f19] hover:bg-[#342921] text-xs font-serif-vintage text-[#c2b2a0]"
            >
              Close Letter
            </button>

            {/* Only pigeons from correspondents can receive replies */}
            {letter.deliveryMode === 'pigeon' && letter.author !== 'You' && (
              <button
                type="button"
                onClick={() => onReply(letter)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8a3318] hover:bg-[#a13c1d] text-[#fef9f3] text-sm font-serif-vintage font-bold shadow-md active:scale-95 transition-all"
              >
                <Reply className="w-4 h-4" />
                <span>Pen a Reply via Pigeon</span>
              </button>
            )}

            {letter.deliveryMode === 'bottle' && (
              <span className="text-xs text-[#6b7280] italic font-serif-vintage px-3 py-1.5 rounded-lg bg-[#192227] border border-[#2b3b44]">
                Replies disabled for bottles
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
