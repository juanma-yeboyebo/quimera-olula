import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Direccion, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import Tpv_Urls from "#/tpv/comun/urls.ts";
import {
  CambiosDatosCliente,
  DeleteLinea,
  DeletePago,
  GetLineasVentaTpv,
  GetPagosVentaTpv,
  GetVentaTpv,
  GetVentasTpv,
  LineaVentaTpv,
  NuevaVentaTpv,
  PagoVentaTpv,
  PatchCantidadLinea,
  PatchClienteVentaTpv,
  PatchLinea,
  PostPago,
  PostVentaTpv,
  VentaTpv,
} from "./diseño.ts";

export interface LineaVentaTpvAPI {
  id: string;
  referencia: string | null;
  descripcion: string;
  descripcion_articulo: string | null;
  cantidad: number;
  pvp_unitario: number;
  dto_porcentual: number;
  dto_lineal: number;
  pvp_total: number;
  grupo_iva_producto_id: string;
  iva_incluido: boolean;
  tipo_irpf: number;
  tipo_recargo: number;
  tipo_iva: number;
  por_comision: number;
  importe_comision: number;
  barcode?: string;
  talla?: string;
  color?: string;
}

interface ClienteVentaTpvAPI {
  id: string | null;
  nombre: string;
  id_fiscal: string;
  direccion_id: string | null;
  direccion: Direccion;
}

interface VentaTpvAPI {
  id: string;
  codigo: string;
  fecha: string;
  cliente: ClienteVentaTpvAPI | null;
  agente_id: string;
  agente: string;
  punto_venta_id: string;
  punto_venta: string;
  divisa_id: string;
  total: number;
  neto: number;
  total_iva: number;
  por_descuento: number;
  neto_sin_dto: number;
  grupo_iva_negocio_id: string;
  pagado: number;
  pendiente: number;
  abierta: boolean;
  estado: string;
  hora?: string;
  email?: string;
  tarjeta_puntos_id?: string;
  codtienda?: string;
  codalmacen?: string;
}

const baseUrl = new Tpv_Urls().VENTA;

const lineaVentaTpvDesdeApi = (l: LineaVentaTpvAPI): LineaVentaTpv => ({
  ...l,
  descripcionArticulo: l.descripcion_articulo,
} as LineaVentaTpv);

export const ventaTpvDesdeAPI = (v: VentaTpvAPI): VentaTpv => ({
  ...v,
  fecha: new Date(Date.parse(v.fecha)),
  dtoPorcentual: v.por_descuento,
  netoSinDto: v.neto_sin_dto,
  nombre_agente: v.agente,
  puntoVentaId: v.punto_venta_id,
  puntoVenta: v.punto_venta,
  tarjetaPuntosId: v.tarjeta_puntos_id,
  total_irpf: 0,
  total_recargo: 0,
  total_divisa_empresa: 0,
  tasa_conversion: 1,
  observaciones: "",
  cliente: v.cliente ? {
    id: v.cliente.id,
    nombre: v.cliente.nombre,
    idFiscal: v.cliente.id_fiscal,
    idDireccion: v.cliente.direccion_id,
    direccion: v.cliente.direccion,
  } : null,
  lineas: [],
} as unknown as VentaTpv);

export const getVenta: GetVentaTpv = async (id) => {
  return RestAPI.get<{ datos: VentaTpvAPI }>(
    `${baseUrl}/${id}`).then((respuesta) => {
      return ventaTpvDesdeAPI(respuesta.datos);
    });
}

export const getVentas: GetVentasTpv = async (
  filtro: Filtro,
  orden: Orden,
  paginacion: Paginacion
) => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: VentaTpvAPI[]; total: number }>(baseUrl + q);
  return { datos: respuesta.datos.map(ventaTpvDesdeAPI), total: respuesta.total };
};

// El backend resuelve agente/punto de venta a partir del usuario logueado
// (cada tienda tiene su propio punto de venta) — se manda vacío por
// compatibilidad de forma, el backend lo ignora.
export const postVenta: PostVentaTpv = async (venta: NuevaVentaTpv) => {
  return await RestAPI.post(baseUrl, venta, "Error al crear la venta").then((respuesta) => respuesta.id);
}

export const patchCambiarCliente: PatchClienteVentaTpv = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}/cliente`, {
    cambios: {
      nombre: cambio.nombre_cliente || "",
      id_fiscal: cambio.id_fiscal,
      direccion: {
        nombre_via: cambio.nombre_via || "",
        tipo_via: cambio.tipo_via || null,
        numero: cambio.numero || null,
        otros: cambio.otros || null,
        cod_postal: cambio.cod_postal || null,
        ciudad: cambio.ciudad || null,
        provincia_id: null,
        provincia: cambio.provincia || null,
        pais_id: cambio.pais_id || null,
        apartado: cambio.apartado || null,
        telefono: cambio.telefono || null,
      },
    }
  }, "Error al cambiar cliente de la venta");
}

export const patchDatosCliente = async (id: string, cambios: CambiosDatosCliente): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/datos_cliente`, {
    cambios
  }, "Error al actualizar email/tarjeta de la venta");
}

export const patchCambiarDescuento = async (id: string, dto_porcentual: number): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    por_descuento: dto_porcentual,
  }, "Error al cambiar descuento de la venta");
}

