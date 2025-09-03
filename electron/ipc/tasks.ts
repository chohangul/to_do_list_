import { ipcMain } from 'electron';
import { z } from 'zod';
import { getDb } from './db';

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  due_date: z.string().optional(),
  status: z.string(),
  priority: z.number(),
});

export function registerTaskIpc() {
  ipcMain.handle('tasks:list', () => {
    return getDb().prepare('SELECT * FROM tasks ORDER BY due_date').all();
  });

  ipcMain.handle('tasks:get', (_, id: string) => {
    return getDb().prepare('SELECT * FROM tasks WHERE id=?').get(id);
  });

  ipcMain.handle('tasks:create', (_, task) => {
    const t = taskSchema.parse(task);
    const now = new Date().toISOString();
    getDb()
      .prepare(
        'INSERT INTO tasks (id,title,description,due_date,status,priority,created_at,updated_at) VALUES (@id,@title,@description,@due_date,@status,@priority,@created_at,@updated_at)',
      )
      .run({
        ...t,
        description: t.description || '',
        due_date: t.due_date || null,
        created_at: now,
        updated_at: now,
      });
    return true;
  });

  ipcMain.handle('tasks:update', (_, { id, patch }) => {
    const fields = Object.keys(patch)
      .map((k) => `${k}=@${k}`)
      .join(',');
    getDb()
      .prepare(
        `UPDATE tasks SET ${fields}, updated_at=@updated_at WHERE id=@id`,
      )
      .run({
        ...patch,
        id,
        updated_at: new Date().toISOString(),
      });
    return true;
  });

  ipcMain.handle('tasks:delete', (_, id: string) => {
    getDb().prepare('DELETE FROM tasks WHERE id=?').run(id);
    return true;
  });
}
