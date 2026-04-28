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

type OportunidadVentaAPI = OportunidadVenta & { fecha_cierre?: string };

const oportunidadDesdeAPI = (oportunidadAPI: OportunidadVentaAPI): OportunidadVenta => ({
    ...oportunidadAPI,
    fecha_cierre: oportunidadAPI.fecha_cierre ? new Date(Date.parse(oportunidadAPI.fecha_cierre)) : null,
})

export const getOportunidadVenta = async (id: string): Promise<OportunidadVenta> =>
    await RestAPI.get<{ datos: OportunidadVentaAPI }>(`${UrlsCrm.OPORTUNIDAD_VENTA}/${id}`).then((respuesta) => oportunidadDesdeAPI(respuesta.datos));

export const getOportunidadesVenta = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<OportunidadVenta> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: OportunidadVentaAPI[]; total: number }>(UrlsCrm.OPORTUNIDAD_VENTA + q);
    return { datos: respuesta.datos.map(oportunidadDesdeAPI), total: respuesta.total };
};

export const postOportunidadVenta = async (oportunidad: NuevaOportunidadVenta): Promise<string> => {
    const oportunidadAPI = {
        ...oportunidad,
    }
    return await RestAPI.post(UrlsCrm.OPORTUNIDAD_VENTA, oportunidadAPI, "Error al guardar oportunidad de venta").then((respuesta) => respuesta.id);
};

export const patchOportunidadVenta = async (id: string, oportunidad: Partial<OportunidadVenta>): Promise<void> => {
    const oportunidadAPI = {
        ...oportunidad,
        fecha_cierre: oportunidad.fecha_cierre?.toISOString().slice(0, 10),
    }
    await RestAPI.patch(`${UrlsCrm.OPORTUNIDAD_VENTA}/${id}`, oportunidadAPI, "Error al guardar oportunidad de venta");
};

export const deleteOportunidadVenta = async (id: string): Promise<void> =>
    await RestAPI.delete(`${UrlsCrm.OPORTUNIDAD_VENTA}/${id}`, "Error al borrar oportunidad de venta");

export const getEstadosOportunidadVenta = async (filtro: Filtro, orden: Orden): Promise<EstadoOportunidad[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: EstadoOportunidad[] }>(UrlsCrm.ESTADO_OPORTUNIDAD + q).then((respuesta) => respuesta.datos);
}

export const getAccionesOportunidad = async (oportunidadId: string): RespuestaLista<Accion> => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Accion[], total: number }>(UrlsCrm.ACCION + q).then((respuesta) => respuesta);
};

export const getPresupuestosOportunidad = async (oportunidadId: string): RespuestaLista<Presupuesto> => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Presupuesto[], total: number }>(UrlsVentas.PRESUPUESTO + q).then((respuesta) => respuesta);
};

export const crearPresupuestoOportunidad = async (oportunidadId: string, cliente_id: string): Promise<string> => {
    const nuevoPresupuesto: Partial<NuevoPresupuesto> = {
        cliente_id: oportunidadId,
        direccion_id: cliente_id,
        empresa_id: "1",
    };

    return await RestAPI.post(UrlsVentas.PRESUPUESTO, nuevoPresupuesto, "Error al crear presupuesto").then((respuesta) => respuesta.id);
}