import { Entidad } from "@olula/lib/diseño.ts";


export interface Contacto extends Entidad {
  id: string;
  nombre: string;
  email: string;
  nif?: string
  telefono1?: string;
};

export type GetContacto = (id: string) => Promise<Contacto>;
export type PatchContacto = (id: string, contacto: Contacto) => Promise<void>;