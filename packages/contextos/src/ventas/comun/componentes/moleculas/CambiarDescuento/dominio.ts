import { MetaModelo } from "@olula/lib/dominio.js";
import { CambiarDescuento } from "./diseño.ts";

export const cambiarDescuentoVacio: CambiarDescuento = {
    dto_porcentual: 0,
};

export const metaCambiarDescuento: MetaModelo<CambiarDescuento> = {
    campos: {
        dto_porcentual: { tipo: "decimal", requerido: true, decimales: 2, positivo: true, maximo: 100 },
    }
};
