import { ReciboCompra } from "../diseño.js";

export type EstadoDetalleReciboCompra =
    | 'INICIAL'
    | 'ABIERTO';

export type ContextoDetalleReciboCompra = {
    estado: EstadoDetalleReciboCompra;
    recibo: ReciboCompra;
};
