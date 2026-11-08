import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroCategoria, EstadoMaestroCategoria } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroCategoria, ContextoMaestroCategoria> = () => ({
    INICIAL: {
        website_cambiado: [maestro.cambiarWebsite, maestro.recargarArbol],
        recarga_solicitada: [maestro.recargarArbol],
        categoria_seleccionada: [maestro.seleccionarCategoria],
        categoria_deseleccionada: [maestro.deseleccionarCategoria],
        categoria_guardada: [maestro.recargarArbol],
        categoria_borrada: [maestro.deseleccionarCategoria, maestro.recargarArbol],
        subir_solicitado: [maestro.subirCategoria, maestro.recargarArbol],
        bajar_solicitado: [maestro.bajarCategoria, maestro.recargarArbol],
        categoria_soltada: [maestro.soltarCategoria, maestro.recargarArbol],
        alta_solicitada: [maestro.iniciarAlta],
        mover_solicitado: [maestro.iniciarMovimiento],
    },

    CREANDO: {
        categoria_creada: [maestro.categoriaCreada, maestro.recargarArbol],
        alta_cancelada: "INICIAL",
    },

    MOVIENDO: {
        movimiento_confirmado: [maestro.confirmarMovimiento, maestro.recargarArbol],
        movimiento_cancelado: "INICIAL",
    },
});
