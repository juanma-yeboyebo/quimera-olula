import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Articulo } from "./diseño";

export const articuloVacio: Articulo = {
    id: "",
    descripcion: "",
};

export const metaArticulo: MetaModelo<Articulo> = {
    campos: {
        descripcion: { requerido: true, validacion: (m: Articulo) => stringNoVacio(m.descripcion) },
    },
};

export const nuevoArticuloVacio: Partial<Articulo> = {
    descripcion: "",

};

export const metaNuevoArticulo: MetaModelo<Partial<Articulo>> = {
    campos: {
        descripcion: { requerido: true, validacion: (m) => stringNoVacio(m.descripcion || "") },
    },
};
