import React, { useState } from 'react';
import { 
  BookOpen, 
  Feather, 
  Waves, 
  Calendar, 
  MapPin, 
  Clock, 
  Compass, 
  Stamp, 
  ChevronRight, 
  X,
  Sparkles
} from 'lucide-react';
import { NotableStory, PostalStamp } from '../types';
import { NOTABLE_STORIES, POSTAL_STAMPS } from '../simulation/constants';
import { playWaxSealThud } from '../utils/ambientAudio';

interface NotableStoriesViewProps {
  onOpenWriteModal: () => void;
}

export const NotableStoriesView: React.FC<NotableStoriesViewProps> = ({
  onOpenWriteModal,
}) => {
  const [stories, setStories] = useState<NotableStory[]>(NOTABLE_STORIES);
  const [selectedStory, setSelectedStory] = useState<NotableStory | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'bottle' | 'pigeon'>('all');

  const handleApplaudWithStamp = (storyId: string) => {
    playWaxSealThud();
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return { ...s, reactionsCount: s.reactionsCount + 1 };
      }
      return s;
    }));
  };

  const filteredStories = stories.filter(s => {
    if (filterMode === 'all') return true;
    return s.type === filterMode;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#241c16] border border-[#48372a] rounded-2xl p-4 sm:p-6 text-[#ded0bf] paper-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#e0af68]" />
              <span className="text-xs uppercase tracking-widest text-[#caa579] font-cinzel">
                Chronicles of Drift & Flight
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-[#f5ebd7] mt-1">
              Remarkable Stories of the Open Elements
            </h2>
            <p className="text-xs sm:text-sm text-[#ab9885] font-serif-vintage max-w-2xl leading-relaxed mt-0.5">
              Over seasons and decades, certain dispatches acquire legendary status. Bottles that crossed 
              entire oceanic hemispheres, and homing birds that weathered monsoons to roost upon distant 
              windowsills.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#17120e] p-1 rounded-xl border border-[#382b1f]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage transition-colors ${
                filterMode === 'all' ? 'bg-[#3b2d22] text-[#f5ebd7] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              All Chronicles
            </button>
            <button
              onClick={() => setFilterMode('bottle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage transition-colors ${
                filterMode === 'bottle' ? 'bg-[#153e4f] text-[#67e8f9] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Ocean Drift (Bottles)
            </button>
            <button
              onClick={() => setFilterMode('pigeon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif-vintage transition-colors ${
                filterMode === 'pigeon' ? 'bg-[#3b2c21] text-[#fed7aa] font-bold shadow' : 'text-[#8e7a68] hover:text-[#d6c5b2]'
              }`}
            >
              Pigeon Flights
            </button>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="bg-[#1e1713] border border-[#433224] rounded-2xl p-5 cursor-pointer hover:border-[#caa579] transition-all paper-shadow flex flex-col justify-between group"
          >
            <div>
              {/* Type Badge & Provenance */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 ${
                  story.type === 'bottle' 
                    ? 'bg-[#122c38] text-[#7dd3fc] border border-[#1b4e63]' 
                    : 'bg-[#38261a] text-[#fed7aa] border border-[#593d2b]'
                }`}>
                  {story.type === 'bottle' ? <Waves className="w-3 h-3" /> : <Feather className="w-3 h-3" />}
                  <span>{story.type === 'bottle' ? 'Ocean Bottle Drift' : 'Carrier Pigeon Legend'}</span>
                </span>

                <span className="text-xs text-[#8e7a68] font-mono">
                  {story.duration}
                </span>
              </div>

              {/* Title & Route */}
              <h3 className="font-display font-bold text-lg text-[#f5ebd7] group-hover:text-[#e0af68] transition-colors mb-1">
                {story.title}
              </h3>
              <p className="text-xs text-[#caa579] font-serif-vintage mb-3 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#d97706]" />
                <span>{story.route}</span>
              </p>

              {/* Excerpt */}
              <p className="text-xs text-[#c4b3a1] font-serif-vintage leading-relaxed line-clamp-4 italic">
                “{story.summary}”
              </p>
            </div>

            {/* Keepsake & Reactions */}
            <div className="mt-5 pt-3 border-t border-[#312317] flex items-center justify-between text-xs">
              <div className="text-[#a99885] font-serif-vintage text-[11px]">
                {story.keepsakeFound ? `✦ Artifact: ${story.keepsakeFound}` : '✦ Parchment only'}
              </div>

              <div className="flex items-center gap-1 text-[#caa579]">
                <Stamp className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">{story.reactionsCount} seals</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Story Reading Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="bg-[#211a14] border border-[#48372a] rounded-2xl max-w-2xl w-full p-6 text-[#ded0bf] paper-shadow-deep relative my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#36271c] mb-4">
              <div className="flex items-center gap-2 text-[#e0af68]">
                {selectedStory.type === 'bottle' ? <Waves className="w-5 h-5" /> : <Feather className="w-5 h-5" />}
                <span className="text-xs uppercase tracking-wider font-cinzel font-bold">
                  Public Archive Chronicle
                </span>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="p-1 rounded-lg text-[#8e7a68] hover:text-[#f5ebd7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-display font-bold text-2xl text-[#f5ebd7] mb-2">
              {selectedStory.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#caa579] font-serif-vintage mb-4 pb-3 border-b border-[#34261c]">
              <span>Route: {selectedStory.route}</span>
              <span>•</span>
              <span>Time in Transit: {selectedStory.duration}</span>
              <span>•</span>
              <span>Date Recorded: {selectedStory.date}</span>
            </div>

            <div className="font-serif-vintage text-sm leading-relaxed text-[#ded0bf] whitespace-pre-wrap space-y-3 bg-[#19130e] p-5 rounded-xl border border-[#3b2d20]">
              <p>{selectedStory.summary}</p>
              {selectedStory.keepsakeFound && (
                <div className="pt-3 border-t border-[#31241a] text-xs text-[#a5f3fc]">
                  ✦ Recovered Artifact: <span className="font-bold">{selectedStory.keepsakeFound}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#36271c]">
              <button
                onClick={() => handleApplaudWithStamp(selectedStory.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3b2d22] text-[#f5ebd7] text-xs font-serif-vintage hover:bg-[#4d3a2c] transition-colors"
              >
                <Stamp className="w-4 h-4 text-[#d97706]" />
                <span>Affix Commemorative Seal ({selectedStory.reactionsCount})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStory(null);
                  onOpenWriteModal();
                }}
                className="px-4 py-2 rounded-xl bg-[#8a3318] hover:bg-[#a13c1d] text-[#fef9f3] text-xs font-serif-vintage font-bold shadow transition-all"
              >
                Compose a Letter of Your Own
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
