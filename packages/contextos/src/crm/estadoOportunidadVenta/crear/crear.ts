import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { EstadoOportunidad } from "../diseño.ts";

export const metaNuevoEstadoOportunidad: MetaModelo<EstadoOportunidad> = {
    campos: {
        descripcion: { requerido: true, validacion: (estado: EstadoOportunidad) => stringNoVacio(estado.descripcion) },
        probabilidad: { requerido: true, tipo: "numero" },
        valor_defecto: { requerido: true, tipo: "checkbox" },
    },
};

export const nuevoEstadoOportunidadVacio: EstadoOportunidad = {
    id: '',
    descripcion: '',
    probabilidad: 0,
    valor_defecto: false,
};