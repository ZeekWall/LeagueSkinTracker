import { Champion, PatchInfo } from '../main/database';

declare global {
  interface Window {
    electronAPI: {
      getChampions: () => Promise<Champion[]>;
      updateChampionStatus: (championId: string, hasSkin: boolean, hasShard: boolean) => Promise<boolean>;
      bulkUpdateChampions: (championIds: string[], hasSkin: boolean, hasShard: boolean) => Promise<boolean>;
      refreshChampions: () => Promise<Champion[]>;
      exportData: () => Promise<{ success: boolean; path?: string }>;
      importData: () => Promise<{ success: boolean; path?: string; count?: number; error?: string }>;
      getPatchInfo: () => Promise<PatchInfo>;
      showConfirmationDialog: (options: { title: string; message: string; detail?: string }) => Promise<boolean>;
      showAlertDialog: (options: { title: string; message: string; detail?: string }) => Promise<void>;
      showErrorDialog: (options: { title: string; message: string; detail?: string }) => Promise<void>;
    };
  }
} 