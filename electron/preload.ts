/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  invoke: (channel: string, ...args: unknown[]) =>
    ipcRenderer.invoke(channel, ...(args as any[])),
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
