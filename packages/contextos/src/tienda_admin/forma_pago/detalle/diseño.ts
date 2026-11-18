import { FormaPagoTiendaDetalle } from "../diseño.ts";

export type EstadoDetalleFormaPago = "INICIAL" | "ABIERTO";

export type ContextoDetalleFormaPago = {
    estado: EstadoDetalleFormaPago;
    forma: FormaPagoTiendaDetalle;
};
