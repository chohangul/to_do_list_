import { app, BrowserWindow } from 'electron';
import path from 'path';
import { loadDatabaseOnStart, registerDbIpc } from './ipc/db';
import { registerTaskIpc } from './ipc/tasks';

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  loadDatabaseOnStart();
  createWindow();
  registerDbIpc(win);
  registerTaskIpc();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
