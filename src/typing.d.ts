export interface Api {
  invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T>;
}

declare global {
  interface Window {
    api: Api;
  }
}
export {};
