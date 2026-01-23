import { Contacto } from "../diseño.ts";

export type EstadoMaestroContactos = "INICIAL" | "CREANDO";

export type ContextoMaestroContactos = {
    estado: EstadoMaestroContactos;
    contactos: Contacto[];
    totalContactos: number;
    activo: Contacto | null;
};