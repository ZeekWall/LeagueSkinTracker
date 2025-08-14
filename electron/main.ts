import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    maxWidth: 1920,
    maxHeight: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: '#0A0E1A',
    titleBarStyle: 'default',
    show: false,
    title: 'LoL Skin Tracker v1.0',
    resizable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    center: true,
    icon: path.join(__dirname, '../../assets/icon.png')
  });

  // Remove menu bar since we're not using File/View menus
  Menu.setApplicationMenu(null);

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Load the built React app
    mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Ensure title is set
    mainWindow.setTitle('LoL Skin Tracker v1.0');
    
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    // Dereference the window object
  });
}

app.whenReady().then(() => {
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