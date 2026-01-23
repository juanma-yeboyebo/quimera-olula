import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaAccion } from "./diseño.ts";

export const nuevaAccionVacia: NuevaAccion = {
    fecha: new Date(),
    descripcion: "",
    tipo: "Tarea",
    estado: "Pendiente",
    observaciones: "",
    incidencia_id: "",
    responsable_id: "",
    tarjeta_id: "",
    oportunidad_id: "",
    contacto_id: "",
    cliente_id: "",
};

export const metaNuevaAccion: MetaModelo<NuevaAccion> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        descripcion: { requerido: true, validacion: (accion: NuevaAccion) => stringNoVacio(accion.descripcion) },
        responsable_id: { requerido: true, tipo: "autocompletar" },
    },
};