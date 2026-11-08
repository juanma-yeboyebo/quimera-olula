import { useSyncExternalStore } from "react";
import { WebsiteAdmin } from "./diseño.ts";

type Estado = { activo: number | null; websites: WebsiteAdmin[] };

let estado: Estado = { activo: null, websites: [] };
const listeners = new Set<() => void>();

const cambiar = (nuevo: Estado) => {
    estado = nuevo;
    listeners.forEach((l) => l());
};

export const nombreDeWebsite = (websites: WebsiteAdmin[], id: number | null): string | null =>
    websites.find((w) => w.id === id)?.nombre ?? null;

export const obtenerWebsiteActivo = (): number | null => estado.activo;

export const obtenerNombreWebsiteActivo = (): string | null =>
    nombreDeWebsite(estado.websites, estado.activo);

export const fijarWebsiteActivo = (id: number | null) => {
    if (id === estado.activo) return;
    cambiar({ ...estado, activo: id });
};

export const fijarWebsites = (websites: WebsiteAdmin[]) => {
    cambiar({ ...estado, websites });
};

export const suscribirWebsiteActivo = (cb: () => void): (() => void) => {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
};

export const reiniciarWebsiteActivo = () => {
    estado = { activo: null, websites: [] };
    listeners.clear();
};

export const useWebsiteActivo = (): number | null =>
    useSyncExternalStore(suscribirWebsiteActivo, obtenerWebsiteActivo, obtenerWebsiteActivo);

export const useNombreWebsiteActivo = (): string | null =>
    useSyncExternalStore(suscribirWebsiteActivo, obtenerNombreWebsiteActivo, obtenerNombreWebsiteActivo);
