import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { ComponentType, useContext } from "react";

export const useHueco = <P extends object = object>(
    nombre: string,
    base: ComponentType<P>,
): ComponentType<P> => {
    const { app } = useContext(FactoryCtx);
    const hueco = app.TiendaOnline?.[nombre] as ComponentType<P> | null | undefined;
    return hueco ?? base;
};
