import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { NuevaCaja } from "../diseño.ts";

export const getNuevaCajaInicial = (idUbicacion?: string | null): NuevaCaja => ({
    idUbicacion: idUbicacion || "",
    idTipoCaja: "",
});

export const metaNuevaCaja: MetaModelo<NuevaCaja> = {
    campos: {
        idUbicacion: {
            requerido: true,
            validacion: (m: NuevaCaja) => stringNoVacio(m.idUbicacion),
        },
        idTipoCaja: {
            requerido: true,
            validacion: (m: NuevaCaja) => stringNoVacio(m.idTipoCaja),
        },
    },
};
