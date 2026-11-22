import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { obtenerToken } from "./carrito_store.ts";
import { origenCarrito } from "./origen_carrito.ts";

export const useSeguirComprando = (tokenCarrito?: string | null): { ruta: string; texto: string } => {
    const { app } = useContext(FactoryCtx);
    const origen = origenCarrito(tokenCarrito === undefined ? obtenerToken() : tokenCarrito);
    if (origen) return origen;
    return {
        ruta: (app.TiendaOnline?.ruta_seguir_comprando as string | undefined) ?? "/catalogo",
        texto: (app.TiendaOnline?.texto_seguir_comprando as string | undefined) ?? "Ir al catálogo",
    };
};
