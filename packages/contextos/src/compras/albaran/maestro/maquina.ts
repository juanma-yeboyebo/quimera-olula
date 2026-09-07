import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroAlbaran, EstadoMaestroAlbaran } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroAlbaran, ContextoMaestroAlbaran> = () => {
    return {
        INICIAL: {
            albaran_seleccionado: [maestro.Albaranes.activar],
            albaran_deseleccionado: [maestro.Albaranes.desactivar],

            albaran_cambiado: [maestro.Albaranes.cambiar],
            albaran_borrado: [maestro.Albaranes.quitar],

            recarga_de_albaranes_solicitada: maestro.recargarAlbaranes,

            criteria_cambiado: [maestro.Albaranes.filtrar, maestro.recargarAlbaranes],

            siguiente_pagina: [maestro.Albaranes.filtrar, maestro.ampliarAlbaranes],

            crear_albaran_solicitado: "CREANDO",

        },

        CREANDO: {
            alta_de_albaran_cancelada: "INICIAL",

            albaran_creado: maestro.incluirAlbaranCreadoPorId,
        },
    };
};
