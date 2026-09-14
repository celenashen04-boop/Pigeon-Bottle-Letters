import React, { useState } from 'react';
import { 
  X, 
  Feather, 
  Waves, 
  Sparkles, 
  Languages, 
  Stamp, 
  Check, 
  Palette, 
  BookOpen, 
  Send, 
  Eye,
  Loader2,
  HelpCircle,
  Dices,
  Shirt
} from 'lucide-react';
import { 
  DeliveryMode, 
  PaperStyle, 
  FontStyle, 
  Letter, 
  PigeonFlight, 
  DriftBottle, 
  UserContact, 
  KeepsakeItem, 
  PostalStamp 
} from '../types';
import { 
  POSTAL_STAMPS, 
  KEEPSAKES, 
  DEFAULT_CONTACTS,
  PIGEON_CLOTHING_OPTIONS,
  BOTTLE_GLASS_COLORS,
  WAX_INSIGNIAS,
  getRandomPigeonName
} from '../simulation/constants';
import { playWaxSealThud } from '../utils/ambientAudio';

interface WriteLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: DeliveryMode;
  replyToLetter?: Letter;
  onSendPigeon: (
    letter: Letter, 
    recipient: string, 
    recipientCoords: { x: number; y: number }, 
    city: string,
    pigeonName?: string,
    pigeonClothes?: string
  ) => void;
  onCastBottle: (
    letter: Letter, 
    isAnonymous: boolean,
    bottleColor?: string,
    waxSealColor?: string,
    waxSealInsignia?: string
  ) => void;
}

const SEAL_COLORS = [
  { name: 'Crimson Wine', hex: '#7c2d12' },
  { name: 'Deep Indigo', hex: '#1e3a8a' },
  { name: 'Forest Evergreen', hex: '#065f46' },
  { name: 'Imperial Plum', hex: '#701a75' },
  { name: 'Amber Bronze', hex: '#b45309' },
  { name: 'Obsidian Night', hex: '#1c1917' },
];

