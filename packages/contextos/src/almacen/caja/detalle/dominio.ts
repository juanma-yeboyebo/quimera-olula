import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import {
    Caja,
    CajaContenido,
    CajaDetalle,
    CajaMonoproductoContenido,
    ComponenteCaja,
    MaterialCaja,
} from "../diseño.ts";
import { getCaja, patchCaja } from "../infraestructura.ts";
import { ContextoCaja, EstadoCaja } from "./diseño.ts";

type ProcesarCaja = ProcesarContexto<EstadoCaja, ContextoCaja>;
const pipeCaja = ejecutarListaProcesos<EstadoCaja, ContextoCaja>;

export const metaCaja: MetaModelo<Caja> = {
    campos: {
        idUbicacion: {
            requerido: true,
            validacion: (m: Caja) => stringNoVacio(m.idUbicacion),
        },
    },
};

export const cajaVaciaInicial = (): CajaDetalle => ({
    id: "",
    lpn: "",
    idUbicacion: "",
    ubicacion: "",
    idContenedor: null,
    contenido: [],
});

export const contextoDetalleCajaInicial: ContextoCaja = {
    estado: "INICIAL",
    caja: cajaVaciaInicial(),
};

export const esMaterial = (comp: ComponenteCaja): comp is MaterialCaja =>
    "sku" in comp;

export const esSubcaja = (comp: ComponenteCaja): comp is CajaContenido =>
    "contenido" in comp;

export const esCajaMonoproducto = (caja: CajaDetalle): caja is CajaMonoproductoContenido =>
    "materiales" in caja;

const cargarCaja = (idCaja: string): ProcesarCaja => async (contexto) => {
    const caja = await getCaja(idCaja);
    return pipeCaja(contexto, [
        async (ctx) => ({ ...ctx, caja }),
        "ABIERTO",
    ]);
};

export const cargarContexto: ProcesarCaja = async (contexto, payload) => {
    const idCaja = payload as string;
    if (idCaja) {
        return cargarCaja(idCaja)(contexto);
    }
    return { ...contexto, estado: "INICIAL", caja: cajaVaciaInicial() };
};

export const refrescarCaja: ProcesarCaja = async (contexto) => {
    const caja = await getCaja(contexto.caja.id);
    return [
        { ...contexto, caja },
        [["caja_cambiada", caja]],
    ];
};

export const guardarCaja = async (
    contexto: ContextoCaja,
    caja: Caja
): Promise<void> => {
    if (caja.idUbicacion !== contexto.caja.idUbicacion ||
        caja.idContenedor !== contexto.caja.idContenedor) {
        await patchCaja(caja.id, caja);
    }
};
