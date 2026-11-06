import { Maquina } from "@olula/lib/diseño.ts";
import { cargarCuenta, verMasPedidos } from "./detalle.ts";
import { ContextoCuenta, EstadoCuenta } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoCuenta, ContextoCuenta> = () => ({
    CARGANDO: {
        cargar: [cargarCuenta],
    },
    LISTA: {
        ver_mas: [verMasPedidos],
    },
    SIN_CUENTA: {},
    ERROR: {
        reintentar: ["CARGANDO", cargarCuenta],
    },
});
