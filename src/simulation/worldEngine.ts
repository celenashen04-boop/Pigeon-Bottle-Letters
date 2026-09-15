import { 
  PigeonFlight, 
  DriftBottle, 
  Letter, 
  Waypoint, 
  WorldSeason, 
  PostalStamp,
  LetterNotification
} from '../types';
import { 
  POSTAL_STAMPS, 
  KEEPSAKES, 
  SEASONS, 
  INITIAL_NOTIFICATIONS, 
  getRandomPigeonName,
  MATCHING_PROFESSIONALS
} from './constants';

const STORAGE_KEY_PIGEONS = 'drift_pigeon_flights_v3';
const STORAGE_KEY_BOTTLES = 'drift_ocean_bottles_v3';
const STORAGE_KEY_LETTERS = 'drift_letters_v3';
const STORAGE_KEY_CLOCK = 'drift_world_clock_v3';
const STORAGE_KEY_SEASON_IDX = 'drift_season_idx_v3';
const STORAGE_KEY_NOTIFICATIONS = 'drift_notifications_v3';

// Seed initial letters
export const INITIAL_LETTERS: Letter[] = [
  {
    id: 'letter-init-1',
    title: 'On the Scent of Salt & Cedar',
    content: `Dearest Friend,\n\nI sit by the western window as the evening tide retreats from the rocks, leaving the dark ribbons of kelp gleaming in the twilight. A flock of curlews just wheeled past towards the estuary.\n\nI am sending this letter with our faithful slate homer. Whether it finds you in three days or after three weeks of wanderings through coastal fog, know that I am keeping the hearth warm. Do you remember the small stone tower we climbed in Sintra? I found a pressed fern inside an old journal this morning and immediately thought of your laugh when the rain caught us.\n\nTake your time to answer. There is no rush in these seasons.\n\nWith gentle thoughts,\nClara`,
    author: 'Clara Vance',
    authorCompany: 'Lisbon Botanical Institute',
    authorPosition: 'Lead Herbarium Researcher',
    recipient: 'You',
    recipientCompany: 'Coastal Correspondence Guild',
    recipientPosition: 'Keeper of the Coastal Hearth',
    recipientLocation: 'Your Coastal Hearth',
    dateCreated: '3 weeks ago',
    paperStyle: 'tea-stained',
    fontStyle: 'cursive',
    sealColor: '#7c2d12',
    inkColor: '#292524',
    borderStyle: 'flourish',
    deliveryMode: 'pigeon',
    keepsake: KEEPSAKES[1], // pressed fern
    stamps: [POSTAL_STAMPS[0], POSTAL_STAMPS[2]],
    reactions: [
      {
        id: 'rx-1',
        stampId: POSTAL_STAMPS[0].id,
        stampName: POSTAL_STAMPS[0].name,
        addedBy: 'You',
        addedAt: '2 days ago',
        note: 'Blessed passage',
      }
    ],
    isRead: true,
    isArchived: true,
  },
  {
    id: 'letter-init-2',
    title: 'A Confession to the Swell',
    content: `To Whomever Stumbles Across This Shore,\n\nI am writing this from the iron railing of a cargo steamer somewhere west of the Azores. The engine hums beneath my boots like an old whale singing to the dark.\n\nI spent twenty years believing that certainty was peace—that knowing every hour of the coming week was what made a life secure. But tonight, beneath a canopy of stars so dense they look like spilled salt across velvet, I realized that certainty is often just a cage painted in gold.\n\nI place this into the deep with a small green piece of sea glass. If your fingers are now holding this dry parchment, consider it proof that what is meant to reach you will navigate every fathom of silence to do so.\n\nMay your seas be kind.\n— A Traveler on the Night Watch`,
    author: 'A Traveler on the Night Watch',
    recipient: 'Finder of the Tide',
    recipientCompany: 'Coastal Correspondence Guild',
    recipientPosition: 'Keeper of the Coastal Hearth',
    recipientLocation: 'A Far Coastline',
    dateCreated: '142 days ago',
    paperStyle: 'parchment',
    fontStyle: 'serif',
    sealColor: '#0f766e',
    inkColor: '#1c1917',
    borderStyle: 'deckled',
    deliveryMode: 'bottle',
    targetIndustry: 'Maritime, Cartography & Navigation',
    targetPosition: 'Ocean Passage Navigator',
    discoveredByCompany: 'Coastal Correspondence Guild',
    discoveredByPosition: 'Keeper of the Coastal Hearth',
    keepsake: KEEPSAKES[0], // sea glass
    stamps: [POSTAL_STAMPS[4]],
    reactions: [
      {
        id: 'rx-2',
        stampId: POSTAL_STAMPS[4].id,
        stampName: POSTAL_STAMPS[4].name,
        addedBy: 'You',
        addedAt: 'Yesterday',
        note: 'Found in the morning wrackline',
      }
    ],
    isRead: true,
    isArchived: true,
    isAnonymous: true,
  },
  {
    id: 'letter-in-flight',
    title: 'A Letter in Flight to Julian',
    content: `Dear Julian,\n\nThe swallows have begun gathering along the telegraph wires above our orchard, which can only mean the first chill of autumn is descending from the Highlands.\n\nI wanted to ask you about the ancient maritime logbooks you mentioned in your last correspondence. Did the old lighthouse keepers truly believe that migrating petrels could foretell a three-day gale? The bird carrying this letter has weathered storms over the Irish Sea before, but I still watch the western sky with a held breath.\n\nWrite back when the lantern is trimmed and the night is long.\n\nWarm regards,\nYour Correspondent`,
    author: 'You',
    authorCompany: 'Coastal Correspondence Guild',
    authorPosition: 'Keeper of the Coastal Hearth',
    recipient: 'Julian Thorne',
    recipientCompany: 'Northern Lighthouse Board',
    recipientPosition: 'Chief Keeper & Archival Historian',
    recipientLocation: 'Edinburgh, Scotland',
    dateCreated: '6 days ago',
    paperStyle: 'linen',
    fontStyle: 'typewriter',
    sealColor: '#1e3a8a',
    inkColor: '#1e1b4b',
    borderStyle: 'minimal-rule',
    deliveryMode: 'pigeon',
    keepsake: KEEPSAKES[3], // pine needle
    stamps: [POSTAL_STAMPS[1]],
    reactions: [],
    isRead: false,
    isArchived: false,
  },
  {
    id: 'letter-bottle-adrift',
    title: 'Words for a Stranger After Midnight',
    content: `Whoever you are,\n\nIt is 2:30 in the morning and rain is tapping against my skylight. I have no grand confession, only the quiet wish that whoever breaks this wax seal is having a gentler week than the one they left behind.\n\nI tucked a dried sprig of lavender inside. If it still smells of late summer, close your eyes and breathe it in. You are not as alone as the midnight makes you feel.\n\nCast from the cliffs at sunset.\n— S.`,
    author: 'You',
    authorCompany: 'Coastal Correspondence Guild',
    authorPosition: 'Keeper of the Coastal Hearth',
    recipient: 'An Unknown Horizon',
    recipientLocation: 'Global Ocean',
    dateCreated: '14 days ago',
    paperStyle: 'botanical-pressed',
    fontStyle: 'cursive',
    sealColor: '#701a75',
    inkColor: '#3f2e1a',
    borderStyle: 'flourish',
    deliveryMode: 'bottle',
    targetIndustry: 'Science, Ecology & Botany',
    targetPosition: 'Herbarium Botanist',
    keepsake: KEEPSAKES[4], // lavender
    stamps: [POSTAL_STAMPS[2], POSTAL_STAMPS[5]],
    reactions: [],
    isRead: false,
    isArchived: false,
    isAnonymous: false,
  },
];

