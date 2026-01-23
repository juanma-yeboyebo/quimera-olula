import { EstadoModelo, initEstadoModelo, MetaModelo } from "@olula/lib/dominio.ts";
import { Contacto } from "./diseño.ts";


export const contactoVacio: Contacto = {
    id: '',
    nombre: '',
    email: '',
    nif: '',
    telefono1: '',
};

export const initEstadoContacto = (contacto: Contacto): EstadoModelo<Contacto> => {
    return initEstadoModelo(contacto);
};

export const metaContacto: MetaModelo<Contacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
        nif: { requerido: false },
        telefono1: { requerido: false },
    }
};

export const initEstadoContactoVacio = () => initEstadoContacto(contactoVacio)

