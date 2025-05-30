import { RestAPI } from "../../comun/api/rest_api.ts";
import { DeleteLinea, Factura, GetFactura, GetFacturas, GetLineasFactura, LineaFactura, PatchArticuloLinea, PatchCantidadLinea, PatchClienteFactura, PatchLinea, PostFactura, PostLinea } from "./diseño.ts";

const baseUrl = `/ventas/factura`;

type LineaFacturaAPI = LineaFactura;

type FacturaAPI = Factura
export const facturaDesdeAPI = (p: FacturaAPI): Factura => p;
export const lineaFacturaFromAPI = (l: LineaFacturaAPI): LineaFactura => l;

export const getFactura: GetFactura = async (id) => {
  return RestAPI.get<{ datos: Factura }>(
    `${baseUrl}/${id}`).then((respuesta) => {
      return facturaDesdeAPI(respuesta.datos);
    });
};

export const getFacturas: GetFacturas = async (_, __) => {
  return RestAPI.get<{ datos: Factura[] }>(
    `${baseUrl}`).then((respuesta) => {
      return respuesta.datos.map((d) => facturaDesdeAPI(d));
    });
};

export const postFactura: PostFactura = async (factura) => {
  const payload = {
    cliente: {
      cliente_id: factura.cliente_id,
      direccion_id: factura.direccion_id
    },
    empresa_id: factura.empresa_id
  };
  return await RestAPI.post(baseUrl, payload).then((respuesta) => respuesta.id);
};

export const patchCambiarCliente: PatchClienteFactura = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      cliente: {
        cliente_id: cambio.cliente_id,
        direccion_id: cambio.direccion_id
      }
    }
  });
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
  }).then((respuesta) => {
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload);
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload);
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload);
};

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  });
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
      cliente_id: factura.cliente_id,
      nombre_cliente: factura.nombre_cliente,
      id_fiscal: factura.id_fiscal,
      direccion_id: factura.direccion_id,
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
  await RestAPI.delete(`${baseUrl}/${id}`);
}