// Seed initial pigeon flights
export const INITIAL_PIGEONS: PigeonFlight[] = [
  {
    id: 'pigeon-flight-1',
    letterId: 'letter-in-flight',
    letter: INITIAL_LETTERS[2],
    sender: 'You',
    recipient: 'Julian Thorne',
    recipientCompany: 'Northern Lighthouse Board',
    recipientPosition: 'Chief Keeper & Archival Historian',
    originName: 'Your Coastal Hearth',
    destinationName: 'Edinburgh (Lighthouse Haven)',
    originCoords: { x: 44, y: 35 },
    destCoords: { x: 47, y: 22 },
    status: 'in_flight',
    dispatchedAt: Date.now() - 6 * 86400000,
    estimatedMinDays: 5,
    estimatedMaxDays: 14,
    actualDurationDays: 9,
    currentDay: 6,
    progressPercent: 68,
    currentZoneName: 'Cheviot Hills Cloud Ceiling',
    weatherHistory: [
      'Dispatched under clear sunrise winds',
      'Detoured eastward to avoid Irish Sea thunderhead',
      'Resting on stone ledge of Ripon Abbey during downpour',
      'Caught favorable south-westerly tailwind over the moors',
    ],
    waypoints: [
      {
        id: 'wp-1',
        locationName: 'Pennine Way Ridgeline',
        date: 'Day 2',
        description: 'Sighted gliding smoothly along high limestone contours.',
        weatherCondition: 'Overcast & cool',
        coords: { x: 45, y: 30 },
      },
      {
        id: 'wp-2',
        locationName: 'Hadrian’s Crag Belfry',
        date: 'Day 4',
        description: 'Paused for fresh water and seeds offered by a wandering rambler.',
        weatherCondition: 'Drizzle, damp wind',
        coords: { x: 46, y: 26 },
      },
      {
        id: 'wp-3',
        locationName: 'Tweed Valley Lowlands',
        date: 'Day 6',
        description: 'Banking north over golden barley fields; wings strong and steady.',
        weatherCondition: 'Partly sunny with thermals',
        coords: { x: 46.5, y: 24 },
      },
    ],
    flywayName: 'North Sea Coastal Corridor',
    riskOfLoss: 0.08,
    pigeonName: 'Barnaby',
    pigeonClothes: 'aviator_goggles',
  },
  {
    id: 'pigeon-flight-delivered',
    letterId: 'letter-init-1',
    letter: INITIAL_LETTERS[0],
    sender: 'Clara Vance',
    recipient: 'You',
    recipientCompany: 'Coastal Correspondence Guild',
    recipientPosition: 'Keeper of the Coastal Hearth',
    originName: 'Lisbon Harbor',
    destinationName: 'Your Coastal Hearth',
    originCoords: { x: 44, y: 35 },
    destCoords: { x: 44, y: 35 },
    status: 'delivered',
    dispatchedAt: Date.now() - 21 * 86400000,
    estimatedMinDays: 7,
    estimatedMaxDays: 18,
    actualDurationDays: 12,
    currentDay: 12,
    progressPercent: 100,
    currentZoneName: 'Arrived at your windowsill roost',
    weatherHistory: [
      'Smooth departure along Tagus estuary',
      'Dense Biscay fog caused a 3-day layover in cider orchards of Asturias',
      'Final swift glide on Atlantic thermals',
    ],
    waypoints: [
      {
        id: 'wp-d1',
        locationName: 'Cabo da Roca Cliffs',
        date: 'Day 2',
        description: 'Wheeling high over Atlantic spray.',
        weatherCondition: 'Salty gusts',
        coords: { x: 43, y: 34 },
      },
      {
        id: 'wp-d2',
        locationName: 'Picos de Europa Foothills',
        date: 'Day 6',
        description: 'Resting in a stone chapel tower during rain.',
        weatherCondition: 'Heavy autumn rain',
        coords: { x: 44, y: 32 },
      },
    ],
    flywayName: 'Iberian-Atlantic Flyway',
    riskOfLoss: 0.05,
    hasArrivedNoticeDismissed: true,
    pigeonName: 'Homer',
    pigeonClothes: 'knitted_scarf',
  },
];

