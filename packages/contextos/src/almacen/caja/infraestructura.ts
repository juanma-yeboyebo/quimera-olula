import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    Caja,
    CajaAPI,
    DeleteCaja,
    GetCaja,
    GetCajas,
    GetMovimientosCaja,
    MovimientoCaja,
    PatchCaja,
    PostCaja
} from "./diseño.ts";

const baseUrlCaja = `/almacen/caja`;
const baseUrlTransferencia = `/almacen/transferencia`;

export const cajaFromApi = (cajaApi: CajaAPI): Caja => ({
    ...cajaApi,
});

export const cajaToApi = (caja: Caja): CajaAPI => ({
    ...caja,
});

export const getCaja: GetCaja = async (id) =>
    await RestAPI.get<{ datos: CajaAPI }>(`${baseUrlCaja}/${id}`).then((respuesta) =>
        cajaFromApi(respuesta.datos)
    );

export const getCajas: GetCajas = async (
    filtro,
    orden,
    paginacion?
) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: CajaAPI[]; total: number }>(baseUrlCaja + q);
    return { datos: respuesta.datos.map(cajaFromApi), total: respuesta.total };
};

export const postCaja: PostCaja = async (caja) => {
    return await RestAPI.post(baseUrlCaja, caja, "Error al guardar Caja").then(
        (respuesta) => respuesta.id
    );
};

export const patchCaja: PatchCaja = async (id, caja) => {
    const apiCaja = cajaToApi(caja as Caja);
    const cajaSinNulls = Object.fromEntries(
        Object.entries(apiCaja).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlCaja}/${id}`, cajaSinNulls, "Error al guardar Caja");
};

export const deleteCaja: DeleteCaja = async (id) => {
    await RestAPI.delete(`${baseUrlCaja}/${id}`, "Error al borrar Caja");
};

export const postLineaCaja = async (caja: Caja, sku: string, cantidad: string) => {
    const cajaConLinea = {
        id: caja.id,
        caja_id: caja.id,
        almacen_destino_id: caja.codigo_almacen,
        almacen_origen_id: "",
        sku,
        cantidad: Number(cantidad),
    };
    return await RestAPI.post(baseUrlTransferencia + "/caja", cajaConLinea, "Error al guardar articulo en caja").then(
        (respuesta) => respuesta.id
    );
};

export const getMovimientosCaja: GetMovimientosCaja = async (id) => {
    return await RestAPI.get<{ datos: MovimientoCaja[] }>(
        `${baseUrlCaja}/${id}/movimientos`
    ).then((respuesta) => {
        const movimientos = respuesta.datos.map((d) => d);
        return { datos: movimientos, total: movimientos.length };
    });
};