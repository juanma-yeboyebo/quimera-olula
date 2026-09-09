import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    ampliarArticulosProv,
    ArticulosProv,
    asignarCuentaPagoProceso,
    cargarContexto,
    Cuentas,
    darDeAltaProceso,
    darDeBajaProceso,
    desasignarCuentaPagoProceso,
    Direcciones,
    limpiarContexto,
    marcarPrincipalProceso,
    onCuentaBorrada,
    onCuentaCambiada,
    onCuentaCreada,
    onDireccionBorrada,
    onDireccionCambiada,
    onDireccionCreada,
    recargarArticulosProv,
    refrescarProveedor,
} from "./detalle.ts";
import { ContextoDetalleProveedor, EstadoDetalleProveedor } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleProveedor, ContextoDetalleProveedor> = () => {
    return {
        INICIAL: {
            proveedor_id_cambiado: [cargarContexto],

            proveedor_deseleccionado: [
                limpiarContexto,
                publicar('proveedor_deseleccionado', null),
            ],
        },

        ABIERTO: {
            proveedor_id_cambiado: [cargarContexto],

            proveedor_guardado: [refrescarProveedor],

            proveedor_deseleccionado: [
                limpiarContexto,
                publicar('proveedor_deseleccionado', null),
            ],

            borrado_solicitado: "BORRANDO",

            baja_solicitada: [darDeBajaProceso],
            alta_solicitada: [darDeAltaProceso],

            direccion_seleccionada: [Direcciones.activar],
            alta_direccion_solicitada: "CREANDO_DIRECCION",
            cambio_direccion_solicitado: "CAMBIANDO_DIRECCION",
            baja_direccion_solicitada: "BORRANDO_DIRECCION",
            principal_solicitada: [marcarPrincipalProceso],

            cuenta_seleccionada: [Cuentas.activar],
            alta_cuenta_solicitada: "CREANDO_CUENTA",
            cambio_cuenta_solicitado: "CAMBIANDO_CUENTA",
            baja_cuenta_solicitada: "BORRANDO_CUENTA",
            cuenta_pago_solicitada: [asignarCuentaPagoProceso],
            cuenta_pago_desasignada: [desasignarCuentaPagoProceso],

            articulo_proveedor_seleccionado: [ArticulosProv.activar],
            recarga_de_articulos_prov_solicitada: [recargarArticulosProv],
            criteria_de_articulos_prov_cambiado: [ArticulosProv.filtrar, recargarArticulosProv],
            siguiente_pagina_de_articulos_prov: [ArticulosProv.filtrar, ampliarArticulosProv],
        },

        BORRANDO: {
            proveedor_borrado: [
                publicar<EstadoDetalleProveedor, ContextoDetalleProveedor>(
                    'proveedor_borrado',
                    (contexto) => contexto.proveedor.id
                ),
                limpiarContexto,
            ],

            borrado_cancelado: "ABIERTO",
        },

        CREANDO_DIRECCION: {
            direccion_creada: [onDireccionCreada, "ABIERTO"],
            alta_de_direccion_cancelada: "ABIERTO",
        },

        CAMBIANDO_DIRECCION: {
            direccion_cambiada: [onDireccionCambiada, "ABIERTO"],
            cambio_de_direccion_cancelado: "ABIERTO",
        },

        BORRANDO_DIRECCION: {
            direccion_borrada: [onDireccionBorrada, "ABIERTO"],
            borrado_de_direccion_cancelado: "ABIERTO",
        },

        CREANDO_CUENTA: {
            cuenta_creada: [onCuentaCreada, "ABIERTO"],
            alta_de_cuenta_cancelada: "ABIERTO",
        },

        CAMBIANDO_CUENTA: {
            cuenta_cambiada: [onCuentaCambiada, "ABIERTO"],
            cambio_de_cuenta_cancelado: "ABIERTO",
        },

        BORRANDO_CUENTA: {
            cuenta_borrada: [onCuentaBorrada, "ABIERTO"],
            borrado_de_cuenta_cancelado: "ABIERTO",
        },
    };
};