// Seed initial drift bottles
export const INITIAL_BOTTLES: DriftBottle[] = [
  {
    id: 'bottle-adrift-1',
    letterId: 'letter-bottle-adrift',
    letter: INITIAL_LETTERS[3],
    senderName: 'You',
    isAnonymous: false,
    originCoast: 'Finisterre Headland',
    originCoords: { x: 42, y: 33 },
    currentCoords: { x: 38, y: 36 },
    currentOceanRegion: 'Sargasso Sea / North Atlantic Gyre',
    oceanCurrentName: 'Canary Current & Trade Wind Drift',
    status: 'drifting',
    releasedAt: Date.now() - 14 * 86400000,
    daysAdrift: 14,
    nauticalMilesTravelled: 480,
    repliesCount: 0,
    bottleColor: '#14b8a6',
    bottleSealColor: '#701a75',
    bottleSealInsignia: 'moon',
    isTaken: false,
    targetIndustry: 'Science, Ecology & Botany',
    targetPosition: 'Herbarium Botanist',
    journalEntries: [
      'Bobbing through floating golden sargassum weed; targeted to Herbarium Botanists.',
      'A pod of pilot whales surfaced within twenty yards at dusk.',
      'Wax seal pristine despite heavy Atlantic swell.',
    ],
  },
  {
    id: 'bottle-found-1',
    letterId: 'letter-init-2',
    letter: INITIAL_LETTERS[1],
    senderName: 'A Traveler on the Night Watch',
    isAnonymous: true,
    originCoast: 'Azorean Deep',
    originCoords: { x: 35, y: 38 },
    currentCoords: { x: 44, y: 35 },
    currentOceanRegion: 'Your Local Coastline',
    oceanCurrentName: 'North Atlantic Drift',
    status: 'discovered',
    releasedAt: Date.now() - 142 * 86400000,
    daysAdrift: 142,
    nauticalMilesTravelled: 1650,
    discoveredAt: Date.now() - 86400000,
    discoveredBy: 'You',
    discoveredByPosition: 'Keeper of the Coastal Hearth',
    discoveredByCompany: 'Coastal Correspondence Guild',
    discoveredLocation: 'Shell Beach Cove',
    repliesCount: 1,
    bottleColor: '#2563eb',
    bottleSealColor: '#0f766e',
    bottleSealInsignia: 'anchor',
    isTaken: true,
    targetIndustry: 'Maritime, Cartography & Navigation',
    targetPosition: 'Ocean Passage Navigator',
    journalEntries: [
      'Survived a mid-Atlantic winter squall with 20-foot breakers.',
      'Passed through quiet bioluminescent waters off Madeira.',
      'Pushed ashore at low tide onto smooth round pebbles; recovered by You (Keeper of the Coastal Hearth).',
    ],
  },
  {
    id: 'bottle-global-wanderer',
    letterId: 'letter-global-2',
    letter: {
      id: 'letter-global-2',
      title: 'A Song Sung to the Albatross',
      content: `If you pull this cork from the glass,\n\nKnow that when I sealed this, the Southern Cross was burning directly overhead. We had not seen another ship in thirty days. I am leaving my favorite brass button inside this vial—it belonged to my great-uncle who sailed around Cape Horn in 1892.\n\nKeep the button or throw it back into the sea; both choices are holy in their own way.\n\n— Elena of Punta Arenas`,
      author: 'Elena',
      recipient: 'Wanderer of the Southern Seas',
      dateCreated: '210 days ago',
      paperStyle: 'tea-stained',
      fontStyle: 'cursive',
      sealColor: '#b45309',
      inkColor: '#1c1917',
      borderStyle: 'flourish',
      deliveryMode: 'bottle',
      keepsake: KEEPSAKES[5], // copper coin
      stamps: [POSTAL_STAMPS[3]],
      reactions: [],
      isRead: false,
      isArchived: false,
      isAnonymous: false,
    },
    senderName: 'Elena of Punta Arenas',
    isAnonymous: false,
    originCoast: 'Strait of Magellan',
    originCoords: { x: 32, y: 88 },
    currentCoords: { x: 42, y: 75 },
    currentOceanRegion: 'South Atlantic Falklands Gyre',
    oceanCurrentName: 'Antarctic Circumpolar Drift',
    status: 'drifting',
    releasedAt: Date.now() - 210 * 86400000,
    daysAdrift: 210,
    nauticalMilesTravelled: 3400,
    targetIndustry: 'Maritime, Cartography & Navigation',
    targetPosition: 'Ocean Passage Navigator',
    repliesCount: 0,
    journalEntries: [
      'Carried by icy green waters past towering tabular icebergs.',
      'Petrels hovered curiosity-bound above the cork seal.',
      'Now drifting north toward warmer temperate shoals.',
    ],
  },
];

