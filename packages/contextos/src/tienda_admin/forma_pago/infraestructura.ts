import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { getCredencialesExterna } from "#/comun/credencial_externa/infraestructura.ts";
import {
    CambiosFormaPagoTienda,
    ConexionFormaPago,
    DestinoFormaPagoTienda,
    FormaPagoTienda,
    FormaPagoTiendaDetalle,
    GetCuentasStripe,
    GetFormaPago,
    GetFormasPago,
    NuevaFormaPagoTienda,
    PatchFormaPago,
    PostFormaPago,
    PostProbarConexion,
    TipoFormaPagoTienda,
} from "./diseño.ts";
import { cuentasStripe } from "./dominio.ts";

const baseUrl = "/tienda_admin/forma_pago";

export interface FormaPagoApi {
    id: number;
    website_id: number;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    tipo: TipoFormaPagoTienda;
    codpago: string;
    orden: number;
    activo: boolean;
    credencial: { id: string; nombre: string } | null;
    destino: DestinoFormaPagoTienda;
    recibos_pagados: boolean;
}

export interface FormaPagoDetalleApi extends FormaPagoApi {
    conexion: ConexionFormaPago | null;
}

export const formaPagoDesdeApi = (api: FormaPagoApi): FormaPagoTienda => ({
    id: String(api.id),
    websiteId: api.website_id,
    codigo: api.codigo,
    nombre: api.nombre,
    descripcion: api.descripcion ?? "",
    tipo: api.tipo,
    codpago: api.codpago,
    orden: api.orden,
    activo: api.activo,
    credencial: api.credencial,
    destino: api.destino,
    recibosPagados: api.recibos_pagados,
});

export const formaPagoDetalleDesdeApi = (api: FormaPagoDetalleApi): FormaPagoTiendaDetalle => ({
    ...formaPagoDesdeApi(api),
    conexion: api.conexion,
});

export const nuevaFormaPagoAApi = (websiteId: number, n: NuevaFormaPagoTienda) => ({
    website_id: websiteId,
    tipo: n.tipo,
    codigo: n.codigo.trim(),
    nombre: n.nombre.trim(),
    descripcion: n.descripcion.trim() || null,
    codpago: n.codpago,
    credencial_id: n.tipo === "PASARELA" && n.credencialId ? n.credencialId : null,
    destino: n.destino,
    recibos_pagados: n.tipo === "PASARELA" ? n.recibosPagados : false,
});

export const cambiosFormaPagoAApi = (c: CambiosFormaPagoTienda) => {
    const api: Record<string, unknown> = {};
    if (c.nombre !== undefined) api.nombre = c.nombre;
    if (c.descripcion !== undefined) api.descripcion = c.descripcion;
    if (c.codpago !== undefined) api.codpago = c.codpago;
    if (c.credencialId !== undefined) api.credencial_id = c.credencialId;
    if (c.orden !== undefined) api.orden = c.orden;
    if (c.activo !== undefined) api.activo = c.activo;
    if (c.destino !== undefined) api.destino = c.destino;
    if (c.recibosPagados !== undefined) api.recibos_pagados = c.recibosPagados;
    return api;
};

export const getFormasPago: GetFormasPago = async (websiteId) =>
    RestAPI.getLista<FormaPagoTienda, FormaPagoApi>(
        `${baseUrl}?website_id=${websiteId}`,
        formaPagoDesdeApi,
        "Error al cargar las formas de pago",
    );

export const getFormaPago: GetFormaPago = async (id) =>
    RestAPI.getItem<FormaPagoTiendaDetalle, FormaPagoDetalleApi>(
        `${baseUrl}/${id}`,
        formaPagoDetalleDesdeApi,
    );

export const postFormaPago: PostFormaPago = async (websiteId, nueva) => {
    const respuesta = await RestAPI.post(
        baseUrl,
        nuevaFormaPagoAApi(websiteId, nueva),
        "Error al crear la forma de pago",
    );
    return String(respuesta.id);
};

export const patchFormaPago: PatchFormaPago = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosFormaPagoAApi(cambios),
        "Error al guardar la forma de pago",
    );
};

export const postProbarConexion: PostProbarConexion = async (id) => {
    await RestAPI.post(`${baseUrl}/${id}/probar_conexion`, {}, "Error al comprobar la conexión con Stripe");
};

export const getCuentasStripe: GetCuentasStripe = async () => {
    const respuesta = await getCredencialesExterna({
        ...criteriaDefecto,
        paginacion: { ...criteriaDefecto.paginacion, limite: 100 },
    });
    return cuentasStripe(respuesta.datos);
};
