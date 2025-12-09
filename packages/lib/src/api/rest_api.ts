import type { API } from "./diseño.ts";
import { tokenAcceso } from "./token_acceso.ts";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const llamada = async <T>({ method, url, headers = {}, body, msgError }: {
  method: string,
  url: string,
  headers?: Record<string, string>,
  body?: T,
  msgError?: string
}): Promise<Response> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Authorization": `Bearer ${tokenAcceso.obtener() ?? ""}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // if ([401, 403].includes(response.status)) {
  //   window.location.href = "/login";
  //   return Promise.reject();
  // }

  if (!response.ok) {
    const errorText = await response.text();
    const error = {
      nombre: msgError || `Error ${response.status}`,
      descripcion: errorText,
    };
    return Promise.reject(error);
  }

  return response;
};

const consulta = async <T>(
  url: string,
  msgError?: string
): Promise<T> => {
  return llamada({ method: "GET", url, headers: { "Content-Type": "application/json" }, msgError })
    .then(r => r.json() as Promise<T>);
};

const comando = async <T, U>(
  method: string,
  url: string,
  msgError?: string,
  body?: Partial<T>
): Promise<U> => {
  return llamada({ method, url, headers: { "Content-Type": "application/json" }, body, msgError })
    .then(r => {
      const textoPlano = r.headers.get('content-type')!.startsWith('text/plain');

      return (textoPlano ? r.text().then(t => ({ respuesta: t })) : r.json()) as Promise<U>;
    });
};

const obtenerBlob = async (
  url: string,
  msgError?: string
): Promise<Blob> => {
  return llamada({ method: "GET", url, msgError })
    .then(r => r.blob());
};

export const RestAPI: API = {
  get: <T>(url: string, msgError?: string) => consulta<T>(url, msgError),
  post: <T>(url: string, body: T, msgError?: string) => comando<T, { id: string }>("POST", url, msgError, body),
  put: <T>(url: string, body: T, msgError?: string) => comando<T, void>("PUT", url, msgError, body),
  patch: <T>(url: string, body: Partial<T>, msgError?: string) => comando<T, void>("PATCH", url, msgError, body),
  delete: (url: string, msgError?: string) => comando("DELETE", url, msgError),
  blob: (url: string, msgError?: string) => obtenerBlob(url, msgError),
}
