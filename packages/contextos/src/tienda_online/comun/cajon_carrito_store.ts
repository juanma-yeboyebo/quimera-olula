import { useSyncExternalStore } from "react";

let abierto = false;
const listeners = new Set<() => void>();

const notificar = () => listeners.forEach((l) => l());

export const estaCajonCarritoAbierto = (): boolean => abierto;

export const suscribirCajonCarrito = (cb: () => void): (() => void) => {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
};

export const abrirCajonCarrito = () => {
    if (abierto) return;
    abierto = true;
    notificar();
};

export const cerrarCajonCarrito = () => {
    if (!abierto) return;
    abierto = false;
    notificar();
};

export const useCajonCarrito = (): boolean =>
    useSyncExternalStore(suscribirCajonCarrito, estaCajonCarritoAbierto);