// Helper to safely read and write local state
export function loadLetters(): Letter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LETTERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(INITIAL_LETTERS));
      return INITIAL_LETTERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_LETTERS;
  }
}

export function saveLetters(letters: Letter[]) {
  try {
    localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(letters));
  } catch (e) {
    console.error(e);
  }
}

export function loadPigeonFlights(): PigeonFlight[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PIGEONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PIGEONS, JSON.stringify(INITIAL_PIGEONS));
      return INITIAL_PIGEONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PIGEONS;
  }
}

export function savePigeonFlights(flights: PigeonFlight[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PIGEONS, JSON.stringify(flights));
  } catch (e) {
    console.error(e);
  }
}

export function loadDriftBottles(): DriftBottle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOTTLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOTTLES, JSON.stringify(INITIAL_BOTTLES));
      return INITIAL_BOTTLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BOTTLES;
  }
}

export function saveDriftBottles(bottles: DriftBottle[]) {
  try {
    localStorage.setItem(STORAGE_KEY_BOTTLES, JSON.stringify(bottles));
  } catch (e) {
    console.error(e);
  }
}

export function loadWorldSeasonIndex(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SEASON_IDX);
    return raw ? parseInt(raw, 10) % SEASONS.length : 0;
  } catch {
    return 0;
  }
}

export function saveWorldSeasonIndex(idx: number) {
  try {
    localStorage.setItem(STORAGE_KEY_SEASON_IDX, idx.toString());
  } catch {}
}

export function loadNotifications(): LetterNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: LetterNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  } catch {}
}

export function getRandomOceanCoords(): { x: number; y: number; region: string } {
  const oceanRegions = [
    { name: 'North Atlantic Gyre', minX: 28, maxX: 40, minY: 28, maxY: 42 },
    { name: 'Mid-Atlantic Swell', minX: 30, maxX: 38, minY: 42, maxY: 56 },
    { name: 'Sargasso Sea Drift', minX: 24, maxX: 34, minY: 32, maxY: 42 },
    { name: 'North Pacific Current', minX: 12, maxX: 22, minY: 30, maxY: 46 },
    { name: 'Western Pacific Trench', minX: 80, maxX: 88, minY: 32, maxY: 52 },
    { name: 'Indian Ocean Trade Winds', minX: 60, maxX: 72, minY: 48, maxY: 66 },
    { name: 'Southern Ocean Drift', minX: 22, maxX: 78, minY: 72, maxY: 82 },
  ];
  const chosen = oceanRegions[Math.floor(Math.random() * oceanRegions.length)];
  const x = Math.floor(chosen.minX + Math.random() * (chosen.maxX - chosen.minX));
  const y = Math.floor(chosen.minY + Math.random() * (chosen.maxY - chosen.minY));
  return { x, y, region: chosen.name };
}

export function loadWorldClock(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLOCK);
    return raw ? parseInt(raw, 10) : 38;
  } catch {
    return 38;
  }
}

export function saveWorldClock(days: number) {
  try {
    localStorage.setItem(STORAGE_KEY_CLOCK, days.toString());
  } catch {}
}

export function loadWorldSimulation(): {
  pigeonFlights: PigeonFlight[];
  bottles: DriftBottle[];
  letters: Letter[];
  notifications: LetterNotification[];
  worldSeason: WorldSeason;
  dayCount: number;
} {
  const pigeonFlights = loadPigeonFlights();
  const bottles = loadDriftBottles();
  const letters = loadLetters();
  const notifications = loadNotifications();
  const seasonIdx = loadWorldSeasonIndex();
  const dayCount = loadWorldClock();

  return {
    pigeonFlights,
    bottles,
    letters,
    notifications,
    worldSeason: SEASONS[seasonIdx] || SEASONS[0],
    dayCount,
  };
}

export function saveWorldSimulation(sim: {
  pigeonFlights: PigeonFlight[];
  bottles: DriftBottle[];
  letters: Letter[];
  notifications?: LetterNotification[];
  worldSeason: WorldSeason;
  dayCount: number;
}) {
  savePigeonFlights(sim.pigeonFlights);
  saveDriftBottles(sim.bottles);
  saveLetters(sim.letters);
  if (sim.notifications) {
    saveNotifications(sim.notifications);
  }
  saveWorldClock(sim.dayCount);
}