export const getLineas: GetLineasVentaTpv = async (id) =>
  await RestAPI.get<{ datos: LineaVentaTpvAPI[] }>(
    `${baseUrl}/${id}/lineas`).then((respuesta) => {
      return respuesta.datos.map(lineaVentaTpvDesdeApi);
    });

// Añade línea a partir de un código de barras ya resuelto (usado por el
// modal de crear línea con talla, por las bolsas y por el escaneo directo)
// — el barcode identifica unívocamente artículo+talla+color.
export const postLineaPorBarcode = async (
  id: string,
  linea: { barcode: string; cantidad: number }
): Promise<string> => {
  const respuesta = await RestAPI.post(`${baseUrl}/${id}/linea_por_barcode`, {
    barcode: linea.barcode,
    cantidad: linea.cantidad,
  }, "Error al crear línea de venta");
  return (respuesta as unknown as { id: string }).id;
}

// El artículo de una línea no se puede cambiar desde este modal (bloqueado
// en ArticuloLinea), así que no se manda en los cambios: si se manda, aunque
// sea la misma referencia, el backend reconstruye el Sku desde cero sin
// barcode y borra talla/color/barcode de la línea al guardar.
export const patchLinea: PatchLinea = async (id, linea) => {
  const payload = {
    cambios: {
      cantidad: linea.cantidad,
      pvp_unitario: linea.pvp_unitario,
      dto_porcentual: linea.dto_porcentual,
      dto_lineal: linea.dto_lineal,
      grupo_iva_producto_id: linea.grupo_iva_producto_id,
      tipo_irpf: linea.tipo_irpf,
      comision: linea.por_comision,
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar línea de venta");
}

export const patchCantidadLinea: PatchCantidadLinea = async (id, linea, cantidad) => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, {
    cambios: { cantidad },
  }, "Error al actualizar cantidad de la línea de venta");
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.delete(`${baseUrl}/${id}/linea/${lineaId}`, "Error al borrar línea de venta");
}

export const borrarVenta = async (id: string) => {
  await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar la venta");
}

export interface TarjetaPuntos {
  codtarjetapuntos: string;
  nombre: string;
  email: string;
  telefono: string;
  saldopuntos: number;
}

// La tarjeta Gansociety se busca por email o por teléfono (igual que en
// Eneboo, las dos únicas opciones que ofrece).
export const buscarTarjetasPuntos = async (
  criterio: { email?: string; telefono?: string }
): Promise<TarjetaPuntos[]> => {
  const q = new URLSearchParams();
  if (criterio.email) q.set("email", criterio.email);
  if (criterio.telefono) q.set("telefono", criterio.telefono);

  return await RestAPI.get<{ datos: TarjetaPuntos[] }>(
    `/ventas/tarjetapuntos?${q.toString()}`
  ).then((respuesta) => respuesta.datos);
}

export interface PuntoVentaOpcion {
  codtpv_puntoventa: string;
  descripcion: string;
}

export interface PrecheckPedido {
  jornada_abierta: boolean;
  puntos_venta: PuntoVentaOpcion[];
  arqueo_id: string | null;
}

// Comprobaciones antes de dejar crear un pedido: jornada abierta, puntos de
// venta disponibles y (si se manda punto_venta_id) arqueo abierto — el
// backend lo abre solo si no existe. Sin punto_venta_id no se toca arqueo
// (llamada inicial, solo para saber si hace falta elegir punto de venta).
export const getPrecheckPedido = async (puntoVentaId?: string): Promise<PrecheckPedido> => {
  const q = puntoVentaId ? `?punto_venta_id=${encodeURIComponent(puntoVentaId)}` : "";
  return await RestAPI.get<PrecheckPedido>(`/ventas/precheck_pedido${q}`);
}

interface PagoVentaTpvAPI {
  id: string;
  importe: number;
  forma_pago: string;
  fecha: string;
  vale: string | null;
  saldo_vale: number | null;
  arqueo_id: string;
  arqueo_abierto: boolean;
  tipo_tarjeta_id: string | null;
  tipo_tarjeta_nombre?: string | null;
}

const pagoVentaTpvDesdeAPI = (p: PagoVentaTpvAPI): PagoVentaTpv => ({
  id: p.id,
  importe: p.importe,
  formaPago: p.forma_pago,
  fecha: new Date(Date.parse(p.fecha)),
  idArqueo: p.arqueo_id,
  arqueoAbierto: p.arqueo_abierto,
  idTipoTarjeta: p.tipo_tarjeta_id,
  vale: p.vale,
  saldoVale: p.saldo_vale,
});

export const getPagos: GetPagosVentaTpv = async (id) =>
  await RestAPI.get<{ datos: PagoVentaTpvAPI[] }>(
    `${baseUrl}/${id}/pagos`).then((respuesta) =>
      respuesta.datos.map(pagoVentaTpvDesdeAPI)
    );

export const postPago: PostPago = async (id, pago) => {
  const body = {
    importe: pago.importe,
    fecha: new Date().toISOString().slice(0, 10),
    forma_pago: pago.formaPago,
    tipo_tarjeta_id: pago.idTipoTarjeta,
  };
  return await RestAPI.post(`${baseUrl}/${id}/pago`, body, "Error al crear pago de venta")
    .then((respuesta) => (respuesta as unknown as { id: string }).id);
}

export const deletePago: DeletePago = async (id, idPago): Promise<void> => {
  await RestAPI.delete(`${baseUrl}/${id}/pago/${idPago}`, "Error al borrar pago de venta");
}
