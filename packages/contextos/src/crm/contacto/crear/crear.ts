import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevoContacto } from "./diseño.ts";

export const nuevoContactoVacio: NuevoContacto = {
    nombre: '',
    email: '',
    nif: '',
    telefono1: '',
};

export const metaNuevoContacto: MetaModelo<NuevoContacto> = {
    campos: {
        nombre: { requerido: true, validacion: (contacto: NuevoContacto) => stringNoVacio(contacto.nombre) },
        email: { requerido: true, tipo: "email", validacion: (contacto: NuevoContacto) => stringNoVacio(contacto.email) },
        nif: { requerido: false },
        telefono1: { requerido: false },
    },
};