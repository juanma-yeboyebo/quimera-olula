import { Entidad } from "@olula/lib/diseño.ts";

export interface Lead extends Entidad {
    id: string;
    tipo: string;
    estado_id: string;
    nombre: string;
    id_fiscal: string;
    cliente_id: string;
    proveedor_id: string | null;
    direccion: string;
    cod_postal: string | null;
    ciudad: string;
    provincia_id: string | null;
    provincia: string;
    pais_id: string;
    pais: string | null;
    telefono_1: string;
    telefono_2: string;
    email: string;
    web: string;
    contacto_id: string;
    fuente_id: string;
    responsable_id: string;
}

export interface LeadAPI extends Entidad {
    id: string;
    tipo: string;
    estado_id: string;
    nombre: string;
    id_fiscal: string;
    cliente_id: string;
    proveedor_id: string;
    direccion: DireccionLeadAPI;
    email: string;
    web: string;
    contacto_id: string;
    fuente_id: string;
    responsable_id: string;
}

export type LeadToAPI = Omit<LeadAPI, "direccion"> & {
    direccion: DireccionLead;
};

export type DireccionLead = {
    nombre_via: string;
    cod_postal: string;
    ciudad: string;
    provincia_id: string | null;
    provincia: string;
    pais_id: string;
    pais: string;
    telefono: string;
    tipo_via: string;
    numero: string;
    otros: string;
    apartado: string;
};

export type DireccionLeadAPI = {
    direccion: string;
    cod_postal: string;
    ciudad: string;
    provincia_id: string | null;
    provincia: string;
    pais_id: string;
    pais: string;
    telefono_1: string;
    telefono_2: string;
    tipo_via: string;
    numero: string;
    otros: string;
    apartado: string;
};