export function dispatchCarrierPigeon(
  letter: Letter,
  recipient: string,
  coords: { x: number; y: number },
  city: string,
  pigeonName?: string,
  pigeonClothes?: string,
  recipientCompany?: string,
  recipientPosition?: string
): PigeonFlight {
  const currentSeason = SEASONS[loadWorldSeasonIndex()] || SEASONS[0];
  const baseDays = Math.floor(5 + Math.random() * 10);
  const minDays = Math.max(3, baseDays - 3);
  const maxDays = baseDays + 6;
  const assignedName = pigeonName?.trim() || getRandomPigeonName();
  const assignedClothes = pigeonClothes || 'aviator_goggles';

  const company = recipientCompany || letter.recipientCompany;
  const position = recipientPosition || letter.recipientPosition;

  const letterWithRecipient: Letter = {
    ...letter,
    recipient,
    recipientCompany: company,
    recipientPosition: position,
    recipientLocation: city,
  };

  const newFlight: PigeonFlight = {
    id: `flight-${Date.now()}`,
    letterId: letter.id,
    letter: letterWithRecipient,
    sender: letter.author,
    recipient,
    recipientCompany: company,
    recipientPosition: position,
    originName: 'Your Coastal Hearth',
    destinationName: city,
    originCoords: { x: 44, y: 35 },
    destCoords: coords,
    status: 'in_flight',
    dispatchedAt: Date.now(),
    estimatedMinDays: minDays,
    estimatedMaxDays: maxDays,
    actualDurationDays: baseDays,
    currentDay: 1,
    progressPercent: 6,
    currentZoneName: 'Departing coastal valley updrafts',
    pigeonName: assignedName,
    pigeonClothes: assignedClothes,
    weatherHistory: [
      `Dispatched into ${currentSeason.windPattern}`,
      'Ascended to cruising altitude of 1,200 ft',
    ],
    waypoints: [
      {
        id: `wp-init-${Date.now()}`,
        locationName: 'Home Coastal Roost',
        date: 'Day 1',
        description: `Released ${assignedName} with letter capsule secured for ${recipient}${position ? ` (${position})` : ''}.`,
        weatherCondition: 'Clear skies with morning sea breeze',
        coords: { x: 44, y: 35 },
      },
    ],
    flywayName: 'Atlantic Coastal Flyway',
    riskOfLoss: 0.08,
  };

  const flights = loadPigeonFlights();
  flights.unshift(newFlight);
  savePigeonFlights(flights);

  const letters = loadLetters();
  letters.unshift(letterWithRecipient);
  saveLetters(letters);

  return newFlight;
}

export function castBottleIntoOcean(
  letter: Letter,
  isAnonymous: boolean,
  bottleColor: string = '#14b8a6',
  waxSealColor: string = '#7c2d12',
  waxSealInsignia: string = 'swallow',
  targetIndustry?: string,
  targetPosition?: string
): DriftBottle {
  const randomCoords = getRandomOceanCoords();

  const finalTargetIndustry = targetIndustry || letter.targetIndustry;
  const finalTargetPosition = targetPosition || letter.targetPosition;

  const letterWithTarget: Letter = {
    ...letter,
    targetIndustry: finalTargetIndustry,
    targetPosition: finalTargetPosition,
  };

  const newBottle: DriftBottle = {
    id: `bottle-${Date.now()}`,
    letterId: letter.id,
    letter: letterWithTarget,
    senderName: isAnonymous ? 'An Anonymous Soul' : letter.author,
    isAnonymous,
    originCoast: 'Your Rocky Cove',
    originCoords: { x: 44, y: 35 },
    currentCoords: { x: randomCoords.x, y: randomCoords.y },
    currentOceanRegion: randomCoords.region,
    oceanCurrentName: 'Canary Drift & Gulf Stream Fringe',
    status: 'drifting',
    releasedAt: Date.now(),
    daysAdrift: 1,
    nauticalMilesTravelled: 12,
    repliesCount: 0,
    bottleColor,
    bottleSealColor: waxSealColor,
    bottleSealInsignia: waxSealInsignia,
    isTaken: false,
    targetIndustry: finalTargetIndustry,
    targetPosition: finalTargetPosition,
    journalEntries: [
      finalTargetIndustry && finalTargetIndustry !== 'Open to All Professions'
        ? `Cast into the sunset surf; wax-sealed specifically for ${finalTargetPosition ? `${finalTargetPosition} in ${finalTargetIndustry}` : finalTargetIndustry}. Bobbing peacefully beyond the breakers.`
        : 'Cast into the sunset surf; bobbing peacefully beyond the breakers.',
    ],
  };

  const bottles = loadDriftBottles();
  bottles.unshift(newBottle);
  saveDriftBottles(bottles);

  const letters = loadLetters();
  letters.unshift(letterWithTarget);
  saveLetters(letters);

  return newBottle;
}

