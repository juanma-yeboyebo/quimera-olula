import { DatosCheckout, ErroresCheckout } from "../diseño.ts";

export type EstadoCheckout = "DATOS" | "GUARDANDO" | "REVISION" | "PAGANDO" | "REDIRIGIENDO";

export type ContextoCheckout = {
    estado: EstadoCheckout;
    datos: DatosCheckout;
    errores: ErroresCheckout;
    error: string | null;
};
