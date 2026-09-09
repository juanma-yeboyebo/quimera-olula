import { Modelo } from "@olula/lib/diseño.ts";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";

export interface FormEntrada extends Modelo {
    ubicacionId: string;
}

export const metaFormEntrada: MetaModelo<FormEntrada> = {
    campos: {
        ubicacionId: { requerido: true, validacion: (m) => stringNoVacio(m.ubicacionId) },
    },
};

export const formEntradaVacia: FormEntrada = {
    ubicacionId: "",
};
