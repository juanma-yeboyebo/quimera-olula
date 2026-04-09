import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Direccion, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { direccionVacia } from "../venta/dominio.ts";
import { DeleteLinea, Factura, GetFactura, GetFacturas, GetLineasFactura, GetReportFactura, LineaFactura, PatchArticuloLinea, PatchCantidadLinea, PatchClienteFactura, PatchLinea, PostFactura, PostLinea } from "./diseño.ts";

const baseUrl = new ApiUrls().FACTURA;

type LineaFacturaAPI = LineaFactura;

interface FacturaAPI {
  id: string;
  codigo: string;
  fecha: string;
  cliente_id: string;
  nombre_cliente: string;
  id_fiscal: string;
  direccion_id: string;
  direccion: Direccion;
  agente_id: string;
  nombre_agente: string;
  divisa_id: string;
  tasa_conversion: number;
  total: number;
  neto: number;
  total_iva: number;
  total_irpf: number;
  total_divisa_empresa: number;
  por_descuento: number;
  neto_sin_dto: number;
  forma_pago_id: string;
  nombre_forma_pago: string;
  grupo_iva_negocio_id: string;
  observaciones: string;
  editable?: boolean;
}
export const facturaDesdeAPI = (p: FacturaAPI): Factura => ({
  ...p,
  fecha: new Date(Date.parse(p.fecha)),
  dtoPorcentual: p.por_descuento,
  netoSinDto: p.neto_sin_dto,
  cliente: {
    cliente_id: p.cliente_id ?? null,
    nombre_cliente: p.nombre_cliente ?? "",
    id_fiscal: p.id_fiscal ?? "",
    direccion_id: p.direccion_id ?? null,
    direccion: p.direccion ?? direccionVacia(),
  },
  lineas: [],
});
export const lineaFacturaFromAPI = (l: LineaFacturaAPI): LineaFactura => l;

export const getFactura: GetFactura = async (id) => {
  return RestAPI.get<{ datos: FacturaAPI }>(
    `${baseUrl}/${id}`).then((respuesta) => {
      return facturaDesdeAPI(respuesta.datos);
    });
};


export const getFacturas: GetFacturas = async (
  filtro: Filtro,
  orden: Orden,
  paginacion: Paginacion
) => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: FacturaAPI[]; total: number }>(baseUrl + q);
  return { datos: respuesta.datos.map(facturaDesdeAPI), total: respuesta.total };
};

export const getReportFactura: GetReportFactura = async (id) =>
  RestAPI.blob(`${baseUrl}/${id}/report`, "Error al obtener el report de la factura");

export const postFactura: PostFactura = async (factura) => {
  const cliente = factura.cliente_id
    ? { cliente_id: factura.cliente_id }
    : {
      nombre_cliente: factura.nombre_cliente || "",
      id_fiscal: factura.id_fiscal || "",
      direccion: {
        tipo_via: factura.tipo_via || "",
        nombre_via: factura.nombre_via || "",
        numero: factura.numero || "",
        otros: factura.otros || "",
        cod_postal: factura.cod_postal || "",
        ciudad: factura.ciudad || "",
        provincia_id: factura.provincia_id || "",
        pais_id: factura.pais_id || "",
        apartado: factura.apartado || "",
        telefono: factura.telefono || ""
      }
    };

  const payload = {
    cliente,
    empresa_id: factura.empresa_id
  };
  return await RestAPI.post(baseUrl, payload, "Error al crear factura").then((respuesta) => respuesta.id);
};

export const patchCambiarCliente: PatchClienteFactura = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      cliente: {
        cliente_id: cambio.cliente_id,
        direccion_id: cambio.direccion_id
      }
    }
  }, "Error al cambiar cliente de la factura");
};

export const getLineas: GetLineasFactura = async (id) =>
  await RestAPI.get<{ datos: LineaFacturaAPI[] }>(
    `${baseUrl}/${id}/linea`).then((respuesta) => {
      const lineas = respuesta.datos.map((d) => lineaFacturaFromAPI(d));
      return lineas;
    });

export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [{
      articulo_id: linea.referencia,
      cantidad: linea.cantidad
    }]
  }, "Error al crear linea de factura").then((respuesta) => {
    const miRespuesta = respuesta as unknown as { ids: string[] };
    return miRespuesta.ids[0];
  });
};

export const patchArticuloLinea: PatchArticuloLinea = async (id, lineaId, referencia) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: referencia
      },
    },
  };
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload, "Error al actualizar artículo de la línea de factura");
};

export const patchLinea: PatchLinea = async (id, linea) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: linea.referencia
      },
      cantidad: linea.cantidad,
      pvp_unitario: linea.pvp_unitario,
      dto_porcentual: linea.dto_porcentual,
      grupo_iva_producto_id: linea.grupo_iva_producto_id,
    },
  };
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar línea de factura");
};

export const patchCantidadLinea: PatchCantidadLinea = async (id, linea, cantidad) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: linea.referencia
      },
      cantidad: cantidad,
    },
  };
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar cantidad de la línea de factura");
};

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  }, "Error al borrar línea de factura");
};

export const patchFactura = async (id: string, factura: Factura) => {
  const payload = {
    cambios: {
      agente_id: factura.agente_id,
      divisa: {
        divisa_id: factura.divisa_id,
        tasa_conversion: factura.tasa_conversion,
      },
      fecha: factura.fecha,
      cliente_id: factura.cliente.cliente_id,
      nombre_cliente: factura.cliente.nombre_cliente,
      id_fiscal: factura.cliente.id_fiscal,
      direccion_id: factura.cliente.direccion_id,
      forma_pago_id: factura.forma_pago_id,
      grupo_iva_negocio_id: factura.grupo_iva_negocio_id,
      observaciones: factura.observaciones,
    },
  };

  await RestAPI.patch(`${baseUrl}/${id}`, payload,
    'Error al guardar el factura'
  );
};

export const borrarFactura = async (id: string) => {
  await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar factura");
}

export const patchCambiarDescuento = async (id: string, dto_porcentual: number): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      por_descuento: dto_porcentual,
    }
  }, "Error al cambiar descuento de la factura");
};
