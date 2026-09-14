import React, { useState } from 'react';
import { 
  Bell, 
  Feather, 
  Waves, 
  CheckCircle2, 
  Reply, 
  Eye, 
  Clock, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { LetterNotification, Letter, PigeonFlight, DriftBottle } from '../types';

interface NotificationsFeedProps {
  notifications: LetterNotification[];
  letters: Letter[];
  flights: PigeonFlight[];
  bottles: DriftBottle[];
  onOpenLetter: (letter: Letter, flight?: PigeonFlight, bottle?: DriftBottle) => void;
  onReplyToPigeon: (letter: Letter) => void;
  onMarkNotificationRead: (id: string) => void;
}

export const NotificationsFeed: React.FC<NotificationsFeedProps> = ({
  notifications,
  letters,
  flights,
  bottles,
  onOpenLetter,
  onReplyToPigeon,
  onMarkNotificationRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'received' | 'delivered' | 'bottles'>('all');

  // Filter list
  const filteredNotifs = notifications.filter(n => {
    if (filter === 'received') return n.type === 'letter_received';
    if (filter === 'delivered') return n.type === 'letter_delivered';
    if (filter === 'bottles') return n.type === 'bottle_found' || n.type === 'bottle_washed_up';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notif: LetterNotification) => {
    onMarkNotificationRead(notif.id);
    
    // Find associated letter
    if (notif.letterId) {
      const letter = letters.find(l => l.id === notif.letterId);
      const flight = flights.find(f => f.id === notif.flightId);
      const bottle = bottles.find(b => b.id === notif.bottleId);
      if (letter) {
        onOpenLetter(letter, flight, bottle);
      }
    }
  };

  const handleReplyClick = (e: React.MouseEvent, notif: LetterNotification) => {
    e.stopPropagation();
    onMarkNotificationRead(notif.id);
    if (notif.letterId) {
      const letter = letters.find(l => l.id === notif.letterId);
      if (letter) {
        onReplyToPigeon(letter);
      }
    }
  };

  return (
    <div className="bg-[#181410] border border-[#3d2f23] rounded-2xl p-4 sm:p-6 text-[#ded0bf] shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#30241a] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2e2117] border border-[#4e3726] flex items-center justify-center text-[#f59e0b]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-lg font-bold text-[#f5ebd7]">
                Dispatch & Tide Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#8a3318] text-[#fef3c7] text-[10px] font-bold font-mono">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-[#9d8975] font-serif-vintage">
              Notices of letters received by pigeon, your deliveries touched down, or bottles washed ashore.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#120e0a] p-1 rounded-xl border border-[#2b2016] text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'all'
                ? 'bg-[#3d2d1f] text-[#fef9f3] font-bold shadow'
                : 'text-[#8e7a68] hover:text-[#ded0bf]'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'received'
                ? 'bg-[#3d2d1f] text-[#fef9f3] font-bold shadow'
                : 'text-[#8e7a68] hover:text-[#ded0bf]'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'delivered'
                ? 'bg-[#3d2d1f] text-[#fef9f3] font-bold shadow'
                : 'text-[#8e7a68] hover:text-[#ded0bf]'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter('bottles')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'bottles'
                ? 'bg-[#3d2d1f] text-[#fef9f3] font-bold shadow'
                : 'text-[#8e7a68] hover:text-[#ded0bf]'
            }`}
          >
            Bottles
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl bg-[#130f0c] border border-dashed border-[#2d2218]">
            <Inbox className="w-8 h-8 text-[#5c4636] mx-auto mb-2" />
            <p className="text-sm font-serif-vintage text-[#8c7766]">
              No notifications yet in this log.
            </p>
            <p className="text-xs text-[#5f5043] font-serif-vintage mt-1">
              Advance simulation days or dispatch new letters to witness pigeons and tide dispatches arrive.
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const isPigeonReceived = notif.type === 'letter_received';
            const isDelivered = notif.type === 'letter_delivered';
            const isBottleEvent = notif.type === 'bottle_found' || notif.type === 'bottle_washed_up';

            const letter = notif.letterId ? letters.find(l => l.id === notif.letterId) : undefined;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  !notif.isRead
                    ? 'bg-[#251b14] border-[#8a4e23] shadow-md hover:bg-[#2c2017]'
                    : 'bg-[#1a1410] border-[#31251c] text-[#a89582] hover:bg-[#201813]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isPigeonReceived
                        ? 'bg-[#451a03] border border-[#b45309] text-[#fde68a]'
                        : isDelivered
                        ? 'bg-[#064e3b] border border-[#059669] text-[#a7f3d0]'
                        : 'bg-[#0c2e3d] border border-[#0284c7] text-[#bae6fd]'
                    }`}
                  >
                    {isBottleEvent ? (
                      <Waves className="w-4 h-4" />
                    ) : (
                      <Feather className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-vintage font-bold text-sm text-[#f5ebd7]">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                      )}
                    </div>
                    <p className="text-xs text-[#c4b3a1] font-serif-vintage mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#7d6a59] font-mono">
                      <span>{notif.timestamp}</span>
                      {isPigeonReceived && (
                        <span className="text-[#34d399] font-serif-vintage font-bold">
                          • Direct reply enabled
                        </span>
                      )}
                      {isBottleEvent && (
                        <span className="text-[#67e8f9] font-serif-vintage italic">
                          • Tide scroll (reply disabled)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                  {/* Read letter button if letter exists */}
                  {letter && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notif);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b2017] hover:bg-[#3a2c20] text-xs font-serif-vintage text-[#f5ebd7] border border-[#483526] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#e0af68]" />
                      <span>Read Letter</span>
                    </button>
                  )}

                  {/* Reply button ONLY for pigeon received letters */}
                  {isPigeonReceived && letter && (
                    <button
                      type="button"
                      onClick={(e) => handleReplyClick(e, notif)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8a3318] hover:bg-[#a13c1d] text-xs font-serif-vintage font-bold text-[#fef9f3] shadow-sm transition-all active:scale-95"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply by Pigeon</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
