import { NodoCategoria, PosicionSoltar } from "../diseño.ts";

export type EstadoMaestroCategoria = "INICIAL" | "CREANDO" | "MOVIENDO";

export type ContextoMaestroCategoria = {
    estado: EstadoMaestroCategoria;
    websiteId: number | null;
    arbol: NodoCategoria[];
    activa: string | undefined;
    padreAlta: string | null;
    moviendo: string | null;
};

export type PayloadSoltado = {
    origenId: string;
    destinoId: string;
    posicion: PosicionSoltar;
};
