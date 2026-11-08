import { useSyncExternalStore } from "react";

export type TipoAviso = "ok" | "error";

export interface AccionAviso {
    texto: string;
    onClick: () => void;
}

export interface AvisoTienda {
    id: number;
    texto: string;
    tipo: TipoAviso;
    accion?: AccionAviso;
}

export const DURACION_AVISO_MS = 3000;
export const MAXIMO_AVISOS = 3;

let avisos: AvisoTienda[] = [];
let siguienteId = 1;
const temporizadores = new Map<number, ReturnType<typeof setTimeout>>();
const listeners = new Set<() => void>();

const notificar = () => listeners.forEach((l) => l());

const pararTemporizador = (id: number) => {
    const t = temporizadores.get(id);
    if (t === undefined) return;
    clearTimeout(t);
    temporizadores.delete(id);
};

export const obtenerAvisos = (): AvisoTienda[] => avisos;

export const suscribirAvisos = (cb: () => void): (() => void) => {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
};

export const cerrarAviso = (id: number) => {
    pararTemporizador(id);
    if (!avisos.some((a) => a.id === id)) return;
    avisos = avisos.filter((a) => a.id !== id);
    notificar();
};

export const reanudarAviso = (id: number) => {
    if (!avisos.some((a) => a.id === id)) return;
    pararTemporizador(id);
    temporizadores.set(
        id,
        setTimeout(() => cerrarAviso(id), DURACION_AVISO_MS)
    );
};

export const pausarAviso = (id: number) => pararTemporizador(id);

export const mostrarAviso = (aviso: Omit<AvisoTienda, "id">): number => {
    const id = siguienteId++;
    const todos = [...avisos, { ...aviso, id }];
    const sobran = todos.slice(0, Math.max(0, todos.length - MAXIMO_AVISOS));
    sobran.forEach((a) => pararTemporizador(a.id));
    avisos = todos.slice(sobran.length);
    reanudarAviso(id);
    notificar();
    return id;
};

export const reiniciarAvisos = () => {
    temporizadores.forEach((t) => clearTimeout(t));
    temporizadores.clear();
    avisos = [];
    siguienteId = 1;
    notificar();
};

export const useAvisos = (): AvisoTienda[] =>
    useSyncExternalStore(suscribirAvisos, obtenerAvisos);
