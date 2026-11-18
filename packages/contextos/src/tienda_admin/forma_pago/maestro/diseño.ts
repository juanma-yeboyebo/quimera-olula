import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { FormaPagoTienda } from "../diseño.ts";

export type EstadoMaestroFormaPago = "INICIAL" | "CREANDO";

export type ContextoMaestroFormaPago = {
    estado: EstadoMaestroFormaPago;
    formas: ListaActivaEntidades<FormaPagoTienda>;
    websiteId: number | null;
};
