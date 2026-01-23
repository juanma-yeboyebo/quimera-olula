import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroContactos, EstadoMaestroContactos } from "./diseño.ts";
import { activarContacto, cambiarContactoEnLista, desactivarContactoActivo, incluirContactoEnLista, quitarContactoDeLista, recargarContactos } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroContactos, ContextoMaestroContactos> = () => {
    return {
        INICIAL: {
            contacto_cambiado: cambiarContactoEnLista,

            contacto_seleccionado: activarContacto,

            contacto_deseleccionado: desactivarContactoActivo,

            contacto_borrado: quitarContactoDeLista,

            recarga_de_contactos_solicitada: recargarContactos,

            creacion_de_contacto_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_contacto_cancelada: "INICIAL",

            contacto_creado: [incluirContactoEnLista, activarContacto, "INICIAL"],
        }
    }
}
