import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaIncidencia } from "./diseño.ts";

export const nuevaIncidenciaVacia: NuevaIncidencia = {
    descripcion: "",
    nombre: "",
    prioridad: "media",
    descripcion_larga: "",
    estado: "nueva",
    fecha: new Date(),
};

export const metaNuevaIncidencia: MetaModelo<NuevaIncidencia> = {
    campos: {
        descripcion: { requerido: true, validacion: (incidencia: NuevaIncidencia) => stringNoVacio(incidencia.descripcion) },
        nombre: { requerido: true },
        fecha: { requerido: true, tipo: "fecha" },
        descripcion_larga: { requerido: false },
        prioridad: { requerido: true },
        estado: { requerido: true, tipo: "selector" }
    },
};