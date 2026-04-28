import { EstadoIncidencia, PrioridadIncidencia } from "../diseño.ts";

export type NuevaIncidencia = {
    descripcion: string;
    descripcion_larga: string;
    nombre: string;
    prioridad: PrioridadIncidencia;
    estado: EstadoIncidencia;
    fecha: Date;
};