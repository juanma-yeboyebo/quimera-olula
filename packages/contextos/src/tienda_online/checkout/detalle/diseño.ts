import { DatosCheckout, ErroresCheckout } from "../diseño.ts";

export type EstadoCheckout =
    | "DATOS"
    | "GUARDANDO"
    | "REVISION"
    | "PAGANDO"
    | "REDIRIGIENDO"
    | "CONFIRMANDO"
    | "CONFIRMADO_OK";

export type ContextoCheckout = {
    estado: EstadoCheckout;
    datos: DatosCheckout;
    errores: ErroresCheckout;
    error: string | null;
};
