import { BrowserWindow, dialog, ipcMain, app } from 'electron';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import Store from 'electron-store';

let db: Database.Database;
let dbPath = '';
const store = new Store<{ dbPath: string }>({ name: 'settings' });

export function initDatabase(file: string) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  dbPath = file;
  db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const schema = fs.readFileSync(
    path.join(__dirname, '../db/schema.sql'),
    'utf8',
  );
  db.exec(schema);
  seed();
  store.set('dbPath', file);
}

function seed() {
  const count = db.prepare('SELECT COUNT(*) as c FROM tasks').get() as {
    c: number;
  };
  if (count.c === 0) {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      'INSERT INTO tasks (id,title,description,due_date,status,priority,created_at,updated_at) VALUES (@id,@title,@description,@due_date,@status,@priority,@created_at,@updated_at)',
    );
    stmt.run({
      id: '1',
      title: '예시 작업 1',
      description: '',
      due_date: now,
      status: 'open',
      priority: 1,
      created_at: now,
      updated_at: now,
    });
    stmt.run({
      id: '2',
      title: '예시 작업 2',
      description: '',
      due_date: now,
      status: 'in_progress',
      priority: 2,
      created_at: now,
      updated_at: now,
    });
    stmt.run({
      id: '3',
      title: '예시 작업 3',
      description: '',
      due_date: now,
      status: 'done',
      priority: 3,
      created_at: now,
      updated_at: now,
    });
  }
}

export function getDb() {
  return db;
}

export function registerDbIpc(win: BrowserWindow) {
  ipcMain.handle('db:init', (_, file) => {
    initDatabase(file);
    return true;
  });
  ipcMain.handle('db:switch', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [{ name: 'SQLite', extensions: ['sqlite'] }],
    });
    if (!canceled && filePaths[0]) {
      initDatabase(filePaths[0]);
      return filePaths[0];
    }
    return null;
  });
  ipcMain.handle('db:backup', async (_, destDir: string) => {
    const dest = path.join(destDir, `backup-${Date.now()}.sqlite`);
    fs.copyFileSync(dbPath, dest);
    return dest;
  });
  ipcMain.handle('db:restore', async (_, src: string) => {
    fs.copyFileSync(src, dbPath);
    initDatabase(dbPath);
    return true;
  });
}

export function loadDatabaseOnStart() {
  const saved = store.get('dbPath');
  const defaultPath = path.join(app.getPath('userData'), 'todo.sqlite');
  initDatabase(saved || defaultPath);
}
