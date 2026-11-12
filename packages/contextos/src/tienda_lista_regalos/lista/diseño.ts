import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

export interface ClienteListaRegalos {
    codigo: string;
    nombre: string;
}

export interface ListaRegalos extends Entidad {
    id: string;
    websiteId: number;
    cliente: ClienteListaRegalos;
    nombre: string;
    descripcion: string;
    token: string;
    url: string | null;
    publicada: boolean;
    creada: string;
    lineas: LineaListaRegalos[];
}

export interface LineaListaRegalos extends Entidad {
    id: string;
    referencia: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    cantidadVendida: number;
    pendiente: number;
    orden: number;
}

export interface ItemListaRegalos extends Entidad {
    id: string;
    websiteId: number;
    cliente: ClienteListaRegalos;
    nombre: string;
    publicada: boolean;
    creada: string;
    lineas: number;
    unidades: number;
    vendidas: number;
}

export interface NuevaListaRegalos extends Modelo {
    clienteId: string;
    clienteNombre: string;
    nombre: string;
    descripcion: string;
}

export interface EdicionListaRegalos extends Modelo {
    clienteId: string;
    clienteNombre: string;
    nombre: string;
    descripcion: string;
    publicada: boolean;
}

export interface NuevaLineaListaRegalos extends Modelo {
    referencia: string;
    descripcion: string;
    cantidad: number | null;
    precio: number | null;
}

export interface EdicionLineaListaRegalos extends Modelo {
    precio: number | null;
    cantidad: number | null;
    cantidadVendida: number | null;
}

export interface FiltrosListaRegalos {
    websiteId: number | null;
    texto: string;
}

export type CambiosListaRegalos = Partial<Pick<EdicionListaRegalos, "clienteId" | "nombre" | "descripcion" | "publicada">>;

export type CambiosLineaListaRegalos = {
    precio?: number;
    cantidad?: number;
    cantidadVendida?: number;
    orden?: number;
};

export type CambioOrdenLinea = { id: string; orden: number };

export type GetListaRegalos = (id: string) => Promise<ListaRegalos>;
export type GetListasRegalos = (filtros: FiltrosListaRegalos, criteria: Criteria) => RespuestaLista<ItemListaRegalos>;
export type PostListaRegalos = (websiteId: number, nueva: NuevaListaRegalos) => Promise<string>;
export type PatchListaRegalos = (id: string, cambios: CambiosListaRegalos) => Promise<void>;
export type DeleteListaRegalos = (id: string) => Promise<void>;
export type PostLineaListaRegalos = (id: string, nueva: NuevaLineaListaRegalos) => Promise<string>;
export type PatchLineaListaRegalos = (id: string, lineaId: string, cambios: CambiosLineaListaRegalos) => Promise<void>;
export type DeleteLineaListaRegalos = (id: string, lineaId: string) => Promise<void>;
