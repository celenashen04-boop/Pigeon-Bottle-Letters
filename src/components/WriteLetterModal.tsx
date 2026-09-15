import React, { useState, useEffect } from 'react';
import { 
  X, 
  Feather, 
  Waves, 
  Sparkles, 
  Stamp, 
  Check, 
  Palette, 
  BookOpen, 
  Send, 
  Eye, 
  Loader2, 
  HelpCircle, 
  Shirt, 
  Briefcase, 
  Compass, 
  Users 
} from 'lucide-react';
import { PigeonVisual } from './PigeonVisual';
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
  getRandomPigeonName, 
  CAREER_INDUSTRIES, 
  CAREER_POSITIONS_BY_INDUSTRY, 
  MATCHING_PROFESSIONALS 
} from '../simulation/constants';
import { playWaxSealThud } from '../utils/ambientAudio';
import { getPaperThemeClasses, getAccessibleInk } from '../utils/contrast';

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
    pigeonClothes?: string, 
    recipientCompany?: string, 
    recipientPosition?: string
  ) => void;
  onCastBottle: (
    letter: Letter, 
    isAnonymous: boolean, 
    bottleColor?: string, 
    waxSealColor?: string, 
    waxSealInsignia?: string, 
    targetIndustry?: string, 
    targetPosition?: string
  ) => void;
}

const PIGEON_SEAL_COLORS = [
  { name: 'Crimson Wine', hex: '#7c2d12' },
  { name: 'Deep Indigo', hex: '#1e3a8a' },
  { name: 'Forest Evergreen', hex: '#065f46' },
  { name: 'Imperial Plum', hex: '#701a75' },
  { name: 'Amber Bronze', hex: '#b45309' },
  { name: 'Obsidian Night', hex: '#1c1917' },
];

