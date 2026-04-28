import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { EstadoLead } from "../diseño.ts";

export const metaNuevoEstadoLead: MetaModelo<EstadoLead> = {
    campos: {
        descripcion: { requerido: true, validacion: (estado: EstadoLead) => stringNoVacio(estado.descripcion) },
    },
};

export const nuevoEstadoLeadVacio: EstadoLead = {
    id: '',
    descripcion: '',
    valor_defecto: false,
};