import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";

export const useSeguirComprando = (): { ruta: string; texto: string } => {
    const { app } = useContext(FactoryCtx);
    return {
        ruta: (app.TiendaOnline?.ruta_seguir_comprando as string | undefined) ?? "/catalogo",
        texto: (app.TiendaOnline?.texto_seguir_comprando as string | undefined) ?? "Ir al catálogo",
    };
};
