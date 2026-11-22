import { Maquina } from "@olula/lib/diseño.ts";
import {
    cambiarDatos,
    cargarCuenta,
    confirmarPedido,
    elegirDireccion,
    guardarDatos,
    iniciarPago,
    volverADatos,
} from "./detalle.ts";
import { ContextoCheckout, EstadoCheckout } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoCheckout, ContextoCheckout> = () => ({
    DATOS: {
        datos_cambiados: [cambiarDatos],
        cargar_cuenta: [cargarCuenta],
        direccion_elegida: [elegirDireccion],
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
