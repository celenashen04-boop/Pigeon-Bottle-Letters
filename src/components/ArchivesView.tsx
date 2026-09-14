import React, { useState } from 'react';
import { 
  Archive, 
  Feather, 
  Waves, 
  Sparkles, 
  Clock, 
  User, 
  ChevronRight, 
  BookOpen, 
  Loader2,
  Calendar,
  Stamp
} from 'lucide-react';
import { Letter, UserContact } from '../types';
import { DEFAULT_CONTACTS } from '../simulation/constants';

interface ArchivesViewProps {
  letters: Letter[];
  onOpenLetter: (letter: Letter) => void;
  onOpenWriteModal: (mode?: 'pigeon' | 'bottle') => void;
}

export const ArchivesView: React.FC<ArchivesViewProps> = ({
  letters,
  onOpenLetter,
  onOpenWriteModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'received' | 'bottles' | 'sent' | 'penpals'>('received');
  const [selectedContactForSummary, setSelectedContactForSummary] = useState<UserContact | null>(DEFAULT_CONTACTS[0]);

  // AI states
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [correspondenceSummary, setCorrespondenceSummary] = useState<{
    title: string;
    epistolarySummary: string;
    keyThemes: string[];
    emotionalArc: string;
  } | null>(null);

  const receivedPigeonLetters = letters.filter(l => l.deliveryMode === 'pigeon' && l.author !== 'You');
  const rescuedBottles = letters.filter(l => l.deliveryMode === 'bottle' && l.author !== 'You');
  const sentLetters = letters.filter(l => l.author === 'You');

  const handleGenerateCorrespondenceSummary = async (contact: UserContact) => {
    setIsSummarizing(true);
    try {
      const contactLetters = letters.filter(l => l.author === contact.name || l.recipient === contact.name);
      const res = await fetch('/api/ai/correspondence-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correspondents: `You and ${contact.name} (${contact.city})`,
          letters: contactLetters.map(l => ({
            title: l.title,
            author: l.author,
            date: l.dateCreated,
            content: l.content.slice(0, 300),
          })),
        }),
      });
      const data = await res.json();
      setCorrespondenceSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#241c16] border border-[#48372a] rounded-2xl p-4 sm:p-6 text-[#ded0bf] paper-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs uppercase tracking-widest text-[#fcd34d] font-cinzel">
                The Epistolary Archive
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-[#f5ebd7] mt-1">
              Wooden Desk Drawers & Personal Letters
            </h2>
            <p className="text-xs sm:text-sm text-[#ab9784] font-serif-vintage max-w-2xl leading-relaxed mt-0.5">
              Every parchment that survived headwinds, salt brine, and passing seasons is preserved here. 
              Read old dispatches at leisure, revisit found keepsakes, or consult the AI Historian for 
              long-running correspondence chronicles.
            </p>
          </div>

          {/* Sub-tab Switchers */}
          <div className="flex items-center gap-1.5 bg-[#17120e] p-1 rounded-xl border border-[#382b1f] overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('received')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage whitespace-nowrap transition-colors ${
                activeSubTab === 'received' ? 'bg-[#3b2d22] text-[#f5ebd7] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Pigeon Mail ({receivedPigeonLetters.length})
            </button>
            <button
              onClick={() => setActiveSubTab('bottles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage whitespace-nowrap transition-colors ${
                activeSubTab === 'bottles' ? 'bg-[#153e4f] text-[#67e8f9] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Found Bottles ({rescuedBottles.length})
            </button>
            <button
              onClick={() => setActiveSubTab('sent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage whitespace-nowrap transition-colors ${
                activeSubTab === 'sent' ? 'bg-[#3b2d22] text-[#f5ebd7] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Sent Dispatches ({sentLetters.length})
            </button>
            <button
              onClick={() => setActiveSubTab('penpals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage whitespace-nowrap transition-colors ${
                activeSubTab === 'penpals' ? 'bg-[#4a2e1c] text-[#fed7aa] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Pen-Pal Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'received' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receivedPigeonLetters.map((l) => (
            <div
              key={l.id}
              onClick={() => onOpenLetter(l)}
              className="bg-[#1f1712] border border-[#433224] rounded-xl p-5 cursor-pointer hover:border-[#d97706] transition-all paper-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-full bg-[#34261c] text-[#caa579]">
                    {l.dateCreated}
                  </span>
                  <div 
                    className="w-4 h-4 rounded-full border border-black" 
                    style={{ backgroundColor: l.sealColor }} 
                    title="Intact wax seal"
                  />
                </div>

                <h3 className="font-display font-bold text-lg text-[#f5ebd7] group-hover:text-[#e0af68] transition-colors mb-1">
                  {l.title || 'Folded Letter'}
                </h3>
                <p className="text-xs text-[#a99885] italic font-serif-vintage mb-3">
                  Penned by {l.author}
                </p>

                <p className="text-xs text-[#c4b3a1] font-serif-vintage line-clamp-3 leading-relaxed">
                  {l.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#312317] flex items-center justify-between text-xs text-[#8e7a68]">
                <span>{l.stamps?.length || 0} stamp affixed</span>
                <span className="text-[#caa579] font-serif-vintage">Unfold letter →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'bottles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rescuedBottles.map((l) => (
            <div
              key={l.id}
              onClick={() => onOpenLetter(l)}
              className="bg-[#121c24] border border-[#223645] rounded-xl p-5 cursor-pointer hover:border-[#06b6d4] transition-all paper-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-full bg-[#1b2a36] text-[#7dd3fc]">
                    Washed Ashore · {l.dateCreated}
                  </span>
                  <Waves className="w-4 h-4 text-[#06b6d4]" />
                </div>

                <h3 className="font-display font-bold text-lg text-[#f0f9ff] group-hover:text-[#67e8f9] transition-colors mb-1">
                  {l.title || 'Rescued Ocean Scroll'}
                </h3>
                <p className="text-xs text-[#88a9bc] italic font-serif-vintage mb-3">
                  {l.isAnonymous ? 'An Anonymous Stranger' : `Penned by ${l.author}`}
                </p>

                <p className="text-xs text-[#b8d2e0] font-serif-vintage line-clamp-3 leading-relaxed">
                  {l.content}
                </p>
              </div>

              {l.keepsake && (
                <div className="mt-3 p-2 rounded-lg bg-[#0e1921] border border-[#1b3240] text-[11px] text-[#7dd3fc] font-serif-vintage">
                  ✦ Enclosed: {l.keepsake.name}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-[#1d303d] flex items-center justify-between text-xs text-[#628599]">
                <span>Saltwater provenance</span>
                <span className="text-[#38bdf8] font-serif-vintage">Read scroll →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'sent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sentLetters.map((l) => (
            <div
              key={l.id}
              onClick={() => onOpenLetter(l)}
              className="bg-[#1f1712] border border-[#433224] rounded-xl p-5 cursor-pointer hover:border-[#caa579] transition-all paper-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-full bg-[#34261c] text-[#caa579]">
                    {l.deliveryMode === 'pigeon' ? 'Pigeon Mail' : 'Ocean Drift'}
                  </span>
                  <span className="text-[11px] text-[#8e7a68]">{l.dateCreated}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#f5ebd7] group-hover:text-[#e0af68] transition-colors mb-1">
                  {l.title || 'Dispatched Letter'}
                </h3>
                <p className="text-xs text-[#a99885] italic font-serif-vintage mb-3">
                  To: {l.recipient}
                </p>

                <p className="text-xs text-[#c4b3a1] font-serif-vintage line-clamp-3 leading-relaxed">
                  {l.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#312317] flex items-center justify-between text-xs text-[#8e7a68]">
                <span>Author: You</span>
                <span className="text-[#caa579] font-serif-vintage">Inspect archive →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'penpals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pen Pal Directory */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-cinzel text-sm font-bold text-[#f5ebd7]">
              Known Pen-Pals & Epistolary Bonds
            </h3>

            {DEFAULT_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContactForSummary(contact)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedContactForSummary?.id === contact.id
                    ? 'bg-[#2f2218] border-[#d97706] shadow-md'
                    : 'bg-[#1f1712] border-[#3d2e20] hover:bg-[#271d15]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3d2c1f] border border-[#5c4330] flex items-center justify-center text-sm font-cinzel font-bold text-[#f5ebd7]">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#f5ebd7]">{contact.name}</h4>
                    <p className="text-xs text-[#a99885] font-serif-vintage">
                      {contact.city}, {contact.region} · {contact.relation}
                    </p>
                    <span className="text-[11px] text-[#caa579] font-serif-vintage">
                      {contact.lettersExchanged} letters exchanged (Last: {contact.lastLetterDate})
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#8a7563]" />
              </div>
            ))}
          </div>

          {/* AI Correspondence Historian Panel */}
          <div className="lg:col-span-6 bg-[#1b1511] border border-[#433224] rounded-2xl p-5 text-[#ded0bf] paper-shadow">
            <div className="flex items-center justify-between mb-4 border-b border-[#36271c] pb-3">
              <div className="flex items-center gap-2 text-[#e0af68]">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-cinzel text-sm font-bold text-[#f5ebd7]">
                  Gemini Correspondence Historian
                </h3>
              </div>
              {selectedContactForSummary && (
                <button
                  onClick={() => handleGenerateCorrespondenceSummary(selectedContactForSummary)}
                  disabled={isSummarizing}
                  className="px-3 py-1 bg-[#8a3318] hover:bg-[#a64022] text-[#fef9f3] rounded-lg text-xs font-serif-vintage disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>Summarize Chronicle</span>
                </button>
              )}
            </div>

            {selectedContactForSummary ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-[#f5ebd7] font-display">
                    Dialogue with {selectedContactForSummary.name}
                  </h4>
                  <p className="text-xs text-[#8e7a68] font-serif-vintage">
                    Stationed in {selectedContactForSummary.city} ({selectedContactForSummary.region})
                  </p>
                </div>

                {correspondenceSummary ? (
                  <div className="space-y-3 animate-fadeIn text-xs font-serif-vintage">
                    <div className="p-3.5 rounded-xl bg-[#241c16] border border-[#48372a]">
                      <span className="text-[11px] uppercase tracking-wider text-[#caa579] font-bold block mb-1">
                        {correspondenceSummary.title}
                      </span>
                      <p className="text-[#e2d5c5] leading-relaxed italic whitespace-pre-wrap">
                        {correspondenceSummary.epistolarySummary}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#241c16] border border-[#48372a]">
                      <span className="text-[11px] uppercase tracking-wider text-[#caa579] font-bold block mb-1">
                        Emotional Arc of the Bond
                      </span>
                      <p className="text-[#c4b3a1]">{correspondenceSummary.emotionalArc}</p>
                    </div>

                    {correspondenceSummary.keyThemes && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {correspondenceSummary.keyThemes.map((th, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-[#2d2219] text-[#caa579] text-[10px] border border-[#453426]">
                            ✦ {th}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs font-serif-vintage text-[#8c7967] space-y-2">
                    <BookOpen className="w-8 h-8 text-[#5c4736] mx-auto" />
                    <p>Click "Summarize Chronicle" to synthesize your letters with {selectedContactForSummary.name} into an evocative retrospective.</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#8e7a68] font-serif-vintage">
                Select a pen-pal from the left to explore your correspondence history.
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
