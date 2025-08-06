import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getChampions: () => ipcRenderer.invoke('get-champions'),
  updateChampionStatus: (championId: string, hasSkin: boolean, hasShard: boolean) =>
    ipcRenderer.invoke('update-champion-status', championId, hasSkin, hasShard),
  bulkUpdateChampions: (championIds: string[], hasSkin: boolean, hasShard: boolean) =>
    ipcRenderer.invoke('bulk-update-champions', championIds, hasSkin, hasShard),
  refreshChampions: () => ipcRenderer.invoke('refresh-champions'),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: () => ipcRenderer.invoke('import-data'),
  getPatchInfo: () => ipcRenderer.invoke('get-patch-info'),
  showConfirmationDialog: (options: { title: string; message: string; detail?: string }) =>
    ipcRenderer.invoke('show-confirmation-dialog', options),
  showAlertDialog: (options: { title: string; message: string; detail?: string }) =>
    ipcRenderer.invoke('show-alert-dialog', options),
  showErrorDialog: (options: { title: string; message: string; detail?: string }) =>
    ipcRenderer.invoke('show-error-dialog', options),
}); 