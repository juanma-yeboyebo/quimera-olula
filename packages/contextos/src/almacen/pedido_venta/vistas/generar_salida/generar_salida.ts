import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { Modelo } from "@olula/lib/diseño.ts";

export interface NuevaGenerarSalida extends Modelo {
    ubicacionDestinoId: string;
}

export const metaGenerarSalida: MetaModelo<NuevaGenerarSalida> = {
    campos: {
        ubicacionDestinoId: { requerido: true, validacion: (m) => stringNoVacio(m.ubicacionDestinoId) },
    },
};

export const generarSalidaVacia: NuevaGenerarSalida = {
    ubicacionDestinoId: "",
};
