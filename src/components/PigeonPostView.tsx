import React, { useState } from 'react';
import { 
  Feather, 
  Wind, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Compass, 
  ChevronRight, 
  Plus, 
  Sparkles,
  CloudRain,
  Sun,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { PigeonFlight, Letter } from '../types';

interface PigeonPostViewProps {
  flights: PigeonFlight[];
  onOpenLetter: (letter: Letter, flight?: PigeonFlight) => void;
  onOpenWriteModal: () => void;
  onAdvanceDay: () => void;
}

export const PigeonPostView: React.FC<PigeonPostViewProps> = ({
  flights,
  onOpenLetter,
  onOpenWriteModal,
  onAdvanceDay,
}) => {
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(
    flights.find(f => f.status === 'in_flight')?.id || flights[0]?.id || null
  );

  const activeFlights = flights.filter(f => f.status === 'in_flight');
  const deliveredFlights = flights.filter(f => f.status === 'delivered');
  const lostFlights = flights.filter(f => f.status === 'lost');

  const selectedFlight = flights.find(f => f.id === selectedFlightId) || activeFlights[0] || flights[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: The Philosophy of Uncertainty */}
      <div className="bg-[#241c16] border border-[#48372a] rounded-2xl p-4 sm:p-6 text-[#ded0bf] paper-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-[#caa579] font-cinzel">
                Pigeon Mail Sanctuary
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-[#f5ebd7]">
              The Flight Through the Unknown
            </h2>
            <p className="text-xs sm:text-sm text-[#a89582] font-serif-vintage max-w-2xl leading-relaxed">
              When a pigeon takes flight, neither you nor the recipient knows the exact hour of arrival. 
              The bird navigates headwinds, river valleys, and mountain fog. There are no read receipts, 
              no online indicators, and no typing dots—only the patience of true correspondence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWriteModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a3318] to-[#6d2511] text-[#fef9f3] text-sm font-bold tracking-wide border border-[#b44828] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              <span>Send Letter with Pigeon</span>
            </button>
          </div>
        </div>

        {/* Minimalist Principles Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-[#3b2e23] text-xs font-serif-vintage text-[#a99885]">
          <div className="flex items-center gap-2">
            <span className="text-[#d97706]">✕</span>
            <span>No Read Receipts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#d97706]">✕</span>
            <span>No Online Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#d97706]">✕</span>
            <span>No Typing Dots</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#10b981]">✓</span>
            <span>Estimated Flight Arcs Only</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Flight Dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stylized Vintage Map & Flight Radar */}
        <div className="lg:col-span-7 bg-[#1c1612] border border-[#423427] rounded-2xl p-4 sm:p-6 text-[#ded0bf] paper-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#36291f] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d97706]" />
                <h3 className="font-cinzel text-base font-bold text-[#f5ebd7]">
                  Atmospheric Flight Corridor Map
                </h3>
              </div>
              <span className="text-xs text-[#8c7a69] font-serif-vintage italic">
                Cartography: Fog of Uncertainty
              </span>
            </div>

            {/* Stylized Vintage Map Canvas Representation */}
            <div className="relative w-full h-[320px] sm:h-[380px] bg-[#2b241c] rounded-xl border border-[#4d3e2f] overflow-hidden paper-shadow-deep">
              
              {/* Subtle Grid & Cartography Compass Rose */}
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(#caa579 0.75px, transparent 0.75px), linear-gradient(rgba(202, 165, 121, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(202, 165, 121, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Decorative Landmass Silhouettes (Stylized SVG contours) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {/* Abstract coastline contours */}
                <path
                  d="M -20,180 Q 80,120 180,200 T 360,160 T 540,240 T 720,180 L 720,400 L -20,400 Z"
                  fill="#1c1611"
                />
                <path
                  d="M 120,40 Q 240,20 340,90 T 500,60 T 660,110"
                  fill="none"
                  stroke="#caa579"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  opacity="0.3"
                />
                {/* Compass Rose in Corner */}
                <g transform="translate(60, 60)" opacity="0.4">
                  <circle cx="0" cy="0" r="28" stroke="#caa579" fill="none" strokeWidth="0.8" />
                  <line x1="0" y1="-34" x2="0" y2="34" stroke="#caa579" strokeWidth="1" />
                  <line x1="-34" y1="0" x2="34" y2="0" stroke="#caa579" strokeWidth="1" />
                  <text x="0" y="-38" textAnchor="middle" fill="#caa579" fontSize="9" fontFamily="serif">N</text>
                  <text x="0" y="47" textAnchor="middle" fill="#caa579" fontSize="9" fontFamily="serif">S</text>
                  <text x="42" y="3" textAnchor="middle" fill="#caa579" fontSize="9" fontFamily="serif">E</text>
                  <text x="-42" y="3" textAnchor="middle" fill="#caa579" fontSize="9" fontFamily="serif">W</text>
                </g>
              </svg>

              {/* Weather Phenomenon: Mountain Clouds / Rain squalls */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 text-[11px] text-[#e0af68] font-serif-vintage flex items-center gap-1.5 shadow-md">
                <Wind className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
                <span>North Sea Thermal Updraft (Passing Clouds)</span>
              </div>

              {/* Render Flight Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {flights.map((flight) => {
                  const isSelected = flight.id === selectedFlight?.id;
                  const x1 = (flight.originCoords.x / 100) * 100;
                  const y1 = (flight.originCoords.y / 100) * 100;
                  const x2 = (flight.destCoords.x / 100) * 100;
                  const y2 = (flight.destCoords.y / 100) * 100;
                  const midX = (x1 + x2) / 2 + 5;
                  const midY = (y1 + y2) / 2 - 12;

                  return (
                    <g key={flight.id}>
                      {/* Dotted Arch Flight Corridor */}
                      <path
                        d={`M ${x1}%,${y1}% Q ${midX}%,${midY}% ${x2}%,${y2}%`}
                        fill="none"
                        stroke={flight.status === 'delivered' ? '#10b981' : flight.status === 'lost' ? '#ef4444' : '#d97706'}
                        strokeWidth={isSelected ? 3 : 1.5}
                        strokeDasharray="4 5"
                        opacity={isSelected ? 0.9 : 0.4}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Render Pigeon Position Marker for Selected Flight */}
              {selectedFlight && selectedFlight.status === 'in_flight' && (
                <div 
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  style={{
                    left: `${selectedFlight.originCoords.x + (selectedFlight.destCoords.x - selectedFlight.originCoords.x) * (selectedFlight.progressPercent / 100)}%`,
                    top: `${selectedFlight.originCoords.y + (selectedFlight.destCoords.y - selectedFlight.originCoords.y) * (selectedFlight.progressPercent / 100) - 8}%`,
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#d97706] text-[#1a1511] flex items-center justify-center shadow-2xl border-2 border-white animate-bounce">
                    <Feather className="w-4 h-4 transform -rotate-45" />
                  </div>
                  <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#1b1511] border border-[#524132] px-2.5 py-1 rounded-md text-[10px] whitespace-nowrap text-[#f5ebd7] font-serif-vintage shadow-lg">
                    {selectedFlight.recipient} · {selectedFlight.currentZoneName}
                  </div>
                </div>
              )}

              {/* Waypoints Rendered on Map for Selected Flight */}
              {selectedFlight?.waypoints?.map((wp) => (
                <div
                  key={wp.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${wp.coords.x}%`, top: `${wp.coords.y}%` }}
                  title={`${wp.locationName}: ${wp.description}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ca8a04] border border-black shadow" />
                </div>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 bg-[#17130f]/80 backdrop-blur-sm border border-[#3e3024] px-2.5 py-1.5 rounded-lg text-[10px] font-serif-vintage text-[#a99885] space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-0.5 bg-[#d97706]" />
                  <span>In Flight (Approximate path)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-0.5 bg-[#10b981]" />
                  <span>Delivered to Roost</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Flight Waypoint Timeline */}
          {selectedFlight && (
            <div className="mt-4 pt-3 border-t border-[#34281e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#f5ebd7] font-serif-vintage">
                  Chronicle Waypoints: {selectedFlight.recipient}
                </span>
                <span className="text-[11px] text-[#caa579] font-mono">
                  {selectedFlight.status === 'in_flight' 
                    ? `Day ${selectedFlight.currentDay} in transit` 
                    : selectedFlight.status === 'delivered' ? 'Delivered safely' : 'Lost to the mist'}
                </span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {selectedFlight.waypoints.map((wp) => (
                  <div 
                    key={wp.id}
                    className="p-2 rounded-lg bg-[#241c16] border border-[#382b20] text-xs flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[#e4d6c6]">
                        <span className="font-bold">{wp.locationName}</span>
                        <span className="text-[10px] text-[#8e7a68]">{wp.date}</span>
                      </div>
                      <p className="text-[#a99885] italic font-serif-vintage text-[11px] mt-0.5">
                        {wp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pigeon Flights Roster */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active In-Flight Section */}
          <div className="bg-[#1f1813] border border-[#453629] rounded-2xl p-4 sm:p-5 text-[#ded0bf] paper-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-[#362a20] pb-2.5">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#d97706]" />
                <h3 className="font-cinzel text-sm font-bold text-[#f5ebd7]">
                  Pigeons in Flight ({activeFlights.length})
                </h3>
              </div>
              <button
                onClick={onAdvanceDay}
                className="text-xs text-[#ca8a04] hover:underline font-serif-vintage"
                title="Advance simulation by 1 day"
              >
                + Let Skies Advance 1 Day
              </button>
            </div>

            {activeFlights.length === 0 ? (
              <div className="text-center py-8 text-xs font-serif-vintage text-[#8c7967] space-y-2">
                <p>No pigeons currently winging through the skies.</p>
                <button
                  onClick={onOpenWriteModal}
                  className="px-3 py-1.5 rounded-lg bg-[#3b2d22] text-[#f5ebd7] hover:bg-[#4a392b] transition-colors"
                >
                  Dispatch a New Carrier Pigeon
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeFlights.map((flight) => (
                  <div
                    key={flight.id}
                    onClick={() => setSelectedFlightId(flight.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedFlightId === flight.id
                        ? 'bg-[#2e231b] border-[#d97706] shadow-md'
                        : 'bg-[#241c16] border-[#382b20] hover:bg-[#2a2019]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-bold text-sm text-[#f5ebd7] font-serif-vintage">
                        To: {flight.recipient}
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#3a2c20] text-[#e0af68] border border-[#523e2d]">
                        Day {flight.currentDay} (Est. {flight.estimatedMinDays}–{flight.estimatedMaxDays}d)
                      </span>
                    </div>

                    <p className="text-xs text-[#a99885] italic font-serif-vintage mb-2">
                      Current zone: {flight.currentZoneName}
                    </p>

                    {/* Progress corridor bar */}
                    <div className="w-full bg-[#18120e] rounded-full h-1.5 overflow-hidden border border-[#3b2d22]">
                      <div 
                        className="bg-gradient-to-r from-[#b45309] to-[#d97706] h-full rounded-full transition-all duration-500"
                        style={{ width: `${flight.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#31251c] text-[11px] text-[#8e7a68]">
                      <span>Destination: {flight.destinationName}</span>
                      <span className="text-[#caa579]">View on map →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivered Dispatches (Windowsill Roost) */}
          <div className="bg-[#1f1813] border border-[#453629] rounded-2xl p-4 sm:p-5 text-[#ded0bf] paper-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-[#362a20] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <h3 className="font-cinzel text-sm font-bold text-[#f5ebd7]">
                  Delivered to Windowsills ({deliveredFlights.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {deliveredFlights.map((flight) => (
                <div
                  key={flight.id}
                  onClick={() => onOpenLetter(flight.letter, flight)}
                  className="p-3 rounded-xl bg-[#241c16] hover:bg-[#2d221a] border border-[#3c2f23] cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1e291e] border border-[#2d4a2d] text-[#4ade80] flex items-center justify-center shrink-0">
                      <Feather className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#f5ebd7] group-hover:text-[#e0af68] transition-colors">
                        {flight.letter.title || 'Folded Dispatch'}
                      </div>
                      <div className="text-[11px] text-[#9a8674] font-serif-vintage">
                        From {flight.sender} · Delivered in {flight.actualDurationDays} days
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#7d6856] group-hover:text-[#f5ebd7] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Lost in Fog Memorial */}
          {lostFlights.length > 0 && (
            <div className="bg-[#211614] border border-[#4a2622] rounded-2xl p-4 text-[#ded0bf]">
              <div className="flex items-center gap-2 mb-2 text-[#f87171]">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider">
                  Claimed by the Mountain Mist ({lostFlights.length})
                </h3>
              </div>
              <p className="text-xs text-[#b89591] font-serif-vintage leading-relaxed">
                Some pigeons meet impenetrable cloud ceilings or choose wild nests in ancient cliffs. 
                Their dispatches remain part of the landscape's secrets.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
