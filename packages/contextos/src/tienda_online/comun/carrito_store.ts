import { useSyncExternalStore } from "react";
import { CarritoTienda } from "./diseño.ts";
import { claveCarrito, debeDescartarToken } from "./dominio.ts";
import { getCarrito, postCarrito } from "./infraestructura.ts";
import { fijarStoreViewActivo } from "./storeview.ts";

let codigoStoreView: string | null = null;
let token: string | null = null;
let carrito: CarritoTienda | null = null;
const listeners = new Set<() => void>();

const notificar = () => listeners.forEach((l) => l());

const guardarToken = (nuevo: string) => {
    token = nuevo;
    if (codigoStoreView) localStorage.setItem(claveCarrito(codigoStoreView), nuevo);
};

export const obtenerToken = (): string | null => token;

export const obtenerCarrito = (): CarritoTienda | null => carrito;

export const suscribir = (cb: () => void): (() => void) => {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
};

export const olvidarCarrito = () => {
    if (codigoStoreView) localStorage.removeItem(claveCarrito(codigoStoreView));
    token = null;
    carrito = null;
    notificar();
};

export const recargarCarrito = async (): Promise<void> => {
    if (!token) {
        carrito = null;
        notificar();
        return;
    }
    try {
        const recargado = await getCarrito(token);
        if (debeDescartarToken(recargado.estado)) {
            olvidarCarrito();
            return;
        }
        carrito = recargado;
        notificar();
    } catch (e) {
        if ((e as { estado?: number })?.estado === 404) {
            olvidarCarrito();
            return;
        }
        throw e;
    }
};

export const iniciarCarrito = async (codigo: string): Promise<void> => {
    codigoStoreView = codigo;
    fijarStoreViewActivo(codigo);
    token = localStorage.getItem(claveCarrito(codigo));
    carrito = null;
    notificar();
    if (token) await recargarCarrito();
};

export const asegurarCarrito = async (): Promise<string> => {
    if (token) return token;
    const nuevo = await postCarrito();
    guardarToken(nuevo);
    await recargarCarrito();
    return nuevo;
};

export const useCarritoTienda = (): CarritoTienda | null =>
    useSyncExternalStore(suscribir, obtenerCarrito);
