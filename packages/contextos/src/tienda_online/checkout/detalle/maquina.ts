import { Maquina } from "@olula/lib/diseño.ts";
import {
    cambiarDatos,
    confirmarPedido,
    guardarDatos,
    iniciarPago,
    volverADatos,
} from "./detalle.ts";
import { ContextoCheckout, EstadoCheckout } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoCheckout, ContextoCheckout> = () => ({
    DATOS: {
        datos_cambiados: [cambiarDatos],
        continuar: ["GUARDANDO", guardarDatos],
    },
    GUARDANDO: {},
    REVISION: {
        volver: [volverADatos],
        pagar: ["PAGANDO", iniciarPago],
        confirmar: ["CONFIRMANDO", confirmarPedido],
    },
    PAGANDO: {},
    REDIRIGIENDO: {},
    CONFIRMANDO: {},
    CONFIRMADO_OK: {},
});
