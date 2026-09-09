import { StockUbicacionItem, Ubicacion } from "../../diseño.ts";

export type EstadoUbicacion = "INICIAL" | "ABIERTO" | "BORRANDO";

export type ContextoUbicacion = {
    estado: EstadoUbicacion;
    ubicacion: Ubicacion;
    stocks: StockUbicacionItem[];
};