export const WriteLetterModal: React.FC<WriteLetterModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'pigeon',
  replyToLetter,
  onSendPigeon,
  onCastBottle,
}) => {
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(defaultMode);
  
  // Recipient state for Pigeon
  const [selectedContact, setSelectedContact] = useState<UserContact | null>(
    replyToLetter ? (DEFAULT_CONTACTS.find(c => c.name === replyToLetter.author) || null) : DEFAULT_CONTACTS[0]
  );
  const [customRecipientName, setCustomRecipientName] = useState(replyToLetter?.author || '');
  const [customRecipientCity, setCustomRecipientCity] = useState(replyToLetter?.recipientLocation || '');
  const [isCustomRecipient, setIsCustomRecipient] = useState(false);

  // Pigeon Customization
  const [pigeonName, setPigeonName] = useState(() => getRandomPigeonName());
  const [pigeonClothes, setPigeonClothes] = useState<string>('aviator_goggles');

  // Bottle Customization
  const [bottleColor, setBottleColor] = useState<string>('#14b8a6');
  const [waxSealInsignia, setWaxSealInsignia] = useState<string>('swallow');
  const [isAnonymousBottle, setIsAnonymousBottle] = useState(false);
  const [selectedKeepsake, setSelectedKeepsake] = useState<KeepsakeItem | null>(KEEPSAKES[0]);

  // Letter contents
  const [title, setTitle] = useState(replyToLetter ? `Reply to: ${replyToLetter.title}` : '');
  const [content, setContent] = useState('');
  
  // Stationery styling
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('tea-stained');
  const [fontStyle, setFontStyle] = useState<FontStyle>('cursive');
  const [sealColor, setSealColor] = useState('#7c2d12');
  const [inkColor, setInkColor] = useState('#292524');
  const [selectedStamps, setSelectedStamps] = useState<PostalStamp[]>([POSTAL_STAMPS[0]]);

  // AI states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('nostalgic & reflective');
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showTranslatePreview, setShowTranslatePreview] = useState(false);
  const [targetLang, setTargetLang] = useState('French');
  const [translatedText, setTranslatedText] = useState('');
  const [translationNotes, setTranslationNotes] = useState('');

  // Sealing animation state
  const [isSealing, setIsSealing] = useState(false);
  const [sealingStep, setSealingStep] = useState<'editing' | 'pouring_wax' | 'stamped' | 'dispatched'>('editing');

  if (!isOpen) return null;

  const handleRollPigeonName = () => {
    setPigeonName(getRandomPigeonName());
  };

  const selectedClothingObj = PIGEON_CLOTHING_OPTIONS.find(c => c.id === pigeonClothes) || PIGEON_CLOTHING_OPTIONS[0];
  const selectedInsigniaObj = WAX_INSIGNIAS.find(w => w.id === waxSealInsignia) || WAX_INSIGNIAS[0];
  const selectedGlassObj = BOTTLE_GLASS_COLORS.find(g => g.hex === bottleColor) || BOTTLE_GLASS_COLORS[0];

  // Toggle stamp selection (max 2)
  const handleToggleStamp = (stamp: PostalStamp) => {
    if (selectedStamps.some(s => s.id === stamp.id)) {
      setSelectedStamps(selectedStamps.filter(s => s.id !== stamp.id));
    } else {
      if (selectedStamps.length >= 2) {
        setSelectedStamps([selectedStamps[1], stamp]);
      } else {
        setSelectedStamps([...selectedStamps, stamp]);
      }
    }
  };

  // AI 1: Thoughtful Letter Scribe
  const handleGenerateLetterWithAi = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const recipientName = isCustomRecipient ? customRecipientName : (selectedContact?.name || "a dear friend");
      const res = await fetch('/api/ai/letter-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt.trim() || "A letter reflecting on passing clouds and forgotten afternoons",
          recipient: recipientName,
          tone: aiTone,
          currentDraft: content,
        }),
      });
      const data = await res.json();
      if (data.suggestedLetter) {
        setContent(data.suggestedLetter);
        if (!title && data.poeticExcerpt) {
          setTitle(data.poeticExcerpt.slice(0, 45));
        }
        if (data.stationeryAdvice && typeof data.stationeryAdvice === 'object') {
          if (data.stationeryAdvice.paperStyle) setPaperStyle(data.stationeryAdvice.paperStyle);
          if (data.stationeryAdvice.sealColor) setSealColor(data.stationeryAdvice.sealColor);
          if (data.stationeryAdvice.fontStyle) setFontStyle(data.stationeryAdvice.fontStyle);
        }
        setShowAiAssistant(false);
      } else if (data.error) {
        setAiError(typeof data.error === 'string' ? data.error : "Failed to compose letter.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to reach letter assistant.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI 2: Poetic Formatting & Stationery Styler
  const handleSuggestStationeryWithAi = async () => {
    if (!content.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/poetic-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterContent: content }),
      });
      const data = await res.json();
      if (data.formattedLetter) {
        setContent(data.formattedLetter);
      }
      if (data.stationery) {
        if (data.stationery.paperStyle) setPaperStyle(data.stationery.paperStyle);
        if (data.stationery.fontStyle) setFontStyle(data.stationery.fontStyle);
        if (data.stationery.sealColor) setSealColor(data.stationery.sealColor);
        if (data.stationery.inkColor) setInkColor(data.stationery.inkColor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI 3: Poetic Translation
  const handleTranslateWithAi = async () => {
    if (!content.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterContent: content,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data.translatedLetter) {
        setTranslatedText(data.translatedLetter);
        setTranslationNotes(data.poeticNotes || '');
        setShowTranslatePreview(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Dispatch Ceremony
  const handleDispatch = () => {
    if (!content.trim()) return;

    setIsSealing(true);
    setSealingStep('pouring_wax');

    setTimeout(() => {
      setSealingStep('stamped');
      playWaxSealThud();

      setTimeout(() => {
        setSealingStep('dispatched');

        const newLetter: Letter = {
          id: `letter-${Date.now()}`,
          title: title.trim() || (deliveryMode === 'pigeon' ? 'Folded Dispatch' : 'Drift Scroll'),
          content: content.trim(),
          author: deliveryMode === 'bottle' && isAnonymousBottle ? 'An Anonymous Soul' : 'You',
          recipient: deliveryMode === 'pigeon' 
            ? (isCustomRecipient ? customRecipientName : selectedContact?.name || 'A Faraway Pen-Pal')
            : 'To Whomever Finds This Shore',
          recipientLocation: deliveryMode === 'pigeon'
            ? (isCustomRecipient ? customRecipientCity : selectedContact?.city || 'A Distant Haven')
            : 'Global Ocean Waters',
          dateCreated: 'Just now',
          paperStyle,
          fontStyle,
          sealColor,
          inkColor,
          borderStyle: 'flourish',
          deliveryMode,
          keepsake: deliveryMode === 'bottle' ? (selectedKeepsake || undefined) : undefined,
          stamps: selectedStamps,
          reactions: [],
          isRead: false,
          isArchived: false,
          isAnonymous: deliveryMode === 'bottle' ? isAnonymousBottle : false,
        };

        if (deliveryMode === 'pigeon') {
          const recipientName = isCustomRecipient ? customRecipientName : (selectedContact?.name || 'A Friend');
          const city = isCustomRecipient ? customRecipientCity : (selectedContact?.city || 'A Distant Land');
          const coords = isCustomRecipient ? { x: 55, y: 40 } : (selectedContact?.coords || { x: 44, y: 35 });
          onSendPigeon(newLetter, recipientName, coords, city, pigeonName, pigeonClothes);
        } else {
          onCastBottle(newLetter, isAnonymousBottle, bottleColor, sealColor, waxSealInsignia);
        }

        setTimeout(() => {
          setIsSealing(false);
          setSealingStep('editing');
          onClose();
        }, 2200);

      }, 1000);
    }, 1200);
  };

  // Font family class helper
  const getFontClass = (style: FontStyle) => {
    switch (style) {
      case 'cursive': return 'font-handwriting text-2xl leading-relaxed tracking-wide';
      case 'serif': return 'font-serif-vintage text-lg leading-relaxed';
      case 'typewriter': return 'font-typewriter text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#211b16] border border-[#4d3d2f] rounded-2xl max-w-4xl w-full p-4 sm:p-6 text-[#ded0bf] paper-shadow-deep relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3b2e23] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#362b22] border border-[#524132] flex items-center justify-center text-[#e0af68]">
              {deliveryMode === 'pigeon' ? <Feather className="w-5 h-5" /> : <Waves className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[#f5ebd7]">
                {replyToLetter ? 'Craft a Pen-Pal Reply' : 'Compose a Slow Letter'}
              </h2>
              <p className="text-xs text-[#9d8975] font-serif-vintage">
                Words entrusted to the wind and tide, without guarantee of return.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9d8975] hover:text-[#f2e6d6] hover:bg-[#34281f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setDeliveryMode('pigeon')}
            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
              deliveryMode === 'pigeon'
                ? 'bg-[#3b2c21] border-[#d97706] text-[#fef9f3] shadow-md'
                : 'bg-[#1a1511] border-[#382b21] text-[#9e8b79] hover:bg-[#251e18]'
            }`}
          >
            <div className={`p-2 rounded-lg ${deliveryMode === 'pigeon' ? 'bg-[#d97706] text-[#1a1511]' : 'bg-[#2b221a] text-[#8e7b6a]'}`}>
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif-vintage font-bold text-sm">Carrier Pigeon Post</div>
              <div className="text-xs text-[#b8a694] mt-0.5">
                Addressed to one specific person. Travel time is influenced by weather, seasons, and distance.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryMode('bottle')}
            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
              deliveryMode === 'bottle'
                ? 'bg-[#1b2a33] border-[#06b6d4] text-[#fef9f3] shadow-md'
                : 'bg-[#1a1511] border-[#382b21] text-[#9e8b79] hover:bg-[#251e18]'
            }`}
          >
            <div className={`p-2 rounded-lg ${deliveryMode === 'bottle' ? 'bg-[#06b6d4] text-[#121c21]' : 'bg-[#2b221a] text-[#8e7b6a]'}`}>
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif-vintage font-bold text-sm">Ocean Drift Bottle</div>
              <div className="text-xs text-[#b8a694] mt-0.5">
                Cast into the global ocean. You cannot choose who finds it; discovery may take months or years.
              </div>
            </div>
          </button>
        </div>

        {/* Recipient Configuration */}
        {deliveryMode === 'pigeon' ? (
          <div className="bg-[#191410] border border-[#382c21] rounded-xl p-3.5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-[#a89582] font-medium">
                Pigeon Heading & Recipient
              </span>
              <button
                type="button"
                onClick={() => setIsCustomRecipient(!isCustomRecipient)}
                className="text-xs text-[#d97706] hover:underline font-serif-vintage"
              >
                {isCustomRecipient ? '← Choose from Address Book' : '+ Enter New Remote Recipient'}
              </button>
            </div>

            {!isCustomRecipient ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEFAULT_CONTACTS.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedContact(contact)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      selectedContact?.id === contact.id
                        ? 'bg-[#3b2d22] border-[#d97706] text-[#fbf5eb]'
                        : 'bg-[#231b15] border-[#3c2f24] text-[#a89582] hover:bg-[#2c221a]'
                    }`}
                  >
                    <div className="font-bold text-[#f5ebd7] truncate">{contact.name}</div>
                    <div className="text-[11px] text-[#998572] truncate">{contact.city}, {contact.region}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Recipient Name (e.g. Thomas the Weaver)"
                  value={customRecipientName}
                  onChange={(e) => setCustomRecipientName(e.target.value)}
                  className="bg-[#241c16] border border-[#48372a] rounded-lg px-3 py-2 text-sm text-[#f5ebd7] placeholder-[#7d6957] focus:outline-none focus:border-[#d97706]"
                />
                <input
                  type="text"
                  placeholder="Destination Haven (e.g. Isle of Skye, Scotland)"
                  value={customRecipientCity}
                  onChange={(e) => setCustomRecipientCity(e.target.value)}
                  className="bg-[#241c16] border border-[#48372a] rounded-lg px-3 py-2 text-sm text-[#f5ebd7] placeholder-[#7d6957] focus:outline-none focus:border-[#d97706]"
                />
              </div>
            )}

            {/* Pigeon Companion & Attire Customization */}
            <div className="mt-3 pt-3 border-t border-[#3c2f24]">
              <div className="flex items-center justify-between bg-[#231b15] p-2.5 rounded-lg border border-[#48372a] mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#3d2e22] border border-[#6b4f3a] flex items-center justify-center text-base">
                    {selectedClothingObj.icon}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9d8975] font-mono">
                      Carrier Pigeon Assigned
                    </div>
                    <div className="text-sm font-serif-vintage font-bold text-[#fde68a] flex items-center gap-1.5">
                      <span>{pigeonName}</span>
                      <span className="text-xs font-normal text-[#c4b3a1]">({selectedClothingObj.name})</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRollPigeonName}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#3a2c20] hover:bg-[#4d3a2b] text-[#e0af68] text-xs font-serif-vintage transition-colors border border-[#5a4432]"
                  title="Assign a different name to this homer"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Roll Name</span>
                </button>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#a89582] block mb-1.5 font-medium">
                  Select Pigeon Flight Attire:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {PIGEON_CLOTHING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPigeonClothes(opt.id)}
                      className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        pigeonClothes === opt.id
                          ? 'bg-[#3d2d20] border-[#d97706] text-[#fef9f3] shadow'
                          : 'bg-[#1e1712] border-[#36291e] text-[#a89582] hover:bg-[#281e17]'
                      }`}
                    >
                      <span className="text-lg mb-0.5">{opt.icon}</span>
                      <span className="text-[11px] font-medium leading-tight line-clamp-1">{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-[#141b20] border border-[#273842] rounded-xl p-3.5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#7ea0b2] font-medium block">
                  Bottle Provenance & Tides
                </span>
                <p className="text-xs text-[#a0bac7] font-serif-vintage">
                  Your bottle will enter the global ocean currents. You can track its location until it is discovered.
                </p>
              </div>

              {/* Anonymous vs Signed Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#c4dce6]">
                <input
                  type="checkbox"
                  checked={isAnonymousBottle}
                  onChange={(e) => setIsAnonymousBottle(e.target.checked)}
                  className="rounded border-[#3c5563] bg-[#1d272e] text-[#06b6d4] focus:ring-0"
                />
                <span>Anonymous Bottle Mode</span>
              </label>
            </div>

            {/* Bottle Customization: Color and Wax Seal Insignia */}
            <div className="mt-3 pt-3 border-t border-[#243540] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7ea0b2] block mb-1.5 font-medium">
                  Custom Glass Bottle Tint:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BOTTLE_GLASS_COLORS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setBottleColor(col.hex)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border transition-all ${
                        bottleColor === col.hex
                          ? 'bg-[#173a45] text-[#e0f2fe] border-[#38bdf8] font-medium'
                          : 'bg-[#18232a] text-[#86a2b0] border-[#293d48] hover:bg-[#202f38]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7ea0b2] block mb-1.5 font-medium">
                  Wax Seal Insignia:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {WAX_INSIGNIAS.map((ins) => (
                    <button
                      key={ins.id}
                      type="button"
                      onClick={() => setWaxSealInsignia(ins.id)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border transition-all ${
                        waxSealInsignia === ins.id
                          ? 'bg-[#173a45] text-[#e0f2fe] border-[#38bdf8] font-medium'
                          : 'bg-[#18232a] text-[#86a2b0] border-[#293d48] hover:bg-[#202f38]'
                      }`}
                    >
                      <span>{ins.symbol}</span>
                      <span>{ins.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Keepsake item attachment */}
            <div className="mt-3 pt-3 border-t border-[#243540]">
              <span className="text-[11px] uppercase tracking-wider text-[#7ea0b2] block mb-1.5">
                Enclose a Tangible Keepsake in the Bottle
              </span>
              <div className="flex flex-wrap gap-2">
                {KEEPSAKES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedKeepsake(selectedKeepsake?.id === item.id ? null : item)}
                    className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                      selectedKeepsake?.id === item.id
                        ? 'bg-[#154654] text-[#a5f3fc] border-[#06b6d4]'
                        : 'bg-[#19242b] text-[#86a2b0] border-[#293d48] hover:bg-[#202f38]'
                    }`}
                  >
                    ✦ {item.name}
                  </button>
                ))}
              </div>
              {selectedKeepsake && (
                <p className="text-[11px] italic text-[#8cb0be] mt-1.5 font-serif-vintage">
                  {selectedKeepsake.lore}
                </p>
              )}
            </div>
          </div>
        )}

        {/* AI Helper Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-[#191410] px-3 py-2 rounded-lg border border-[#382b1f]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e0af68]" />
            <span className="text-xs font-serif-vintage text-[#d4c3b0]">Gemini Epistolary Companion:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className="text-xs px-2.5 py-1 rounded-md bg-[#2d2219] hover:bg-[#3b2d21] text-[#e0af68] border border-[#4f3d2f] transition-colors"
            >
              ✍️ Scribe Inspiration
            </button>
            <button
              type="button"
              disabled={isAiLoading || !content.trim()}
              onClick={handleSuggestStationeryWithAi}
              className="text-xs px-2.5 py-1 rounded-md bg-[#2d2219] hover:bg-[#3b2d21] text-[#bbf7d0] border border-[#4f3d2f] disabled:opacity-50 transition-colors"
            >
              📜 Harmonize Stationery & Spacing
            </button>
            <button
              type="button"
              disabled={isAiLoading || !content.trim()}
              onClick={handleTranslateWithAi}
              className="text-xs px-2.5 py-1 rounded-md bg-[#2d2219] hover:bg-[#3b2d21] text-[#93c5fd] border border-[#4f3d2f] disabled:opacity-50 transition-colors"
            >
              🌐 Poetic Translate
            </button>
          </div>
        </div>

        {/* AI Writing Assistant Drawer */}
        {showAiAssistant && (
          <div className="bg-[#261e17] border border-[#5a4332] p-4 rounded-xl mb-4 text-xs space-y-3 shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#3d2e22] pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e0af68]" />
                <span className="font-bold text-[#f5ebd7] text-sm">Gemini Epistolary Scribe</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3b2d21] text-[#93c5fd] font-mono">Gemini AI Active</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAiAssistant(false)}
                className="text-[#9e8b79] hover:text-[#f5ebd7] text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-[#a89684] text-xs leading-relaxed">
              Describe a memory, mood, place, or context, and Gemini will compose a heartfelt letter draft matched with aesthetic stationery.
            </p>

            <div>
              <label className="block text-[11px] font-medium text-[#d4c3b0] mb-1">
                Quick Context or Topic Description:
              </label>
              <textarea
                rows={2}
                placeholder="E.g. A quiet autumn afternoon remembering tea together by the window, watching the rain on the cobblestones..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-[#1b1511] border border-[#48372b] rounded-lg p-2.5 text-xs text-[#f5ebd7] placeholder-[#7d6957] focus:outline-none focus:border-[#d97706] resize-none"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8a7561] block mb-1.5 font-medium">
                Quick Inspiration Topics (Click to use):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "🌧️ Rain on cobblestones & tea",
                  "🍂 Autumn leaves & golden hour",
                  "🌊 Sea breeze, salt & solitude",
                  "🕯️ Late night candle reflections",
                  "💌 Reconnecting after long silence",
                  "🚂 Watching trains pass through the valley"
                ].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setAiPrompt(topic.replace(/^[^\s]+ /, ''))}
                    className="px-2 py-1 rounded-md bg-[#1d1712] hover:bg-[#34271c] text-[#c9b8a3] hover:text-[#fef9f3] border border-[#3e2e21] text-[11px] transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {aiError && (
              <div className="p-2 rounded bg-[#3b1c1c] border border-[#7f2d2d] text-[#fca5a5] text-xs">
                {aiError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[#9e8b79] text-xs">Desired Tone:</span>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="bg-[#1b1511] border border-[#48372b] rounded px-2.5 py-1.5 text-xs text-[#ded0bf] focus:outline-none"
                >
                  <option value="nostalgic & reflective">Nostalgic & Reflective</option>
                  <option value="romantic & gentle">Romantic & Gentle</option>
                  <option value="melancholy & peaceful">Melancholy & Peaceful</option>
                  <option value="curious & philosophical">Curious & Philosophical</option>
                  <option value="warm encouragement">Warm Encouragement</option>
                  <option value="short poetic haiku-like fragments">Short Poetic Fragments</option>
                </select>
              </div>

              <button
                type="button"
                disabled={isAiLoading}
                onClick={handleGenerateLetterWithAi}
                className="px-4 py-2 bg-[#8a3318] hover:bg-[#a64022] text-[#fef9f3] rounded-lg font-serif-vintage disabled:opacity-50 flex items-center gap-2 shadow-md transition-all"
              >
                {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="text-xs font-semibold">{isAiLoading ? 'Weaving Words...' : 'Weave Letter Draft'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Translation Preview Modal/Banner */}
        {showTranslatePreview && (
          <div className="bg-[#18232c] border border-[#2b4150] p-3 rounded-xl mb-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#bfe0f2]">Epistolary Translation ({targetLang}):</span>
              <button
                type="button"
                onClick={() => setShowTranslatePreview(false)}
                className="text-[#7da1b5] hover:text-[#e4f1f8]"
              >
                ✕
              </button>
            </div>
            <div className="font-serif-vintage italic text-[#d5eaf5] whitespace-pre-wrap max-h-36 overflow-y-auto p-2 bg-[#121a21] rounded border border-[#223542]">
              {translatedText}
            </div>
            {translationNotes && (
              <p className="text-[11px] text-[#86a6b8] italic">Note: {translationNotes}</p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setContent(translatedText);
                  setShowTranslatePreview(false);
                }}
                className="px-3 py-1 rounded bg-[#0284c7] text-white text-xs font-serif-vintage hover:bg-[#0369a1]"
              >
                Adopt Translated Text into Letter
              </button>
            </div>
          </div>
        )}

        {/* The Writing Parchment (Interactive Stationery Preview) */}
        <div 
          className={`rounded-xl p-6 sm:p-8 paper-shadow border relative transition-colors duration-300 ${
            paperStyle === 'parchment' ? 'bg-parchment text-[#2b241e] border-[#cfbea0]' :
            paperStyle === 'tea-stained' ? 'bg-tea-stained text-[#261f18] border-[#c4b18f]' :
            paperStyle === 'linen' ? 'bg-linen text-[#2d2620] border-[#d8cbbb]' :
            paperStyle === 'midnight-vellum' ? 'bg-midnight-vellum text-[#e2e8f0] border-[#32394a]' :
            'bg-botanical-pressed text-[#252a20] border-[#c5d0ba]'
          }`}
        >
          {/* Top Postage Stamps Display */}
          <div className="flex items-center justify-between mb-4 border-b border-black/10 pb-3">
            <input
              type="text"
              placeholder="Title or Opening Whisper (optional)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-dashed border-black/20 text-base sm:text-lg font-display font-semibold focus:outline-none placeholder:text-black/40 w-2/3"
            />

            <div className="flex items-center gap-2">
              {selectedStamps.map((st) => (
                <div 
                  key={st.id}
                  className="w-10 h-12 rounded border-2 border-dashed border-black/30 flex flex-col items-center justify-center p-1 text-[9px] font-mono shadow-sm"
                  style={{ backgroundColor: st.color + '22', borderColor: st.color }}
                  title={`${st.name} — ${st.quote}`}
                >
                  <span className="font-bold">{st.denomination}</span>
                  <Stamp className="w-3.5 h-3.5 my-0.5 opacity-80" />
                </div>
              ))}
            </div>
          </div>

          {/* Letter Textarea */}
          <textarea
            rows={8}
            placeholder={
              deliveryMode === 'pigeon'
                ? "Dearest correspondent,\n\nThe swallows are gathering along the eaves tonight..."
                : "To whoever finds this bottle upon the sand,\n\nI cast this into the salt water at sunset..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full bg-transparent resize-y focus:outline-none placeholder:text-black/30 ${getFontClass(fontStyle)}`}
            style={{ color: inkColor }}
          />

          {/* Bottom Wax Seal Preview */}
          <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between">
            <div className="text-xs italic font-serif-vintage opacity-75">
              {deliveryMode === 'pigeon' 
                ? `Carrier pigeon route: ${selectedContact?.city || customRecipientCity || 'Distant Haven'}` 
                : 'Drifting with global oceanic gyres'}
            </div>

            {/* Simulated Wax Seal Stamp */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-cinzel font-bold shadow-md transform hover:rotate-12 transition-transform cursor-pointer"
              style={{ backgroundColor: sealColor }}
              title="Wax seal will be stamped upon departure"
            >
              D
            </div>
          </div>
        </div>

        {/* Stationery Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#382b20] text-xs">
          
          {/* Paper Type */}
          <div>
            <label className="text-[#a89582] block mb-1">Paper Surface:</label>
            <select
              value={paperStyle}
              onChange={(e) => setPaperStyle(e.target.value as PaperStyle)}
              className="w-full bg-[#191410] border border-[#3e3024] rounded-lg px-2.5 py-1.5 text-[#ded0bf]"
            >
              <option value="tea-stained">Tea-Stained Vellum</option>
              <option value="parchment">Aged Parchment</option>
              <option value="linen">Irish Linen</option>
              <option value="botanical-pressed">Pressed Botanical</option>
              <option value="midnight-vellum">Midnight Vellum</option>
            </select>
          </div>

          {/* Typography */}
          <div>
            <label className="text-[#a89582] block mb-1">Handwriting Script:</label>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value as FontStyle)}
              className="w-full bg-[#191410] border border-[#3e3024] rounded-lg px-2.5 py-1.5 text-[#ded0bf]"
            >
              <option value="cursive">Cursive Quill (Caveat)</option>
              <option value="serif">Classical Monastic (Garamond)</option>
              <option value="typewriter">Mechanical (Courier Prime)</option>
            </select>
          </div>

          {/* Sealing Wax Color */}
          <div>
            <label className="text-[#a89582] block mb-1">Sealing Wax:</label>
            <div className="flex items-center gap-1.5 py-1">
              {SEAL_COLORS.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setSealColor(col.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    sealColor === col.hex ? 'scale-125 border-white' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Postage Stamps */}
          <div>
            <label className="text-[#a89582] block mb-1">Affix Postage Stamp:</label>
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {POSTAL_STAMPS.slice(0, 4).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleToggleStamp(st)}
                  className={`px-2 py-0.5 rounded border text-[10px] font-mono whitespace-nowrap transition-all ${
                    selectedStamps.some(s => s.id === st.id)
                      ? 'bg-[#3b2d22] border-[#d97706] text-[#fef9f3]'
                      : 'bg-[#191410] border-[#382a1f] text-[#8e7a68]'
                  }`}
                >
                  {st.denomination}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3b2e23]">
          <p className="text-xs text-[#9d8975] font-serif-vintage hidden sm:block">
            {deliveryMode === 'pigeon' 
              ? '🕊️ No read receipts. Pigeon arrival time is unknown.' 
              : '🌊 Any stranger across the world may discover this bottle.'}
          </p>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#271f19] hover:bg-[#342921] text-xs font-serif-vintage text-[#c2b2a0]"
            >
              Discard Draft
            </button>

            <button
              type="button"
              disabled={!content.trim() || isSealing}
              onClick={handleDispatch}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#8a3318] to-[#5a1c0d] text-[#fef9f3] text-sm font-serif-vintage font-bold tracking-wide border border-[#b44828] shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Pour Wax & Dispatch</span>
            </button>
          </div>
        </div>

        {/* Wax Pouring & Sealing Overlay Ceremony */}
        {isSealing && (
          <div className="absolute inset-0 bg-[#171310]/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-6 z-30">
            {sealingStep === 'pouring_wax' && (
              <div className="space-y-4 animate-pulse">
                <div 
                  className="w-16 h-16 rounded-full mx-auto shadow-2xl animate-bounce"
                  style={{ backgroundColor: sealColor }}
                />
                <h3 className="font-cinzel text-xl text-[#f5ebd7]">Pouring Warm Sealing Wax...</h3>
                <p className="text-xs text-[#a89582] font-serif-vintage">
                  Securing parchment with natural pine resin and beeswax.
                </p>
              </div>
            )}

            {sealingStep === 'stamped' && (
              <div className="space-y-4">
                <div 
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-cinzel font-bold shadow-2xl border-4 border-amber-200/40"
                  style={{ backgroundColor: sealColor }}
                >
                  {deliveryMode === 'bottle' ? selectedInsigniaObj.symbol : '🕊️'}
                </div>
                <h3 className="font-cinzel text-2xl text-[#f5ebd7]">
                  {deliveryMode === 'bottle'
                    ? `Stamped with the "${selectedInsigniaObj.name}" Insignia`
                    : `Affixed with the Carrier Seal`}
                </h3>
                <p className="text-sm text-[#d4c5b4] font-serif-vintage">
                  The seal has set firm into deep wax. Preparing for departure.
                </p>
              </div>
            )}

            {sealingStep === 'dispatched' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-full bg-[#3b2d22] border border-[#5c4635] text-[#e0af68] inline-block mx-auto text-3xl">
                  {deliveryMode === 'pigeon' ? selectedClothingObj.icon : '🍾'}
                </div>
                <h3 className="font-cinzel text-2xl text-[#f5ebd7]">
                  {deliveryMode === 'pigeon' 
                    ? `Pigeon "${pigeonName}" Takes Flight` 
                    : `Cast Adrift in ${selectedGlassObj.name} Glass`}
                </h3>
                <p className="text-sm text-[#d4c5b4] font-serif-vintage max-w-md mx-auto leading-relaxed">
                  {deliveryMode === 'pigeon'
                    ? `Your homing pigeon "${pigeonName}" wearing ${selectedClothingObj.name} has departed toward ${selectedContact?.city || customRecipientCity || 'the horizon'}. May gentle winds guide its wings through shifting skies.`
                    : `The ${selectedGlassObj.name.toLowerCase()} bottle sealed with ${selectedInsigniaObj.name} insignia bobs into the tidal breakers, caught by the great oceanic gyres. When found, it will slip quietly from your map.`}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
