// Champion data structure from CommunityDragon API
export interface Champion {
  id: number;
  name: string;
  title: string;
  roles?: string[];
  squarePortraitPath?: string;
  alias?: string;
}

// Simplified champion data for our app
export interface ChampionData {
  id: number;
  name: string;
  title: string;
  iconUrl?: string;
}

// User's collection data for each champion
export interface ChampionCollection {
  [championId: number]: {
    hasSkin: boolean;
    hasShard: boolean;
    lastModified: string;
  };
}

// Application statistics
export interface AppStatistics {
  totalChampions: number;
  skinsOwned: number;
  shardsOwned: number;
  completionPercentage: number;
  shardsWithoutSkins: number;
  lastUpdated: string;
}

// Filter types
export type FilterType = 'all' | 'owned' | 'missing' | 'shards' | 'both';

// Sort types
export type SortType = 'alphabetical' | 'alphabetical-desc' | 'recent' | 'completion';

// Application state interface
export interface AppState {
  champions: ChampionData[];
  collection: ChampionCollection;
  statistics: AppStatistics;
  filters: {
    activeFilter: FilterType;
    searchQuery: string;
    sortBy: SortType;
  };
  ui: {
    loading: boolean;
    error: string | null;
    lastApiUpdate: string | null;
  };
}

// API Response types from DataDragon
export interface DataDragonChampion {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  partype: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  stats: Record<string, number>;
}

export interface DataDragonResponse {
  type: string;
  format: string;
  version: string;
  data: Record<string, DataDragonChampion>;
}

// Local storage data structure
export interface StoredData {
  collection: ChampionCollection;
  lastApiUpdate: string;
  cachedChampions: ChampionData[];
  version: string;
}

// Component prop types
export interface ChampionCardProps {
  champion: ChampionData;
  hasSkin: boolean;
  hasShard: boolean;
  onToggleSkin: (id: number) => void;
  onToggleShard: (id: number) => void;
}

export interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  championCount: number;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export interface ProgressBarProps {
  statistics: AppStatistics;
}

export interface ChampionGridProps {
  champions: ChampionData[];
  collection: ChampionCollection;
  onToggleSkin: (id: number) => void;
  onToggleShard: (id: number) => void;
}