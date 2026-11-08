import { Maquina } from "@olula/lib/diseño.ts";
import {
    borrarDireccion,
    cargarCuenta,
    cerrarFormulario,
    guardarDatos,
    guardarDireccion,
    marcarEnvio,
    marcarFacturacion,
    verMasPedidos,
} from "./detalle.ts";
import { ContextoCuenta, EstadoCuenta } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoCuenta, ContextoCuenta> = () => ({
    CARGANDO: {
        cargar: [cargarCuenta],
    },
    LISTA: {
        ver_mas: [verMasPedidos],
        cerrar_formulario: [cerrarFormulario],
        guardar_datos: ["GUARDANDO", guardarDatos],
        guardar_direccion: ["GUARDANDO", guardarDireccion],
        borrar_direccion: ["GUARDANDO", borrarDireccion],
        marcar_envio: ["GUARDANDO", marcarEnvio],
        marcar_facturacion: ["GUARDANDO", marcarFacturacion],
    },
    GUARDANDO: {
    },
    SIN_CUENTA: {},
    ERROR: {
        reintentar: ["CARGANDO", cargarCuenta],
    },
});
