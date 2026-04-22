import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { EstadoLead } from "./diseño.ts";

const baseUrlEstadoLead = `/crm/estado_lead`;

export const estadoLeadToAPI = (e: EstadoLead) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getEstadoLead = async (id: string): Promise<EstadoLead> =>
    await RestAPI.get<{ datos: EstadoLead }>(`${baseUrlEstadoLead}/${id}`).then((respuesta) => respuesta.datos);


export const getEstadosLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<EstadoLead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: EstadoLead[]; total: number }>(baseUrlEstadoLead + q);
    return { datos: respuesta.datos, total: respuesta.total };
};

export const postEstadoLead = async (estado: EstadoLead): Promise<string> => {
    const payload = estadoLeadToAPI(estado);
    return await RestAPI.post(baseUrlEstadoLead, payload, "Error al guardar el estado de lead").then((respuesta) => respuesta.id);
};

export const patchEstadoLead = async (id: string, estado: Partial<EstadoLead>): Promise<void> => {
    const payload = estadoLeadToAPI(estado as EstadoLead);
    await RestAPI.patch(`${baseUrlEstadoLead}/${id}`, payload, "Error al guardar el estado de lead");
};

export const deleteEstadoLead = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlEstadoLead}/${id}`, "Error al borrar el estado de lead");

export const marcarPorDefectoEstadoLead = async (id: string): Promise<void> => await RestAPI.patch(`${baseUrlEstadoLead}/${id}/pordefecto`, "Error al marcar por defecto el estado de lead");
