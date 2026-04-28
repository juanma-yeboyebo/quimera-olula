import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { FuenteLead } from "./diseño.ts";

const baseUrlFuenteLead = `/crm/fuente_lead`;

export const fuenteLeadToAPI = (e: FuenteLead) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getFuenteLead = async (id: string): Promise<FuenteLead> =>
    await RestAPI.get<{ datos: FuenteLead }>(`${baseUrlFuenteLead}/${id}`).then((respuesta) => respuesta.datos);


export const getFuentesLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<FuenteLead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: FuenteLead[]; total: number }>(baseUrlFuenteLead + q);
    return { datos: respuesta.datos, total: respuesta.total };
};

export const postFuenteLead = async (fuente: FuenteLead): Promise<string> => {
    const payload = fuenteLeadToAPI(fuente);
    return await RestAPI.post(baseUrlFuenteLead, payload, "Error al guardar la fuente de lead").then((respuesta) => respuesta.id);
};

export const patchFuenteLead = async (id: string, fuente: Partial<FuenteLead>): Promise<void> => {
    const payload = fuenteLeadToAPI(fuente as FuenteLead);
    await RestAPI.patch(`${baseUrlFuenteLead}/${id}`, payload, "Error al guardar la fuente de lead");
};

export const deleteFuenteLead = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlFuenteLead}/${id}`, "Error al borrar la fuente de lead");

export const marcarPorDefectoFuenteLead = async (id: string): Promise<void> => await RestAPI.patch(`${baseUrlFuenteLead}/${id}/pordefecto`, "Error al marcar por defecto la fuente de lead");
