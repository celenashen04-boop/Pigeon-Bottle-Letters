export type DeliveryMode = 'pigeon' | 'bottle';

export type PaperStyle = 
  | 'parchment' 
  | 'tea-stained' 
  | 'linen' 
  | 'midnight-vellum' 
  | 'botanical-pressed'
  | 'ocean-drift'
  | 'sea-mist';

export type FontStyle = 'cursive' | 'serif' | 'typewriter';

export interface KeepsakeItem {
  id: string;
  name: string;
  type: 'sea_glass' | 'pressed_fern' | 'seashell' | 'pine_needle' | 'copper_coin' | 'lavender';
  lore: string;
}

export interface PostalStamp {
  id: string;
  name: string;
  denomination: string;
  theme: string;
  color: string;
  iconName: string;
  quote: string;
}

export interface StampReaction {
  id: string;
  stampId: string;
  stampName: string;
  addedBy: string;
  addedAt: string;
  note?: string;
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  author: string;
  authorCompany?: string;
  authorPosition?: string;
  recipient?: string;
  recipientCompany?: string;
  recipientPosition?: string;
  recipientLocation?: string;
  dateCreated: string;
  paperStyle: PaperStyle;
  fontStyle: FontStyle;
  sealColor: string;
  inkColor: string;
  borderStyle: 'flourish' | 'deckled' | 'celestial' | 'minimal-rule';
  deliveryMode: DeliveryMode;
  keepsake?: KeepsakeItem;
  stamps: PostalStamp[];
  reactions: StampReaction[];
  isRead: boolean;
  isArchived: boolean;
  isAnonymous?: boolean;
  // Professional targeting for Ocean Bottles
  targetIndustry?: string;
  targetPosition?: string;
  discoveredByPosition?: string;
  discoveredByCompany?: string;
}

export interface Waypoint {
  id: string;
  locationName: string;
  date: string;
  description: string;
  weatherCondition: string;
  coords: { x: number; y: number }; // Percentage 0-100 on stylized map
}

export interface PigeonClothing {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface BottleGlassColor {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export interface WaxInsignia {
  id: string;
  name: string;
  symbol: string;
  lore: string;
}

export interface LetterNotification {
  id: string;
  type: 'letter_delivered' | 'bottle_washed_up' | 'letter_received';
  title: string;
  message: string;
  timestamp: string;
  dateNumber: number;
  letterId: string;
  flightId?: string;
  bottleId?: string;
  isRead?: boolean;
}

export interface PigeonFlight {
  id: string;
  letterId: string;
  letter: Letter;
  sender: string;
  recipient: string;
  recipientCompany?: string;
  recipientPosition?: string;
  originName: string;
  destinationName: string;
  originCoords: { x: number; y: number }; // 0-100 on map
  destCoords: { x: number; y: number };
  status: 'in_flight' | 'delivered' | 'lost' | 'resting';
  dispatchedAt: number; // timestamp
  estimatedMinDays: number;
  estimatedMaxDays: number;
  actualDurationDays: number;
  currentDay: number;
  progressPercent: number;
  currentZoneName: string;
  weatherHistory: string[];
  waypoints: Waypoint[];
  flywayName: string;
  riskOfLoss: number; // 0.05 to 0.20
  hasArrivedNoticeDismissed?: boolean;
  pigeonName?: string;
  pigeonClothes?: string;
}

export interface DriftBottle {
  id: string;
  letterId: string;
  letter: Letter;
  senderName: string;
  isAnonymous: boolean;
  originCoast: string;
  originCoords: { x: number; y: number };
  currentCoords: { x: number; y: number };
  currentOceanRegion: string;
  oceanCurrentName: string;
  status: 'drifting' | 'stranded' | 'discovered' | 'lost_in_gyre';
  releasedAt: number; // timestamp
  daysAdrift: number;
  nauticalMilesTravelled: number;
  discoveredAt?: number;
  discoveredBy?: string;
  discoveredByPosition?: string;
  discoveredByCompany?: string;
  discoveredLocation?: string;
  repliesCount: number;
  journalEntries: string[];
  bottleColor?: string;
  bottleSealColor?: string;
  bottleSealInsignia?: string;
  isTaken?: boolean;
  targetIndustry?: string;
  targetPosition?: string;
}

export interface UserContact {
  id: string;
  name: string;
  company?: string;
  position?: string;
  city: string;
  region: string;
  coords: { x: number; y: number };
  lastLetterDate?: string;
  lettersExchanged: number;
  relation: string;
}

export interface PublicStory {
  id: string;
  title: string;
  author: string;
  route: string;
  driftDays: number;
  excerpt: string;
  fullChronicle: string;
  recoveredLocation: string;
  oceanCurrent: string;
  tags: string[];
}

export interface NotableStory {
  id: string;
  title: string;
  type: 'bottle' | 'pigeon';
  duration: string;
  route: string;
  date: string;
  summary: string;
  keepsakeFound?: string;
  reactionsCount: number;
}

export type NavTab = 'pigeons' | 'bottles' | 'atlas' | 'archives' | 'stories' | 'chronicles';

export interface WorldSeason {
  name: string;
  code?: string;
  description?: string;
  flywayCondition: string;
  seaCurrentSpeed: string;
  windPattern: string;
  skyColor?: string;
  pigeonSafetyBonus?: number; // -0.05 to +0.05
}
