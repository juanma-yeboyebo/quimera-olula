export type API = {
  get: <T>(url: string, msgError?: string) => Promise<T>;
  post: <T>(url: string, body: T, msgError?: string) => Promise<{ id: string }>;
  put: <T>(url: string, body: T, msgError?: string) => Promise<void>;
  patch: <T>(url: string, body: Partial<T>, msgError?: string) => Promise<void>;
  delete: (url: string, msgError?: string) => Promise<void>;
  blob: (url: string, msgError?: string) => Promise<Blob>;
  postBlob: <T>(url: string, body: T, msgError?: string) => Promise<Blob>;
};
