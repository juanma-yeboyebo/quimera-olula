import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Ubicacion extends Entidad {
    id: string;
    codigo: string;
    idZona: string;
    zona: string;
};



export interface StockUbicacionItem extends Entidad {
    id: string;
    stockId: string;
    ubicacionId: string;
    ubicacion: string;
    articulo: string;
    articuloId: string;
    cantidadFisica: number;
}

export interface MoviStockUbicacion extends Entidad {
    id: string;
    cantidad: number;
    fechaHora: Date;
    idLote: string;
    lote: string
    idCaja: string | null;
    caja: string | null
    concepto: string
}

export interface StockUbicacion extends StockUbicacionItem {
    movimientos: MoviStockUbicacion[]
}


export type GetUbicacion = (id: string) => Promise<Ubicacion>;
export type GetUbicaciones = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => RespuestaLista<Ubicacion>;

export type PostUbicacion = (ubicacion: Partial<Ubicacion>) => Promise<string>;
export type PatchUbicacion = (id: string, ubicacion: Partial<Ubicacion>) => Promise<void>;
export type DeleteUbicacion = (id: string) => Promise<void>;
export type GetStocksUbicacion = (ubicacionId: string) => Promise<StockUbicacionItem[]>;
export type GetStockUbicacion = (stockUbicacionId: string) => Promise<StockUbicacion>;


