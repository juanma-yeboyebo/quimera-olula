import { ListaRegalosPublica } from "../diseño.ts";

export type EstadoListaRegalos = "CARGANDO" | "LISTO" | "NO_ENCONTRADA" | "ERROR";

export type ContextoListaRegalos = {
    estado: EstadoListaRegalos;
    token: string | null;
    lista: ListaRegalosPublica | null;
};
