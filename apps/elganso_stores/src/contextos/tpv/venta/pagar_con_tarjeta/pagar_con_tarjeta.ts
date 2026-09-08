import { divisaTpv } from "#/tpv/comun/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoPagoTarjeta } from "./diseño.ts";

export const nuevoPagoTarjetaInicial: NuevoPagoTarjeta = {
    importe: 0,
    pendiente: 0
}

const importeValido = (pago: NuevoPagoTarjeta): boolean | string => {
    if (pago.importe > pago.pendiente) {
        return "El importe no puede ser mayor que el pendiente";
    }
    if (pago.importe == 0) {
        return false;
    }
    return true;
}

export const metaNuevoPagoTarjeta: MetaModelo<NuevoPagoTarjeta> = {
    campos: {
        importe: { tipo: "moneda", divisa: divisaTpv, requerido: true, validacion: importeValido },
    }
};
