import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ReciboCompra } from "../diseño.js";

export type EstadoMaestroReciboCompra = 'INICIAL';

export type ContextoMaestroReciboCompra = {
    estado: EstadoMaestroReciboCompra;
    recibos: ListaActivaEntidades<ReciboCompra>;
};
