import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';
import { DatabaseManager } from './database';
import { ChampionService } from './services/championService';

let mainWindow: BrowserWindow | null = null;
let dbManager: DatabaseManager;
let championService: ChampionService;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../favicon.ico'),
    title: 'League Skin Tracker',
    autoHideMenuBar: true,
  });

  // Remove the menu bar completely
  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Initialize database
  dbManager = new DatabaseManager();
  await dbManager.initialize();

  // Initialize services
  championService = new ChampionService(dbManager);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-champions', async () => {
  return await championService.getChampions();
});

ipcMain.handle('update-champion-status', async (event, championId: string, hasSkin: boolean, hasShard: boolean) => {
  return await championService.updateChampionStatus(championId, hasSkin, hasShard);
});

ipcMain.handle('bulk-update-champions', async (event, championIds: string[], hasSkin: boolean, hasShard: boolean) => {
  return await championService.bulkUpdateChampions(championIds, hasSkin, hasShard);
});

ipcMain.handle('refresh-champions', async () => {
  return await championService.refreshChampionsFromAPI();
});

ipcMain.handle('export-data', async () => {
  const data = await championService.exportData();
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: 'league-skin-data.json',
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  
  if (!result.canceled && result.filePath) {
    const fs = require('fs');
    fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
    return { success: true, path: result.filePath };
  }
  return { success: false };
});

ipcMain.handle('import-data', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const fs = require('fs');
      const filePath = result.filePaths[0];
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      // Validate the imported data structure
      if (!data.champions || !Array.isArray(data.champions)) {
        throw new Error('Invalid data format: missing or invalid champions array');
      }
      
      // Import the data
      const importedChampions = await championService.importData(data);
      return { success: true, path: filePath, count: importedChampions.length };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  return { success: false };
});

ipcMain.handle('get-patch-info', async () => {
  return await championService.getPatchInfo();
});

// Native Dialog Handlers
ipcMain.handle('show-confirmation-dialog', async (event, options: { title: string; message: string; detail?: string }) => {
  const result = await dialog.showMessageBox(mainWindow!, {
    type: 'question',
    title: options.title,
    message: options.message,
    detail: options.detail,
    buttons: ['Yes', 'No'],
    defaultId: 1, // No is default
    cancelId: 1
  });
  return result.response === 0; // 0 = Yes, 1 = No
});

ipcMain.handle('show-alert-dialog', async (event, options: { title: string; message: string; detail?: string }) => {
  await dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: options.title,
    message: options.message,
    detail: options.detail,
    buttons: ['OK']
  });
});

ipcMain.handle('show-error-dialog', async (event, options: { title: string; message: string; detail?: string }) => {
  await dialog.showMessageBox(mainWindow!, {
    type: 'error',
    title: options.title,
    message: options.message,
    detail: options.detail,
    buttons: ['OK']
  });
});

 