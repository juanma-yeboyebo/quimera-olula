import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { FuenteLead } from "../diseño.ts";

export const metaNuevaFuenteLead: MetaModelo<FuenteLead> = {
    campos: {
        descripcion: { requerido: true, validacion: (fuente: FuenteLead) => stringNoVacio(fuente.descripcion) },
    },
};

export const nuevaFuenteLeadVacia: FuenteLead = {
    id: '',
    descripcion: '',
    valor_defecto: false,
};