const BOTTLE_SEAL_COLORS = [
  { name: 'Azure Ocean', hex: '#0284c7' },
  { name: 'Deep Abyss Navy', hex: '#0c2338' },
  { name: 'Seafoam Aquamarine', hex: '#0d9488' },
  { name: 'Bioluminescent Cyan', hex: '#06b6d4' },
  { name: 'Royal Maritime', hex: '#1e3a8a' },
  { name: 'Bronze Barnacle', hex: '#b45309' },
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
  const isBottle = deliveryMode === 'bottle';
  
  // Recipient state for Pigeon
  const [selectedContact, setSelectedContact] = useState<UserContact | null>(
    replyToLetter ? (DEFAULT_CONTACTS.find(c => c.name === replyToLetter.author) || null) : DEFAULT_CONTACTS[0]
  );
  const [customRecipientName, setCustomRecipientName] = useState(replyToLetter?.author || '');
  const [customRecipientCity, setCustomRecipientCity] = useState(replyToLetter?.recipientLocation || '');
  const [customRecipientCompany, setCustomRecipientCompany] = useState('');
  const [customRecipientPosition, setCustomRecipientPosition] = useState('');
  const [isCustomRecipient, setIsCustomRecipient] = useState(false);

  // Pigeon Customization
  const [pigeonName, setPigeonName] = useState(() => getRandomPigeonName());
  const [pigeonClothes, setPigeonClothes] = useState<string>('aviator_goggles');

  // Bottle Customization & Career Targeting
  const [bottleColor, setBottleColor] = useState<string>('#14b8a6');
  const [waxSealInsignia, setWaxSealInsignia] = useState<string>('swallow');
  const [isAnonymousBottle, setIsAnonymousBottle] = useState(false);
  const [selectedKeepsake, setSelectedKeepsake] = useState<KeepsakeItem | null>(KEEPSAKES[0]);
  const [targetIndustry, setTargetIndustry] = useState<string>('Open to All Professions');
  const [targetPosition, setTargetPosition] = useState<string>('');

  // Letter contents
  const [title, setTitle] = useState(replyToLetter ? `Reply to: ${replyToLetter.title}` : '');
  const [content, setContent] = useState('');
  
  // Stationery styling
  const [paperStyle, setPaperStyle] = useState<PaperStyle>(defaultMode === 'bottle' ? 'ocean-drift' : 'tea-stained');
  const [fontStyle, setFontStyle] = useState<FontStyle>('cursive');
  const [sealColor, setSealColor] = useState(defaultMode === 'bottle' ? '#0284c7' : '#7c2d12');
  const [inkColor, setInkColor] = useState(getAccessibleInk(defaultMode === 'bottle' ? 'ocean-drift' : 'tea-stained'));

  const handlePaperStyleChange = (newStyle: PaperStyle) => {
    setPaperStyle(newStyle);
    setInkColor(getAccessibleInk(newStyle));
  };

  // Sync mode and default palette whenever modal is opened with a specific defaultMode
  useEffect(() => {
    if (isOpen) {
      setDeliveryMode(defaultMode);
      if (defaultMode === 'bottle') {
        setSealColor('#0284c7');
        setPaperStyle('ocean-drift');
        setInkColor(getAccessibleInk('ocean-drift'));
      } else {
        setSealColor('#7c2d12');
        setPaperStyle('tea-stained');
        setInkColor(getAccessibleInk('tea-stained'));
      }
    }
  }, [isOpen, defaultMode]);

  const handleSelectDeliveryMode = (mode: DeliveryMode) => {
    setDeliveryMode(mode);
    if (mode === 'bottle') {
      setSealColor('#0284c7');
      if (paperStyle === 'tea-stained' || paperStyle === 'parchment') {
        setPaperStyle('ocean-drift');
        setInkColor(getAccessibleInk('ocean-drift'));
      }
    } else {
      setSealColor('#7c2d12');
      if (paperStyle === 'ocean-drift') {
        setPaperStyle('tea-stained');
        setInkColor(getAccessibleInk('tea-stained'));
      }
    }
  };

  const activeSealColors = isBottle ? BOTTLE_SEAL_COLORS : PIGEON_SEAL_COLORS;

  // AI states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('concise & professional');
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [mentorFeedback, setMentorFeedback] = useState<string | null>(null);
  const [alternativePhrasing, setAlternativePhrasing] = useState<string | null>(null);

  // Sealing animation state
  const [isSealing, setIsSealing] = useState(false);
  const [sealingStep, setSealingStep] = useState<'editing' | 'pouring_wax' | 'stamped' | 'dispatched'>('editing');

  if (!isOpen) return null;

  const selectedClothingObj = PIGEON_CLOTHING_OPTIONS.find(c => c.id === pigeonClothes) || PIGEON_CLOTHING_OPTIONS[0];
  const selectedInsigniaObj = WAX_INSIGNIAS.find(w => w.id === waxSealInsignia) || WAX_INSIGNIAS[0];
  const selectedGlassObj = BOTTLE_GLASS_COLORS.find(g => g.hex === bottleColor) || BOTTLE_GLASS_COLORS[0];

  // AI 1: Peer Career Advisor & Reach-out Mentor
  const handleGenerateLetterWithAi = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const isBottleMode = deliveryMode === 'bottle';
      const recipientName = isBottleMode
        ? undefined
        : (isCustomRecipient ? customRecipientName : (selectedContact?.name || "a professional colleague"));
      
      const defaultPrompt = isBottleMode
        ? "An open cold outreach introducing my background and asking if anyone in the field would be open to exchanging perspectives"
        : "Reach out to ask for a 15-minute coffee chat regarding their career journey and advice on a specific role";

      const res = await fetch('/api/ai/letter-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt.trim() || defaultPrompt,
          recipient: recipientName,
          deliveryMode: isBottleMode ? 'bottle' : 'pigeon',
          tone: aiTone,
          currentDraft: content,
        }),
      });
      const data = await res.json();
      if (data.suggestedLetter) {
        let cleanLetter = data.suggestedLetter;
        if (isBottleMode) {
          // Extra guarantee: Bottle letters must never address a specific person
          cleanLetter = cleanLetter
            .replace(/^(Dear|Hi|Hello|Greetings)\s+(\[Name\]|\[Recipient\]|\[Recipient's Name\]|[A-Z][a-z]+(\s+[A-Z][a-z]+)?),?/im, "Hello,")
            .replace(/^To\s+(\[Name\]|\[Recipient\]),?/im, "To whoever finds this letter,");
        }
        setContent(cleanLetter);
        if (!title && data.poeticExcerpt) {
          setTitle(data.poeticExcerpt.slice(0, 50));
        }
        if (data.feedback) {
          setMentorFeedback(data.feedback);
        }
        if (data.alternativePhrasing) {
          setAlternativePhrasing(data.alternativePhrasing);
        }
        if (data.stationeryAdvice && typeof data.stationeryAdvice === 'object') {
          if (data.stationeryAdvice.paperStyle) {
            setPaperStyle(data.stationeryAdvice.paperStyle);
            setInkColor(getAccessibleInk(data.stationeryAdvice.paperStyle));
          }
          if (data.stationeryAdvice.sealColor) setSealColor(data.stationeryAdvice.sealColor);
          if (data.stationeryAdvice.fontStyle) setFontStyle(data.stationeryAdvice.fontStyle);
        }
      } else if (data.error) {
        setAiError(typeof data.error === 'string' ? data.error : "Failed to compose message.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to reach letter assistant.");
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

        const finalTargetInd = deliveryMode === 'bottle' && targetIndustry !== 'Open to All Professions' ? targetIndustry : undefined;
        const finalTargetPos = deliveryMode === 'bottle' && targetPosition.trim() ? targetPosition.trim() : undefined;

        const newLetter: Letter = {
          id: `letter-${Date.now()}`,
          title: title.trim() || (deliveryMode === 'pigeon' ? 'Folded Dispatch' : 'Drift Scroll'),
          content: content.trim(),
          author: deliveryMode === 'bottle' && isAnonymousBottle ? 'An Anonymous Soul' : 'You',
          authorCompany: 'Coastal Correspondence Guild',
          authorPosition: 'Keeper of the Coastal Hearth',
          recipient: deliveryMode === 'pigeon' 
            ? (isCustomRecipient ? customRecipientName : selectedContact?.name || 'A Faraway Pen-Pal')
            : (finalTargetPos ? `Fellow ${finalTargetPos}` : 'To Whomever Finds This Shore'),
          recipientCompany: deliveryMode === 'pigeon'
            ? (isCustomRecipient ? customRecipientCompany : selectedContact?.company)
            : (finalTargetInd ? `${finalTargetInd} Circles` : undefined),
          recipientPosition: deliveryMode === 'pigeon'
            ? (isCustomRecipient ? customRecipientPosition : selectedContact?.position)
            : finalTargetPos,
          recipientLocation: deliveryMode === 'pigeon'
            ? (isCustomRecipient ? customRecipientCity : selectedContact?.city || 'A Distant Haven')
            : 'Global Ocean Waters',
          dateCreated: 'Just now',
          paperStyle,
          fontStyle,
          sealColor,
          inkColor: getAccessibleInk(paperStyle, inkColor),
          borderStyle: 'flourish',
          deliveryMode,
          targetIndustry: finalTargetInd,
          targetPosition: finalTargetPos,
          keepsake: deliveryMode === 'bottle' ? (selectedKeepsake || undefined) : undefined,
          stamps: [],
          reactions: [],
          isRead: false,
          isArchived: false,
          isAnonymous: deliveryMode === 'bottle' ? isAnonymousBottle : false,
        };

        if (deliveryMode === 'pigeon') {
          const recipientName = isCustomRecipient ? customRecipientName : (selectedContact?.name || 'A Friend');
          const city = isCustomRecipient ? customRecipientCity : (selectedContact?.city || 'A Distant Land');
          const coords = isCustomRecipient ? { x: 55, y: 40 } : (selectedContact?.coords || { x: 44, y: 35 });
          const comp = isCustomRecipient ? customRecipientCompany : selectedContact?.company;
          const pos = isCustomRecipient ? customRecipientPosition : selectedContact?.position;
          onSendPigeon(newLetter, recipientName, coords, city, pigeonName, pigeonClothes, comp, pos);
        } else {
          onCastBottle(newLetter, isAnonymousBottle, bottleColor, sealColor, waxSealInsignia, finalTargetInd, finalTargetPos);
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
      case 'serif': return 'font-garamond text-lg leading-relaxed';
      case 'typewriter': return 'font-typewriter text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Centering wrapper with generous top padding to bring modal down and ensure everything fits into frame without clipping */}
      <div className="min-h-full flex items-start justify-center p-2 sm:p-4 pt-6 sm:pt-10 pb-16">
        <div 
          className={`rounded-2xl max-w-4xl w-full p-4 sm:p-6 paper-shadow-deep relative shadow-2xl transition-all duration-300 ${
            isBottle 
              ? 'bg-[#07131e] border border-[#193950] text-[#d4e7f5] ring-1 ring-[#0284c7]/30 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.35)]' 
              : 'bg-[#211b16] border border-[#4d3d2f] text-[#ded0bf]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Subtle Ambient Ocean Gradient Glow for Bottle Mode */}
        {isBottle && (
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0284c7]/20 via-[#0369a1]/10 to-transparent pointer-events-none rounded-t-2xl" />
        )}

        {/* Header Bar */}
        <div className={`flex items-center justify-between pb-4 border-b mb-4 relative z-10 ${
          isBottle ? 'border-[#15344a]' : 'border-[#3b2e23]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
              isBottle 
                ? 'bg-[#0b283d] border-[#1b557b] text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.35)]' 
                : 'bg-[#362b22] border-[#524132] text-[#e0af68]'
            }`}>
              {isBottle ? <Waves className="w-5 h-5" /> : <Feather className="w-5 h-5" />}
            </div>
            <div>
              <h2 className={`text-xl font-display font-bold ${isBottle ? 'text-[#f0f9ff]' : 'text-[#f5ebd7]'}`}>
                {isBottle 
                  ? 'Cast an Ocean Drift Scroll' 
                  : (replyToLetter ? 'Craft a Pen-Pal Reply' : 'Compose a Slow Letter')}
              </h2>
              <p className={`text-xs font-serif-vintage ${isBottle ? 'text-[#7ea5bd]' : 'text-[#9d8975]'}`}>
                {isBottle 
                  ? 'Entrusted to tinted sea-glass and worldwide oceanic gyres, awaiting a distant shore.'
                  : 'Words entrusted to the wind and tide, without guarantee of return.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isBottle 
                ? 'text-[#7ea5bd] hover:text-[#f0f9ff] hover:bg-[#0e2c40]' 
                : 'text-[#9d8975] hover:text-[#f2e6d6] hover:bg-[#34281f]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
          <button
            type="button"
            onClick={() => handleSelectDeliveryMode('pigeon')}
            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
              deliveryMode === 'pigeon'
                ? 'bg-[#3b2c21] border-[#d97706] text-[#fef9f3] shadow-md'
                : isBottle
                  ? 'bg-[#091a26] border-[#143247] text-[#6e92a7] hover:bg-[#0e2535] hover:text-[#a2c8de]'
                  : 'bg-[#1a1511] border-[#382b21] text-[#9e8b79] hover:bg-[#251e18]'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              deliveryMode === 'pigeon' 
                ? 'bg-[#d97706] text-[#1a1511]' 
                : isBottle 
                  ? 'bg-[#0c2436] text-[#698da2]' 
                  : 'bg-[#2b221a] text-[#8e7b6a]'
            }`}>
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif-vintage font-bold text-sm">Carrier Pigeon Post</div>
              <div className={`text-xs mt-0.5 ${isBottle ? 'text-[#7b9eb3]' : 'text-[#b8a694]'}`}>
                Addressed to one specific person. Travel time is influenced by weather, seasons, and distance.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectDeliveryMode('bottle')}
            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
              deliveryMode === 'bottle'
                ? 'bg-gradient-to-r from-[#0c2f45] to-[#082233] border-[#38bdf8] text-[#f0f9ff] shadow-[0_0_20px_rgba(56,189,248,0.35)] ring-1 ring-[#38bdf8]/60'
                : 'bg-[#1a1511] border-[#382b21] text-[#9e8b79] hover:bg-[#251e18]'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              deliveryMode === 'bottle' 
                ? 'bg-[#38bdf8] text-[#051c29] shadow-[0_0_10px_rgba(56,189,248,0.5)]' 
                : 'bg-[#2b221a] text-[#8e7b6a]'
            }`}>
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <div className={`font-serif-vintage font-bold text-sm ${deliveryMode === 'bottle' ? 'text-[#38bdf8]' : ''}`}>
                Ocean Drift Bottle
              </div>
              <div className={`text-xs mt-0.5 ${deliveryMode === 'bottle' ? 'text-[#a5cbe0]' : 'text-[#b8a694]'}`}>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {DEFAULT_CONTACTS.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedContact(contact)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      selectedContact?.id === contact.id
                        ? 'bg-[#3b2d22] border-[#d97706] text-[#fbf5eb]'
                        : 'bg-[#231b15] border-[#3c2f24] text-[#a89582] hover:bg-[#2c221a]'
                    }`}
                  >
                    <div className="font-bold text-[#f5ebd7] truncate">{contact.name}</div>
                    {contact.position && (
                      <div className="text-[11px] text-[#e0af68] font-serif-vintage truncate mt-0.5">
                        {contact.position}
                      </div>
                    )}
                    <div className="text-[10px] text-[#998572] truncate">
                      {contact.company ? `${contact.company} · ` : ''}{contact.city}, {contact.region}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Career Position / Title (e.g. Master Weaver, Lead Botanist)"
                    value={customRecipientPosition}
                    onChange={(e) => setCustomRecipientPosition(e.target.value)}
                    className="bg-[#241c16] border border-[#48372a] rounded-lg px-3 py-2 text-xs text-[#f5ebd7] placeholder-[#7d6957] focus:outline-none focus:border-[#d97706]"
                  />
                  <input
                    type="text"
                    placeholder="Guild / Organization (e.g. Hebrides Wool Guild)"
                    value={customRecipientCompany}
                    onChange={(e) => setCustomRecipientCompany(e.target.value)}
                    className="bg-[#241c16] border border-[#48372a] rounded-lg px-3 py-2 text-xs text-[#f5ebd7] placeholder-[#7d6957] focus:outline-none focus:border-[#d97706]"
                  />
                </div>
              </div>
            )}

            {/* Pigeon Companion & Attire Customization - Live Interactive Pigeon that changes outfit with flight attire */}
            <div className="mt-3 pt-3 border-t border-[#3c2f24]">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#201812] to-[#2b1e16] p-3.5 rounded-xl border border-[#48372a] mb-3 shadow-md">
                <div className="flex-shrink-0 relative bg-[#130d09] border border-[#523d2d] rounded-xl p-2.5 flex items-center justify-center shadow-inner">
                  <PigeonVisual attireId={pigeonClothes} size="md" animated={true} />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#9d8975] font-mono">
                    Homing Companion Attire
                  </div>
                  <div className="text-sm font-serif-vintage font-bold text-[#fde68a] flex items-center justify-center sm:justify-start gap-2">
                    <span>{pigeonName}</span>
                    <span className="text-xs font-normal text-[#c4b3a1] bg-[#3a281d] px-2 py-0.5 rounded-full border border-[#523d2d]">
                      {selectedClothingObj.icon} {selectedClothingObj.name}
                    </span>
                  </div>
                  <p className="text-xs text-[#ded0bf] leading-relaxed">
                    {selectedClothingObj.description}
                  </p>
                  <p className="text-[11px] text-[#a89582] italic pt-0.5">
                    Select any flight attire below to change its outfit in real-time.
                  </p>
                </div>
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
                      className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                        pigeonClothes === opt.id
                          ? 'bg-[#3d2d20] border-[#d97706] text-[#fef9f3] shadow-md ring-1 ring-[#d97706]'
                          : 'bg-[#1e1712] border-[#36291e] text-[#a89582] hover:bg-[#281e17] hover:text-[#ded0bf]'
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
          <div className="bg-[#091a27] border border-[#1b4360] rounded-xl p-3.5 mb-4 shadow-[inset_0_1px_2px_rgba(56,189,248,0.15)] relative overflow-hidden">
            {/* Soft wave glow overlay */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#0284c7]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#38bdf8] font-semibold block flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5" />
                  Bottle Provenance & Oceanic Gyres
                </span>
                <p className="text-xs text-[#9fc0d4] font-serif-vintage mt-0.5">
                  Your bottle will enter the global ocean currents. You can track its live coordinates until it is drawn ashore.
                </p>
              </div>

              {/* Anonymous vs Signed Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#c6e6f5] bg-[#0d2638] px-2.5 py-1 rounded-lg border border-[#1c4b6c] hover:border-[#38bdf8] transition-colors">
                <input
                  type="checkbox"
                  checked={isAnonymousBottle}
                  onChange={(e) => setIsAnonymousBottle(e.target.checked)}
                  className="rounded border-[#1f5379] bg-[#071926] text-[#0284c7] focus:ring-0"
                />
                <span>Cast Anonymously</span>
              </label>
            </div>

            {/* Bottle Customization: Color */}
            <div className="mt-3 pt-3 border-t border-[#163850] relative z-10">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7eaec7] block mb-1.5 font-medium">
                  Custom Sea-Glass Bottle Tint:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BOTTLE_GLASS_COLORS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setBottleColor(col.hex)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border transition-all ${
                        bottleColor === col.hex
                          ? 'bg-[#0f344d] text-[#f0f9ff] border-[#38bdf8] font-medium shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                          : 'bg-[#0c2233] text-[#86acc2] border-[#183d59] hover:bg-[#112d44]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Keepsake item attachment */}
            <div className="mt-3 pt-3 border-t border-[#163850] relative z-10">
              <span className="text-[11px] uppercase tracking-wider text-[#7eaec7] block mb-1.5 font-medium">
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
                        ? 'bg-[#0b405e] text-[#e0f2fe] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                        : 'bg-[#0c2233] text-[#86acc2] border-[#183d59] hover:bg-[#112d44]'
                    }`}
                  >
                    ✦ {item.name}
                  </button>
                ))}
              </div>
              {selectedKeepsake && (
                <p className="text-[11px] italic text-[#8ec0d9] mt-1.5 font-serif-vintage">
                  {selectedKeepsake.lore}
                </p>
              )}
            </div>

            {/* Career Position & Industry Targeting */}
            <div className="mt-3 pt-3 border-t border-[#163850] relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#38bdf8]" />
                  <span className="text-xs uppercase tracking-wider text-[#7eaec7] font-semibold">
                    Career Position & Industry Targeting
                  </span>
                </div>
                {targetIndustry !== 'Open to All Professions' && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#0284c7]/25 border border-[#38bdf8]/60 text-[#bae6fd] font-mono self-start sm:self-auto flex items-center gap-1.5 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                    Targeted Drift Active
                  </span>
                )}
              </div>

              <p className="text-xs text-[#9fc0d4] font-serif-vintage mb-3 leading-relaxed">
                Filter the ocean currents by trade. Only verified professionals in your designated industry or career position whose coastal stations monitor the tideline will be permitted to discover and pull the cork on this bottle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Industry Selector */}
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#7eaec7] block mb-1 font-medium">
                    Target Industry / Discipline:
                  </label>
                  <select
                    value={targetIndustry}
                    onChange={(e) => {
                      setTargetIndustry(e.target.value);
                      setTargetPosition('');
                    }}
                    className="w-full bg-[#081a28] border border-[#1b4360] rounded-lg px-3 py-2 text-xs text-[#f0f9ff] focus:outline-none focus:border-[#38bdf8] cursor-pointer shadow-sm"
                  >
                    <option value="Open to All Professions">Open to All Professions (Unrestricted Drift)</option>
                    {CAREER_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Position / Role */}
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#7eaec7] block mb-1 font-medium">
                    Specific Career Position / Role (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder={targetIndustry === 'Open to All Professions' ? 'e.g. Any wanderer (or type role)' : 'e.g. Herbarium Botanist, Archival Historian'}
                    value={targetPosition}
                    onChange={(e) => setTargetPosition(e.target.value)}
                    className="w-full bg-[#081a28] border border-[#1b4360] rounded-lg px-3 py-2 text-xs text-[#f0f9ff] placeholder-[#557b91] focus:outline-none focus:border-[#38bdf8] shadow-sm"
                  />
                </div>
              </div>

              {/* Quick suggestions when industry is chosen */}
              {targetIndustry !== 'Open to All Professions' && CAREER_POSITIONS_BY_INDUSTRY[targetIndustry] && (
                <div className="mt-2.5">
                  <span className="text-[10px] uppercase text-[#6f9eb8] block mb-1 font-mono">
                    Suggested positions in this field:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {CAREER_POSITIONS_BY_INDUSTRY[targetIndustry].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setTargetPosition(pos)}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                          targetPosition === pos
                            ? 'bg-[#0284c7] text-white border-[#38bdf8] font-medium shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                            : 'bg-[#092235] text-[#8cb2c7] border-[#183f5c] hover:text-[#dff1fa] hover:bg-[#0f2e46]'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Informational badge regarding matching professionals */}
              {targetIndustry !== 'Open to All Professions' ? (
                <div className="mt-3 p-2.5 rounded-lg bg-[#061825] border border-[#1b4a6b] flex items-start gap-2.5 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-[#0e3752] text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ⚓
                  </div>
                  <div className="text-[11px] font-serif-vintage leading-relaxed text-[#a6ccde]">
                    <span className="text-[#38bdf8] font-semibold">Tidal Guidance Filter: </span>
                    {targetPosition ? (
                      <>Only professionals matching <strong className="text-[#e0f2fe] font-semibold">{targetPosition}</strong> within <em>{targetIndustry}</em> will have clearance to pull this wax seal when it washes ashore.</>
                    ) : (
                      <>Only scholars and practitioners in <strong className="text-[#e0f2fe] font-semibold">{targetIndustry}</strong> will be alerted when this bottle drifts into coastal waters.</>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-[#6d9cb5] font-serif-vintage italic">
                  ✦ Open drift: Anyone walking the beachcomber shoreline or coastal trails may discover this bottle.
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Helper Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-2 mb-3 px-3 py-2 rounded-lg border transition-colors ${
          isBottle 
            ? 'bg-[#091d2c] border-[#184261] text-[#bfe0f2]' 
            : 'bg-[#191410] border-[#382b1f] text-[#d4c3b0]'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isBottle ? 'text-[#38bdf8]' : 'text-[#e0af68]'}`} />
            <span className="text-xs font-serif-vintage">Peer Career Advisor & Reach-out Mentor:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors font-medium flex items-center gap-1.5 cursor-pointer ${
                isBottle 
                  ? 'bg-[#0f2e46] hover:bg-[#163f5e] text-[#38bdf8] border-[#1d527a]' 
                  : 'bg-[#2d2219] hover:bg-[#3b2d21] text-[#e0af68] border-[#4f3d2f]'
              }`}
            >
              <span>💼</span>
              <span>{showAiAssistant ? 'Hide Advisor' : 'Draft / Advise Reach-out'}</span>
            </button>
          </div>
        </div>

        {/* Peer Career Advisor / Letter Assistant Drawer */}
        {showAiAssistant && (
          <div className={`p-4 rounded-xl mb-4 text-xs space-y-3.5 shadow-xl animate-in fade-in duration-200 border ${
            isBottle 
              ? 'bg-[#071927] border-[#1b486c] text-[#d4e7f5]' 
              : 'bg-[#241c16] border-[#5a4332] text-[#ded0bf]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2.5 ${
              isBottle ? 'border-[#153a57]' : 'border-[#3d2e22]'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isBottle ? 'text-[#38bdf8]' : 'text-[#e0af68]'}`} />
                <span className={`font-bold text-sm font-serif-vintage ${isBottle ? 'text-[#f0f9ff]' : 'text-[#f5ebd7]'}`}>
                  Peer Career Advisor & Mentor
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                  isBottle 
                    ? 'bg-[#0c2f47] text-[#7dd3fc] border-[#1e5880]' 
                    : 'bg-[#3b2d21] text-[#93c5fd] border-[#4d3a2b]'
                }`}>
                  {deliveryMode === 'pigeon' ? '🕊️ Pigeon: Targeted Reach-out' : '🍾 Bottle: Open Cold Outreach'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAiAssistant(false)}
                className={`text-sm p-1 rounded transition-colors ${
                  isBottle ? 'text-[#7ea5bd] hover:text-[#f0f9ff] hover:bg-[#0f2e46]' : 'text-[#9e8b79] hover:text-[#f5ebd7] hover:bg-[#34261b]'
                }`}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isBottle ? 'text-[#a2c5db]' : 'text-[#c2b2a1]'}`}>
              Share the context of your situation and desired outcome (e.g. asking for a 15-min coffee chat, seeking guidance on a specific role, or sending a sincere follow-up/apology for missing a meeting). The mentor will draft an authentic message in your voice that you can freely edit.
            </p>

            {/* Context & Situation Input */}
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isBottle ? 'text-[#e0f2fe]' : 'text-[#e8dac9]'}`}>
                Context & Situation / Desired Outcome:
              </label>
              <textarea
                rows={3}
                placeholder="E.g., I want to connect with a senior product designer at Stripe to ask about transition from UX research. Want to ask for a brief 15-min chat next week, without sounding overly flattering or pushy."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className={`w-full rounded-lg p-2.5 text-xs resize-none leading-relaxed focus:outline-none ${
                  isBottle 
                    ? 'bg-[#051421] border border-[#1b486c] text-[#f0f9ff] placeholder-[#557b91] focus:border-[#38bdf8]' 
                    : 'bg-[#17120e] border border-[#48372b] text-[#f5ebd7] placeholder-[#7d6957] focus:border-[#d97706]'
                }`}
              />
            </div>

            {/* Quick Context Presets */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block mb-1.5 font-medium ${isBottle ? 'text-[#7ea5bd]' : 'text-[#9d8975]'}`}>
                Quick Scenarios (Click to load):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(isBottle ? [
                  { label: "🌊 Open Industry Inquiry", text: "An open dispatch to anyone in [Industry/Field] sharing what I am exploring and asking if anyone would be open to a casual exchange of perspectives." },
                  { label: "💡 Advice for Aspiring Roles", text: "An open message to anyone seasoned in [Field/Domain] asking for thoughts on what skills matter most in the coming years." },
                  { label: "🚀 Career Transition Reflection", text: "An open reflection on transitioning from [Previous Field] into [Target Industry], asking fellow explorers about navigating early ambiguity." },
                  { label: "☕ Open Coffee Invitation", text: "An open invitation offering to connect for a casual virtual coffee with anyone interested in discussing [Topic of Interest]." },
                ] : [
                  { label: "☕ 15-Min Coffee Chat", text: "Reach out to ask for a brief 15-minute coffee chat about their career path in [Role/Field] and advice for someone transitioning into the space." },
                  { label: "🙏 Apology for Missed Chat", text: "Apologize for missing our scheduled coffee chat due to an unexpected scheduling conflict, briefly explain without over-groveling, and offer concrete windows to reschedule." },
                  { label: "💼 Role Advice & Perspective", text: "Ask for their perspective on the daily reality of [Specific Role] and what skills mattered most when they broke in." },
                  { label: "🤝 Warm Mutual Connection", text: "Mention our mutual connection [Colleague Name] who suggested I reach out, and ask for a quick chat regarding [Topic]." },
                ]).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAiPrompt(preset.text)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors border ${
                      isBottle 
                        ? 'bg-[#092235] hover:bg-[#0f344f] text-[#aed4ec] hover:text-[#f0f9ff] border-[#184261]' 
                        : 'bg-[#19130e] hover:bg-[#322419] text-[#c9b8a3] hover:text-[#fef9f3] border-[#3e2e21]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {aiError && (
              <div className="p-2.5 rounded-lg bg-[#3b1c1c] border border-[#7f2d2d] text-[#fca5a5] text-xs">
                {aiError}
              </div>
            )}

            {/* Advisor Feedback & Alternative Phrasing display when present */}
            {(mentorFeedback || alternativePhrasing) && (
              <div className={`p-3 rounded-lg space-y-2 text-xs border ${
                isBottle ? 'bg-[#051522] border-[#184261]' : 'bg-[#1c1611] border-[#453323]'
              }`}>
                {mentorFeedback && (
                  <div>
                    <span className={`font-semibold flex items-center gap-1.5 ${isBottle ? 'text-[#38bdf8]' : 'text-[#f5ebd7]'}`}>
                      💡 Mentor Note:
                    </span>
                    <p className={`mt-0.5 leading-relaxed ${isBottle ? 'text-[#c2dfef]' : 'text-[#c7b7a5]'}`}>{mentorFeedback}</p>
                  </div>
                )}
                {alternativePhrasing && (
                  <div className={`pt-1.5 border-t ${isBottle ? 'border-[#13324a]' : 'border-[#312317]'}`}>
                    <span className="font-semibold text-[#93c5fd]">Alternative Wording:</span>
                    <p className="text-[#a5c2d6] italic mt-0.5">"{alternativePhrasing}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Controls: Tone & Submit */}
            <div className={`flex flex-wrap items-center justify-between gap-3 pt-1 border-t ${
              isBottle ? 'border-[#153a57]' : 'border-[#34261c]'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${isBottle ? 'text-[#7ea5bd]' : 'text-[#a89684]'}`}>Desired Tone:</span>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${
                    isBottle 
                      ? 'bg-[#051421] border border-[#1b486c] text-[#d4e7f5] focus:border-[#38bdf8]' 
                      : 'bg-[#17120e] border border-[#48372b] text-[#ded0bf] focus:border-[#d97706]'
                  }`}
                >
                  <option value="concise & professional">Concise & Professional (Direct, respectful of time)</option>
                  <option value="warm & collegial">Warm & Collegial (Peer-to-peer, approachable)</option>
                  <option value="sincere & measured">Sincere & Measured (Accountable, no excessive groveling)</option>
                  <option value="inquisitive & thoughtful">Inquisitive & Thoughtful (Focused on craft/advice)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isAiLoading}
                  onClick={handleGenerateLetterWithAi}
                  className={`px-4 py-2 text-[#fef9f3] rounded-lg font-serif-vintage disabled:opacity-50 flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                    isBottle 
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:brightness-110 border border-[#38bdf8] shadow-[0_0_15px_rgba(2,132,199,0.4)]' 
                      : 'bg-[#8a3318] hover:bg-[#a64022] border border-[#b44828]'
                  }`}
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span className="text-xs font-semibold">
                    {isAiLoading ? 'Drafting Message...' : 'Generate Reach-out Draft'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* The Writing Parchment (Interactive Stationery Preview) */}
        {(() => {
          const paperTheme = getPaperThemeClasses(paperStyle);
          const effectiveInk = getAccessibleInk(paperStyle, inkColor);

          return (
            <div 
              className={`rounded-xl p-6 sm:p-8 paper-shadow border relative transition-colors duration-300 ${paperTheme.container}`}
            >
              {/* Top Header / Inscription Input */}
              <div className={`flex items-center justify-between mb-4 border-b pb-3 ${paperTheme.divider}`}>
                <input
                  type="text"
                  placeholder={isBottle ? "Inscription for the Voyager who unseals this..." : "Title or Opening Whisper (optional)..."}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`bg-transparent border-b border-dashed text-base sm:text-lg font-display font-semibold focus:outline-none w-full ${paperTheme.title}`}
                />
              </div>

              {/* Letter Textarea */}
              <textarea
                rows={8}
                placeholder={
                  deliveryMode === 'pigeon'
                    ? "Hi [Name],\n\nHope your week is going well. I've been following your work on [Project/Team] and wanted to reach out...\n(Feel free to write manually or use 'Draft / Advise Reach-out' above for mentor drafts!)"
                    : "Hello to whoever unseals this bottle on distant sands,\n\nI'm casting this into the tides in the hope of connecting with fellow practitioners or seekers in [Industry / Career Field]...\n(Feel free to write manually or use 'Draft / Advise Reach-out' above for mentor drafts!)"
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full bg-transparent resize-y focus:outline-none text-base leading-relaxed ${getFontClass(fontStyle)} ${paperTheme.body}`}
                style={{ color: effectiveInk }}
              />

              {/* Bottom Wax Seal Preview */}
              <div className={`mt-4 pt-4 border-t flex items-center justify-between ${paperTheme.divider}`}>
                <div className={`text-xs italic font-serif-vintage ${paperTheme.meta}`}>
                  {deliveryMode === 'pigeon' 
                    ? `Carrier pigeon route: ${selectedContact?.city || customRecipientCity || 'Distant Haven'}` 
                    : targetIndustry !== 'Open to All Professions'
                      ? `Drifting through tides targeted to: ${targetPosition ? `${targetPosition} (${targetIndustry})` : targetIndustry}`
                      : 'Drifting freely with global oceanic gyres'}
                </div>

                {/* Simulated Wax Seal Stamp */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-cinzel font-bold shadow-md transform hover:rotate-12 transition-transform cursor-pointer border border-white/20"
                  style={{ backgroundColor: sealColor }}
                  title="Wax seal will be stamped upon departure"
                >
                  {isBottle ? '🍾' : '🕊️'}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Stationery Controls Bar */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t text-xs ${
          isBottle ? 'border-[#15344a]' : 'border-[#382b20]'
        }`}>
          
          {/* Paper Type */}
          <div>
            <label className={`block mb-1 font-medium ${isBottle ? 'text-[#7ea5bd]' : 'text-[#a89582]'}`}>
              Paper Surface:
            </label>
            <select
              value={paperStyle}
              onChange={(e) => handlePaperStyleChange(e.target.value as PaperStyle)}
              className={`w-full rounded-lg px-2.5 py-1.5 focus:outline-none ${
                isBottle 
                  ? 'bg-[#091d2c] border border-[#184261] text-[#e0f2fe] focus:border-[#38bdf8]' 
                  : 'bg-[#191410] border border-[#3e3024] text-[#ded0bf] focus:border-[#d97706]'
              }`}
            >
              {isBottle && <option value="ocean-drift">Ocean Drift Vellum</option>}
              {isBottle && <option value="sea-mist">Sea Mist Pressed</option>}
              <option value="tea-stained">Tea-Stained Vellum</option>
              <option value="parchment">Aged Parchment</option>
              <option value="linen">Irish Linen</option>
              <option value="botanical-pressed">Pressed Botanical</option>
              <option value="midnight-vellum">Midnight Vellum</option>
              {!isBottle && <option value="ocean-drift">Ocean Drift Vellum</option>}
              {!isBottle && <option value="sea-mist">Sea Mist Pressed</option>}
            </select>
          </div>

          {/* Typography */}
          <div>
            <label className={`block mb-1 font-medium ${isBottle ? 'text-[#7ea5bd]' : 'text-[#a89582]'}`}>
              Handwriting Script:
            </label>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value as FontStyle)}
              className={`w-full rounded-lg px-2.5 py-1.5 focus:outline-none ${
                isBottle 
                  ? 'bg-[#091d2c] border border-[#184261] text-[#e0f2fe] focus:border-[#38bdf8]' 
                  : 'bg-[#191410] border border-[#3e3024] text-[#ded0bf] focus:border-[#d97706]'
              }`}
            >
              <option value="cursive">Cursive Quill (Caveat)</option>
              <option value="serif">Classical Monastic (Garamond)</option>
              <option value="typewriter">Mechanical (Courier Prime)</option>
            </select>
          </div>

          {/* Sealing Wax Color */}
          <div>
            <label className={`block mb-1 font-medium ${isBottle ? 'text-[#7ea5bd]' : 'text-[#a89582]'}`}>
              Sealing Wax:
            </label>
            <div className="flex items-center gap-1.5 py-1">
              {activeSealColors.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setSealColor(col.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    sealColor === col.hex ? 'scale-125 border-white shadow-md ring-1 ring-sky-300/50' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between mt-6 pt-4 border-t ${
          isBottle ? 'border-[#15344a]' : 'border-[#3b2e23]'
        }`}>
          <p className={`text-xs font-serif-vintage hidden sm:block ${isBottle ? 'text-[#7ea5bd]' : 'text-[#9d8975]'}`}>
            {deliveryMode === 'pigeon' 
              ? '🕊️ No read receipts. Pigeon arrival time is unknown.' 
              : targetIndustry !== 'Open to All Professions'
                ? `🌊 Drift filtered: Discoverable only by verified ${targetPosition ? `${targetPosition}s` : 'practitioners'} in ${targetIndustry}.`
                : '🌊 Any beachcomber across the world may discover this bottle.'}
          </p>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-serif-vintage transition-colors ${
                isBottle 
                  ? 'bg-[#091d2c] hover:bg-[#0f2e46] text-[#9fc0d4] hover:text-[#f0f9ff]' 
                  : 'bg-[#271f19] hover:bg-[#342921] text-[#c2b2a0]'
              }`}
            >
              Discard Draft
            </button>

            <button
              type="button"
              disabled={!content.trim() || isSealing}
              onClick={handleDispatch}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-serif-vintage font-bold tracking-wide shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer ${
                isBottle
                  ? 'bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0c4a6e] text-[#f0f9ff] border border-[#38bdf8] shadow-[0_0_25px_rgba(2,132,199,0.5)]'
                  : 'bg-gradient-to-r from-[#8a3318] to-[#5a1c0d] text-[#fef9f3] border border-[#b44828]'
              }`}
            >
              {isBottle ? <Waves className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{isBottle ? 'Seal Bottle & Cast to Tides' : 'Pour Wax & Dispatch'}</span>
            </button>
          </div>
        </div>

        {/* Wax Pouring & Sealing Overlay Ceremony */}
        {isSealing && (
          <div className={`absolute inset-0 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-6 z-30 ${
            isBottle ? 'bg-[#040e17]/95 text-[#f0f9ff]' : 'bg-[#171310]/95 text-[#ded0bf]'
          }`}>
            {sealingStep === 'pouring_wax' && (
              <div className="space-y-4 animate-pulse">
                <div 
                  className={`w-16 h-16 rounded-full mx-auto shadow-2xl animate-bounce border-2 ${
                    isBottle ? 'border-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.5)]' : 'border-amber-200/40'
                  }`}
                  style={{ backgroundColor: sealColor }}
                />
                <h3 className={`font-cinzel text-xl ${isBottle ? 'text-[#f0f9ff]' : 'text-[#f5ebd7]'}`}>
                  {isBottle ? 'Securing Bottle with Marine Seal...' : 'Pouring Warm Sealing Wax...'}
                </h3>
                <p className={`text-xs font-serif-vintage ${isBottle ? 'text-[#9fc0d4]' : 'text-[#a89582]'}`}>
                  {isBottle ? 'Sealing cork watertight against ocean breakers and salinity.' : 'Securing parchment with natural pine resin and beeswax.'}
                </p>
              </div>
            )}

            {sealingStep === 'stamped' && (
              <div className="space-y-4">
                <div 
                  className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-cinzel font-bold shadow-2xl border-4 ${
                    isBottle ? 'border-sky-200/60 shadow-[0_0_35px_rgba(56,189,248,0.6)]' : 'border-amber-200/40'
                  }`}
                  style={{ backgroundColor: sealColor }}
                >
                  {deliveryMode === 'bottle' ? '🍾' : '🕊️'}
                </div>
                <h3 className={`font-cinzel text-2xl ${isBottle ? 'text-[#f0f9ff]' : 'text-[#f5ebd7]'}`}>
                  {deliveryMode === 'bottle'
                    ? `Bottle Corked & Sealed`
                    : `Affixed with the Carrier Seal`}
                </h3>
                <p className={`text-sm font-serif-vintage ${isBottle ? 'text-[#bfe0f2]' : 'text-[#d4c5b4]'}`}>
                  {isBottle 
                    ? 'The wax seal has hardened against the brine. Preparing to cast.' 
                    : 'The seal has set firm into deep wax. Preparing for departure.'}
                </p>
              </div>
            )}

            {sealingStep === 'dispatched' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 rounded-full inline-block mx-auto text-3xl border ${
                  isBottle 
                    ? 'bg-[#0b283d] border-[#1b557b] text-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.4)]' 
                    : 'bg-[#3b2d22] border-[#5c4635] text-[#e0af68]'
                }`}>
                  {deliveryMode === 'pigeon' ? selectedClothingObj.icon : '🍾'}
                </div>
                <h3 className={`font-cinzel text-2xl ${isBottle ? 'text-[#f0f9ff]' : 'text-[#f5ebd7]'}`}>
                  {deliveryMode === 'pigeon' 
                    ? `Pigeon "${pigeonName}" Takes Flight` 
                    : `Cast Adrift in ${selectedGlassObj.name} Glass`}
                </h3>
                <p className={`text-sm font-serif-vintage max-w-md mx-auto leading-relaxed ${isBottle ? 'text-[#bfe0f2]' : 'text-[#d4c5b4]'}`}>
                  {deliveryMode === 'pigeon'
                    ? `Your homing pigeon "${pigeonName}" wearing ${selectedClothingObj.name} has departed toward ${selectedContact?.city || customRecipientCity || 'the horizon'}. May gentle winds guide its wings through shifting skies.`
                    : `The ${selectedGlassObj.name.toLowerCase()} glass bottle bobs into the tidal breakers, caught by the great oceanic gyres. When found, it will slip quietly from your map.`}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  </div>
);
};
