import UrlsVentasClass from "#/ventas/comun/urls.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "@olula/lib/infraestructura.ts";
import { NuevoPresupuesto, Presupuesto } from "../../ventas/presupuesto/diseño.ts";
import { Accion } from "../accion/diseño.ts";
import UrlsCrmClass from "../comun/urls.ts";
import { NuevaOportunidadVenta } from "./crear/diseño.ts";
import { EstadoOportunidad, OportunidadVenta } from "./diseño.ts";

const UrlsCrm = new UrlsCrmClass();
const UrlsVentas = new UrlsVentasClass();

export const getOportunidadVenta = async (id: string): Promise<OportunidadVenta> =>
    await RestAPI.get<{ datos: OportunidadVenta }>(`${UrlsCrm.OPORTUNIDAD_VENTA}/${id}`).then((respuesta) => respuesta.datos);

export const getOportunidadesVenta = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<OportunidadVenta> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: OportunidadVenta[]; total: number }>(UrlsCrm.OPORTUNIDAD_VENTA + q);
    return { datos: respuesta.datos, total: respuesta.total };
};

export const postOportunidadVenta = async (oportunidad: NuevaOportunidadVenta): Promise<string> => {
    return await RestAPI.post(UrlsCrm.OPORTUNIDAD_VENTA, oportunidad, "Error al guardar oportunidad de venta").then((respuesta) => respuesta.id);
};

export const patchOportunidadVenta = async (id: string, oportunidad: Partial<OportunidadVenta>): Promise<void> => {
    await RestAPI.patch(`${UrlsCrm.OPORTUNIDAD_VENTA}/${id}`, oportunidad, "Error al guardar oportunidad de venta");
};

export const deleteOportunidadVenta = async (id: string): Promise<void> =>
    await RestAPI.delete(`${UrlsCrm.OPORTUNIDAD_VENTA}/${id}`, "Error al borrar oportunidad de venta");

export const getEstadosOportunidadVenta = async (filtro: Filtro, orden: Orden): Promise<EstadoOportunidad[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: EstadoOportunidad[] }>(UrlsCrm.ESTADO_OPORTUNIDAD + q).then((respuesta) => respuesta.datos);
}

export const getAccionesOportunidad = async (oportunidadId: string): Promise<Accion[]> => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Accion[] }>(UrlsCrm.ACCION + q).then((respuesta) => respuesta.datos);
};

export const getPresupuestosOportunidad = async (oportunidadId: string): Promise<Presupuesto[]> => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Presupuesto[] }>(UrlsVentas.PRESUPUESTO + q).then((respuesta) => respuesta.datos);
};

export const crearPresupuestoOportunidad = async (oportunidadId: string, cliente_id: string): Promise<string> => {
    const nuevoPresupuesto: Partial<NuevoPresupuesto> = {
        cliente_id: oportunidadId,
        direccion_id: cliente_id,
        empresa_id: "1",
    };

    return await RestAPI.post(UrlsVentas.PRESUPUESTO, nuevoPresupuesto, "Error al crear presupuesto").then((respuesta) => respuesta.id);
}