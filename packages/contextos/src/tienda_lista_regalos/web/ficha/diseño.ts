import { FichaLineaLista } from "../diseño.ts";

export type EstadoFichaLinea =
    | "CARGANDO"
    | "LISTO"
    | "NO_ENCONTRADA"
    | "ERROR"
    | "AÑADIENDO"
    | "CARRITO_DE_OTRA_LISTA";

export type ClaveFichaLinea = {
    token: string;
    idLinea: string;
};

export type ContextoFichaLinea = {
    estado: EstadoFichaLinea;
    clave: ClaveFichaLinea | null;
    nombreLista: string;
    ficha: FichaLineaLista | null;
    cantidad: number;
};
