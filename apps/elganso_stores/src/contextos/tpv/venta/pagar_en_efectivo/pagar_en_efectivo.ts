import { divisaTpv } from "#/tpv/comun/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoPagoEfectivo } from "./diseño.ts";

export const nuevoPagoEfectivoInicial: NuevoPagoEfectivo = {
    importe: 0,
}

export const metaNuevoPagoEfectivo: MetaModelo<NuevoPagoEfectivo> = {
    campos: {
        importe: { requerido: true, tipo: "moneda", divisa: divisaTpv },
    }
};