// World Simulation Engine: Advance time by N days
export function advanceWorldSimulation(days: number = 1): {
  pigeonFlights: PigeonFlight[];
  bottles: DriftBottle[];
  letters: Letter[];
  notifications: LetterNotification[];
  worldSeason: WorldSeason;
  dayCount: number;
  arrivedPigeons: PigeonFlight[];
  lostPigeons: PigeonFlight[];
  strandedBottles: DriftBottle[];
  newSeason?: WorldSeason;
} {
  const pigeons = loadPigeonFlights();
  const bottles = loadDriftBottles();
  const letters = loadLetters();
  const currentNotifs = loadNotifications();
  const prevClock = loadWorldClock();
  const newClock = prevClock + days;
  saveWorldClock(newClock);

  const arrivedPigeons: PigeonFlight[] = [];
  const lostPigeons: PigeonFlight[] = [];
  const strandedBottles: DriftBottle[] = [];
  const newNotifications: LetterNotification[] = [];

  // 1. Advance Pigeon Flights
  const updatedPigeons = pigeons.map((pigeon) => {
    if (pigeon.status !== 'in_flight') return pigeon;

    const newCurrentDay = pigeon.currentDay + days;
    const progressGain = (days / pigeon.actualDurationDays) * 100;
    const newProgress = Math.min(100, pigeon.progressPercent + progressGain);

    // Weather events & Waypoint generation
    const newWaypoints = [...pigeon.waypoints];
    const newWeatherHistory = [...pigeon.weatherHistory];

    if (days >= 1 && newProgress < 100) {
      const landmarkNames = [
        'Pine Ridge Sanctuary',
        'Old Windmill Ridge',
        'Monastery Belfry Overlook',
        'Silver River S Bend',
        'Highland Heather Moors',
        'Coastal Lighthouse Beacon',
      ];
      const randomLandmark = landmarkNames[Math.floor(Math.random() * landmarkNames.length)];
      newWaypoints.push({
        id: `wp-gen-${Date.now()}-${Math.random()}`,
        locationName: `${randomLandmark} (Day ${newCurrentDay})`,
        date: `Day ${newCurrentDay}`,
        description: 'Sighted by birdwatchers resting feathers amidst shifting skies.',
        weatherCondition: 'Cool breezes with passing clouds',
        coords: {
          x: pigeon.originCoords.x + (pigeon.destCoords.x - pigeon.originCoords.x) * (newProgress / 100) + (Math.random() * 4 - 2),
          y: pigeon.originCoords.y + (pigeon.destCoords.y - pigeon.originCoords.y) * (newProgress / 100) + (Math.random() * 4 - 2),
        },
      });
      newWeatherHistory.push(`Encountered gentle tailwinds past ${randomLandmark}`);
    }

    // Check arrival or loss
    if (newProgress >= 100 || newCurrentDay >= pigeon.actualDurationDays) {
      const isLost = Math.random() < pigeon.riskOfLoss;
      if (isLost) {
        lostPigeons.push(pigeon);
        return {
          ...pigeon,
          currentDay: newCurrentDay,
          progressPercent: 92,
          status: 'lost' as const,
          currentZoneName: 'Vanished into an unmapped mountain fog',
          weatherHistory: [...newWeatherHistory, 'A sudden mountain squall obscured the heading; bird did not return.'],
        };
      } else {
        arrivedPigeons.push(pigeon);
        // Mark attached letter as delivered
        const letterIdx = letters.findIndex((l) => l.id === pigeon.letterId);
        if (letterIdx !== -1) {
          letters[letterIdx] = {
            ...letters[letterIdx],
            isRead: false,
          };
        }

        const isOutgoing = pigeon.sender === 'You';
        newNotifications.push({
          id: `notif-arr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: isOutgoing ? 'letter_delivered' : 'letter_received',
          title: isOutgoing 
            ? `Pigeon "${pigeon.pigeonName || 'Homer'}" Delivered Your Letter` 
            : `Carrier Pigeon Arrived with Dispatch`,
          message: isOutgoing
            ? `Your pigeon "${pigeon.pigeonName || 'Homer'}" has touched down safely in ${pigeon.destinationName} and delivered your letter to ${pigeon.recipient}!`
            : `A carrier pigeon named "${pigeon.pigeonName || 'Homer'}" arrived at your hearth bearing a dispatch from ${pigeon.sender}!`,
          timestamp: `Day ${newClock}`,
          dateNumber: newClock,
          letterId: pigeon.letterId,
          flightId: pigeon.id,
          isRead: false,
        });

        return {
          ...pigeon,
          currentDay: newCurrentDay,
          progressPercent: 100,
          status: 'delivered' as const,
          currentZoneName: `Delivered safely to ${pigeon.destinationName}`,
          weatherHistory: [...newWeatherHistory, `Landed softly on the windowsill at ${pigeon.destinationName}`],
          waypoints: newWaypoints,
        };
      }
    }

    return {
      ...pigeon,
      currentDay: newCurrentDay,
      progressPercent: newProgress,
      waypoints: newWaypoints,
      weatherHistory: newWeatherHistory,
    };
  });

  // 2. Advance Ocean Bottles
  const updatedBottles = bottles.map((bottle) => {
    if (bottle.status !== 'drifting' || bottle.isTaken) return bottle;

    const newDaysAdrift = bottle.daysAdrift + days;
    const additionalMiles = days * Math.floor(18 + Math.random() * 12);
    const newMiles = bottle.nauticalMilesTravelled + additionalMiles;

    // Simulate drift coordinates along gentle swirling vector
    const currentX = bottle.currentCoords.x + (Math.random() * 2.4 - 1.0) * (days * 0.4);
    const currentY = bottle.currentCoords.y + (Math.random() * 2.0 - 0.7) * (days * 0.4);

    // Probability of being washed ashore & taken by beachcomber
    // "when the bottle is taken, you see it disappear on the map"
    const discoveryChance = Math.min(0.28, 0.025 * days + (newDaysAdrift > 25 ? 0.08 : 0));
    const isDiscovered = Math.random() < discoveryChance;

    if (isDiscovered) {
      const coastalHavens = [
        'Cape Finisterre Pebble Cove',
        'Faroe Islands Black Sand Beach',
        'Azorean Basalt Tide Pools',
        'Hebrides Outer Archipelago',
        'Mendocino Driftwood Shoals',
        'Tasman Peninsula Sea Cliffs',
        'Sintra Rocky Cove',
      ];
      const foundSpot = coastalHavens[Math.floor(Math.random() * coastalHavens.length)];
      strandedBottles.push(bottle);

      let finderName = 'A quiet beachcomber';
      let finderPosition = 'Coastal Observer';
      let finderCompany = 'Shoreline Watch';
      let matchedNote = '';

      const targetInd = bottle.targetIndustry;
      const targetPos = bottle.targetPosition;
      const hasSpecificTarget = Boolean((targetInd && targetInd !== 'Open to All Professions') || targetPos);

      if (targetInd && targetInd !== 'Open to All Professions') {
        const matches = MATCHING_PROFESSIONALS.filter(
          p => p.industry === targetInd || (targetPos && p.position.toLowerCase().includes(targetPos.toLowerCase()))
        );
        const match = matches.length > 0 ? matches[Math.floor(Math.random() * matches.length)] : null;
        if (match) {
          finderName = match.name;
          finderPosition = match.position;
          finderCompany = match.company;
        } else {
          finderName = 'Sarah Lindqvist';
          finderPosition = targetPos || 'Specialist Fellow';
          finderCompany = `${targetInd} Conservatory`;
        }
        matchedNote = ` (Matched profession: ${finderPosition} at ${finderCompany})`;
      } else if (targetPos) {
        finderName = 'Elena Thorne';
        finderPosition = targetPos;
        finderCompany = 'Atlantic Guild of Practitioners';
        matchedNote = ` (Matched profession: ${finderPosition})`;
      } else {
        const genericFinders = [
          { name: 'Dr. Thais Beaumont', position: 'Marine Oceanographer', company: 'Brest Hydrographic Station' },
          { name: 'Mateo Morales', position: 'Historical Restorer', company: 'Iberian Heritage Trust' },
          { name: 'Beatrix Shaw', position: 'Poet & Broadside Printer', company: 'Whalebone Letterpress' },
          { name: 'Soren Lindqvist', position: 'Lighthouse Keeper', company: 'Lofoten Beacon Service' },
        ];
        const picked = genericFinders[Math.floor(Math.random() * genericFinders.length)];
        finderName = picked.name;
        finderPosition = picked.position;
        finderCompany = picked.company;
      }

      newNotifications.push({
        id: `notif-bottle-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'bottle_washed_up',
        title: hasSpecificTarget ? 'Matching Professional Recovered Your Bottle!' : 'A Bottle Washed Ashore & Was Taken from the Tides',
        message: hasSpecificTarget
          ? `${finderName} (${finderPosition} at ${finderCompany}) discovered your bottle along ${foundSpot}! Because your bottle was cast specifically for ${targetPos ? `${targetPos} in ${targetInd}` : targetInd}, their coastal watch retrieved it from the tide.`
          : `A beachcomber along ${foundSpot} (${finderName}, ${finderPosition} at ${finderCompany}) discovered your bottle, broke the wax seal, and took the letter. It is no longer floating on the map.`,
        timestamp: `Day ${newClock}`,
        dateNumber: newClock,
        letterId: bottle.letterId,
        bottleId: bottle.id,
        isRead: false,
      });

      // Update letter in letters list with discoverer info
      const letterIdx = letters.findIndex((l) => l.id === bottle.letterId);
      if (letterIdx !== -1) {
        letters[letterIdx] = {
          ...letters[letterIdx],
          discoveredByCompany: finderCompany,
          discoveredByPosition: finderPosition,
        };
      }

      return {
        ...bottle,
        status: 'discovered' as const,
        isTaken: true,
        daysAdrift: newDaysAdrift,
        nauticalMilesTravelled: newMiles,
        discoveredLocation: foundSpot,
        discoveredAt: Date.now(),
        discoveredBy: finderName,
        discoveredByPosition: finderPosition,
        discoveredByCompany: finderCompany,
        journalEntries: [
          ...bottle.journalEntries,
          `Retrieved from the shore at ${foundSpot} by ${finderName} (${finderPosition} at ${finderCompany})${matchedNote}. The glass has been taken from the open tide.`,
        ],
      };
    }

    return {
      ...bottle,
      daysAdrift: newDaysAdrift,
      nauticalMilesTravelled: newMiles,
      currentCoords: {
        x: Math.max(10, Math.min(90, currentX)),
        y: Math.max(15, Math.min(85, currentY)),
      },
      journalEntries: [
        ...bottle.journalEntries,
        `Passed ${additionalMiles} nautical miles through deep swell on Day ${newDaysAdrift}.`,
      ],
    };
  });

  // Cycle season every 30 simulated days
  let currentSeasonIdx = loadWorldSeasonIndex();
  let newSeason: WorldSeason | undefined;
  if (days >= 20 || Math.random() < 0.25) {
    currentSeasonIdx = (currentSeasonIdx + 1) % SEASONS.length;
    saveWorldSeasonIndex(currentSeasonIdx);
    newSeason = SEASONS[currentSeasonIdx];
  }

  // Combine notifications
  const allNotifications = [...newNotifications, ...currentNotifs].slice(0, 30);
  saveNotifications(allNotifications);

  savePigeonFlights(updatedPigeons);
  saveDriftBottles(updatedBottles);
  saveLetters(letters);

  return {
    pigeonFlights: updatedPigeons,
    bottles: updatedBottles,
    letters,
    notifications: allNotifications,
    worldSeason: SEASONS[currentSeasonIdx] || SEASONS[0],
    dayCount: newClock,
    arrivedPigeons,
    lostPigeons,
    strandedBottles,
    newSeason,
  };
}

// Serendipitous Beachcombing: find a stranded or passing bottle from the ocean!
export function beachcombShore(): {
  bottle: DriftBottle | null;
  message: string;
  foundKeepsake?: string;
} {
  const bottles = loadDriftBottles();
  // Find any bottle that is stranded or drifting near coasts
  const availableBottles = bottles.filter((b) => b.status === 'stranded' || (b.status === 'drifting' && b.daysAdrift > 20));

  if (availableBottles.length > 0) {
    // Pick one serendipitously
    const chosen = availableBottles[Math.floor(Math.random() * availableBottles.length)];
    const updated = bottles.map((b) => {
      if (b.id === chosen.id) {
        return {
          ...b,
          status: 'discovered' as const,
          discoveredAt: Date.now(),
          discoveredBy: 'You (Beachcomber)',
          discoveredLocation: b.discoveredLocation || 'Sandy Spit at Twilight',
        };
      }
      return b;
    });

    saveDriftBottles(updated);

    return {
      bottle: {
        ...chosen,
        status: 'discovered',
        discoveredLocation: chosen.discoveredLocation || 'Sandy Spit at Twilight',
      },
      message: `The tide recedes, revealing a pale green glass bottle wedged between smooth wet stones and tangled ribbons of kelp!`,
      foundKeepsake: chosen.letter.keepsake?.name,
    };
  }

  // If no existing bottle is ready, create an anonymous serendipitous message from a far-off stranger!
  const strangerNames = [
    'A Lighthouse Keeper on the Outer Skerries',
    'A Wandering Painter of the Coast',
    'An Anonymous Oceanographer',
    'A Sailor bound for Valparaíso',
    'Someone who loves the sound of rain on canvas',
  ];
  const randomStranger = strangerNames[Math.floor(Math.random() * strangerNames.length)];
  const randomKeepsake = KEEPSAKES[Math.floor(Math.random() * KEEPSAKES.length)];

  const serendipitousLetter: Letter = {
    id: `letter-serendipity-${Date.now()}`,
    title: 'A Message to the Tide Finder',
    content: `To You, Walking the Shore,\n\nI tossed this bottle from a weathered wooden dinghy as the sun melted like butter into the western ocean. The world moves with such ferocious speed on land; everyone is counting minutes, deadlines, and notifications.\n\nOut here on the water, only the swell and the constellations keep time. I hope you find this on an unhurried morning. If your boots get wet from the surf, let them dry in the sun.\n\nWith silent camaraderie,\n${randomStranger}`,
    author: randomStranger,
    recipient: 'The Tide Finder',
    recipientLocation: 'Your Sandy Cove',
    dateCreated: '84 days ago',
    paperStyle: 'tea-stained',
    fontStyle: 'cursive',
    sealColor: '#0f766e',
    inkColor: '#1c1917',
    borderStyle: 'flourish',
    deliveryMode: 'bottle',
    keepsake: randomKeepsake,
    stamps: [POSTAL_STAMPS[0], POSTAL_STAMPS[4]],
    reactions: [],
    isRead: false,
    isArchived: false,
    isAnonymous: true,
  };

  const newBottle: DriftBottle = {
    id: `bottle-serendipity-${Date.now()}`,
    letterId: serendipitousLetter.id,
    letter: serendipitousLetter,
    senderName: randomStranger,
    isAnonymous: true,
    originCoast: 'Open Atlantic Shoals',
    originCoords: { x: 30, y: 40 },
    currentCoords: { x: 44, y: 35 },
    currentOceanRegion: 'Your Coastal Shoreline',
    oceanCurrentName: 'North Atlantic Gyre',
    status: 'discovered',
    releasedAt: Date.now() - 84 * 86400000,
    daysAdrift: 84,
    nauticalMilesTravelled: 1120,
    discoveredAt: Date.now(),
    discoveredBy: 'You (Beachcomber)',
    discoveredLocation: 'Dappled Tide Line',
    repliesCount: 0,
    journalEntries: [
      'Released at low tide under an amber sky.',
      'Drifted through dense fog banks off the Grand Banks.',
      'Gently deposited upon wet morning sand.',
    ],
  };

  const allLetters = loadLetters();
  allLetters.unshift(serendipitousLetter);
  saveLetters(allLetters);

  bottles.unshift(newBottle);
  saveDriftBottles(bottles);

  return {
    bottle: newBottle,
    message: `You walk the wrackline along the morning surf and spot a glint of sunlight catching green glass! It is a bottle sealed with wax, containing a letter and ${randomKeepsake.name}.`,
    foundKeepsake: randomKeepsake.name,
  };
}
