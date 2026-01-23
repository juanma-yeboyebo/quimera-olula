import UrlsVentasClass from "#/ventas/comun/urls.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "@olula/lib/infraestructura.ts";
import { Accion } from "../accion/diseño.ts";
import UrlsCrmClass from "../comun/urls.ts";
import { NuevaOportunidadVenta } from "../oportunidadventa/crear/diseño.ts";
import { OportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Cliente, GetCliente, PatchCliente } from "./diseño.ts";

const UrlsCrm = new UrlsCrmClass();
const UrlsVentas = new UrlsVentasClass();

export type ClienteApi = Cliente;

const clienteFromAPI = (c: ClienteApi): Cliente => ({
  ...c,
});

export const getCliente: GetCliente = async (id) =>
  await RestAPI.get<{ datos: Cliente }>(`${UrlsVentas.CLIENTE}/${id}`).then((respuesta) => clienteFromAPI(respuesta.datos));

export const getClientes = async (
  filtro: Filtro,
  orden: Orden,
  paginacion: Paginacion
): RespuestaLista<Cliente> => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: ClienteApi[]; total: number }>(UrlsVentas.CLIENTE + q);
  return { datos: respuesta.datos.map(clienteFromAPI), total: respuesta.total };
};

export const patchCliente: PatchCliente = async (id, cliente) =>
  await RestAPI.patch(`${UrlsVentas.CLIENTE}/${id}`, {
    cambios: {
      nombre: cliente.nombre,
      id_fiscal: {
        id: cliente.id_fiscal,
        tipo: cliente.tipo_id_fiscal,
      },
      grupo_iva_negocio_id: cliente.grupo_iva_negocio_id,
      nombre_comercial: cliente.nombre_comercial,
      web: cliente.web,
      telefono1: cliente.telefono1,
      telefono2: cliente.telefono2,
      email: cliente.email,
      observaciones: cliente.observaciones,
      grupo_id: cliente.grupo_id,
    },
  }, "Error al guardar cliente");

export const deleteCliente = async (id: string): Promise<void> =>
  await RestAPI.delete(`${UrlsVentas.CLIENTE}/${id}`, "Error al borrar cliente");

export const getOportunidadesVentaCliente = async (clienteId: string): Promise<OportunidadVenta[]> =>
  await RestAPI.get<{ datos: OportunidadVenta[] }>(`${UrlsCrm.CLIENTE}/${clienteId}/oportunidades_venta`).then((respuesta) => respuesta.datos);

export const getOportunidadVenta = async (id: string): Promise<OportunidadVenta> =>
  await RestAPI.get<{ datos: OportunidadVenta }>(`${UrlsCrm.OPORTUNIDAD_VENTA}/${id}`).then((respuesta) => respuesta.datos);

export const postOportunidadVenta = async (oportunidad: NuevaOportunidadVenta): Promise<string> => {
  return await RestAPI.post(UrlsCrm.OPORTUNIDAD_VENTA, oportunidad).then((respuesta) => respuesta.id);
};

export const vincularContactoCliente = async (contactoId: string, clienteId: string): Promise<void> => {
  const payload = {
    contacto_id: contactoId,
  };
  await RestAPI.patch(`${UrlsCrm.CLIENTE}/${clienteId}/vincular_contacto`, payload, "Error al vincular cliente");
};

export const desvincularContactoCliente = async (contactoId: string, clienteId: string): Promise<void> => {
  const payload = {
    contacto_id: contactoId,
  };
  await RestAPI.patch(`${UrlsCrm.CLIENTE}/${clienteId}/desvincular_contacto`, payload, "Error al desvincular contacto");
};

export const getAccionesCliente = async (clienteId: string) => {
  const filtro = ['cliente_id', clienteId] as unknown as Filtro;
  const orden = [] as Orden;
  const q = criteriaQueryUrl(filtro, orden);
  return RestAPI.get<{ datos: Accion[] }>(UrlsCrm.ACCION + q).then((respuesta) => respuesta.datos);
};