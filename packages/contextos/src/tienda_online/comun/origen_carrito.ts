import { claveOrigenCarrito } from "./dominio.ts";
import { codigoStoreViewActivo } from "./storeview.ts";

export interface OrigenCarrito {
    ruta: string;
    texto: string;
}

const clave = (): string | null => {
    const codigo = codigoStoreViewActivo();
    return codigo ? claveOrigenCarrito(codigo) : null;
};

export const recordarOrigenCarrito = (tokenCarrito: string, origen: OrigenCarrito): void => {
    const c = clave();
    if (!c) return;
    try {
        localStorage.setItem(c, JSON.stringify({ token: tokenCarrito, ...origen }));
    } catch {
        return;
    }
};

export const origenCarrito = (tokenCarrito: string | null): OrigenCarrito | null => {
    const c = clave();
    if (!c || !tokenCarrito) return null;
    try {
        const guardado = JSON.parse(localStorage.getItem(c) ?? "null") as
            | (OrigenCarrito & { token: string })
            | null;
        if (!guardado || guardado.token !== tokenCarrito) return null;
        return { ruta: guardado.ruta, texto: guardado.texto };
    } catch {
        return null;
    }
};
