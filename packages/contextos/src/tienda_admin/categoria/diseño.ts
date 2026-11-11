import { Entidad, Modelo } from "@olula/lib/diseño.ts";

export interface NodoCategoria extends Entidad {
    id: string;
    padreId: string | null;
    codigo: string;
    nombre: string;
    slug: string;
    orden: number;
    visible: boolean;
    enMenu: boolean;
    articulos: number;
    hijas: NodoCategoria[];
}

export interface NuevaCategoria extends Modelo {
    codigo: string;
    nombre: string;
    slug: string;
    visible: boolean;
    enMenu: boolean;
}

export interface EdicionCategoria extends Modelo {
    id: string;
    nombre: string;
    slug: string;
    visible: boolean;
    enMenu: boolean;
}

export type CambiosCategoria = Pick<EdicionCategoria, "nombre" | "slug" | "visible" | "enMenu">;

export type PosicionSoltar = "antes" | "despues" | "dentro";

export type OperacionArbol =
    | { tipo: "ordenar"; padreId: string | null; ids: string[] }
    | { tipo: "mover"; id: string; padreId: string | null };

export interface NodoPlano {
    nodo: NodoCategoria;
    profundidad: number;
}

export type PadreCandidato = {
    valor: string;
    descripcion: string;
};

export type GetArbolCategorias = (websiteId: number) => Promise<NodoCategoria[]>;
export type PostCategoria = (
    websiteId: number,
    padreId: string | null,
    nueva: NuevaCategoria,
) => Promise<string>;
export type PatchCategoria = (id: string, cambios: CambiosCategoria) => Promise<void>;
export type PatchMoverCategoria = (id: string, padreId: string | null) => Promise<void>;
export type PatchOrdenarCategorias = (
    websiteId: number,
    padreId: string | null,
    ids: string[],
) => Promise<void>;
export type DeleteCategoria = (id: string) => Promise<void>;
