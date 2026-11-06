import { FichaProducto } from "../diseño.ts";

export type EstadoFicha = "CARGANDO" | "LISTO" | "NO_ENCONTRADO" | "ERROR" | "AÑADIENDO";

export type ContextoFicha = {
    estado: EstadoFicha;
    ficha: FichaProducto | null;
    cantidad: number;
    aviso: string | null;
    error: string | null;
};
