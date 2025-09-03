import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { useUiStore } from '../stores/ui';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: number;
  due_date?: string;
}

const fetchTasks = () => window.api.invoke<Task[]>('tasks:list');

export default function Home() {
  const qc = useQueryClient();
  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');

  const createMutation = useMutation({
    mutationFn: (title: string) => {
      const t: Task = {
        id: crypto.randomUUID(),
        title,
        status: 'open',
        priority: 2,
      };
      return window.api.invoke('tasks:create', t);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const view = useUiStore((s) => s.view);
  const setView = useUiStore((s) => s.setView);

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl">할 일</h1>
        <div className="flex items-center gap-2">
          <button
            className={`px-2 py-1 rounded ${
              view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setView('list')}
          >
            목록
          </button>
          <button
            className={`px-2 py-1 rounded ${
              view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setView('calendar')}
          >
            달력
          </button>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="bg-blue-500 text-white px-3 py-1 rounded flex items-center">
              <Plus className="w-4 h-4 mr-1" /> 새 작업
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content className="bg-white p-4 rounded shadow fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64">
                <Dialog.Title className="mb-2">새 작업</Dialog.Title>
                <input
                  autoFocus
                  className="border p-2 w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="작업 제목"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Dialog.Close className="px-3 py-1">취소</Dialog.Close>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => {
                      createMutation.mutate(title);
                      setTitle('');
                      setOpen(false);
                    }}
                  >
                    추가
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
      <ul>
        {tasks?.map((t) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b py-2 flex"
          >
            <span className="flex-1">{t.title}</span>
            <span className="text-sm text-gray-500">{t.status}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
