import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { CambiarArticuloLinea, CambiarCantidadLinea, CambioCliente, DeleteLinea, esClienteRegistrado, GetPresupuesto, GetPresupuestos, LineaPresupuesto, PatchCambiarDivisa, PatchLinea, PostLinea, PostPresupuesto, Presupuesto, PresupuestoAPI } from "./diseño.ts";

const baseUrl = new ApiUrls().PRESUPUESTO;

// type PresupuestoAPI = Presupuesto
type LineaPresupuestoAPI = LineaPresupuesto

// export const presupuestoFromAPI = (p: PresupuestoAPI): Presupuesto => p;
export const presupuestoFromAPI = (p: PresupuestoAPI): Presupuesto => ({
  ...p,
  nombre_via: p.direccion?.nombre_via ?? "",
  cod_postal: p.direccion?.cod_postal ?? null,
  ciudad: p.direccion?.ciudad ?? "",
  provincia_id: p.direccion?.provincia_id ?? "",
  provincia: p.direccion?.provincia ?? "",
  pais_id: p.direccion?.pais_id ?? "",
  telefono: p.direccion?.telefono ?? "",
  tipo_via: p.direccion?.tipo_via ?? "",
  numero: p.direccion?.numero ?? "",
  otros: p.direccion?.otros ?? "",
  apartado: p.direccion?.apartado ?? "",
});

export const presupuestoToAPI = (l: Presupuesto): PresupuestoAPI => {
  const {
    nombre_via,
    cod_postal,
    ciudad,
    provincia_id,
    provincia,
    pais_id,
    telefono,
    tipo_via,
    numero,
    otros,
    apartado,
    ...rest
  } = l;
  return {
    ...rest,
    direccion: {
      nombre_via: nombre_via ?? "",
      cod_postal: cod_postal ?? "",
      ciudad: ciudad ?? "",
      provincia_id: provincia_id ?? null,
      provincia: provincia ?? "",
      pais_id: pais_id ?? "",
      telefono: telefono ?? "",
      tipo_via: tipo_via ?? "",
      numero: numero ?? "",
      otros: otros ?? "",
      apartado: apartado ?? "",
    },
  };
};
export const lineaPresupuestoFromAPI = (l: LineaPresupuestoAPI): LineaPresupuesto => l;

export const getPresupuesto: GetPresupuesto = async (id) =>
  RestAPI.get<{ datos: PresupuestoAPI }>(`${baseUrl}/${id}`).then((respuesta) => {
    return presupuestoFromAPI(respuesta.datos);
  });

export const getPresupuestos: GetPresupuestos = async (
  filtro: Filtro,
  orden: Orden,
  paginacion: Paginacion
) => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: PresupuestoAPI[]; total: number }>(baseUrl + q);
  return { datos: respuesta.datos.map(presupuestoFromAPI), total: respuesta.total };
};

export const postPresupuesto: PostPresupuesto = async (presupuesto): Promise<string> => {
  let clientePayload;

  if (esClienteRegistrado(presupuesto)) {
    clientePayload = {
      cliente_id: presupuesto.cliente_id,
      direccion_id: presupuesto.direccion_id
    };
  } else {
    clientePayload = {
      nombre: presupuesto.nombre_cliente,
      id_fiscal: presupuesto.id_fiscal,
      direccion: {
        nombre_via: presupuesto.nombre_via,
        tipo_via: presupuesto.tipo_via || null,
        numero: presupuesto.numero || null,
        otros: presupuesto.otros || null,
        cod_postal: presupuesto.cod_postal || null,
        ciudad: presupuesto.ciudad,
        provincia_id: presupuesto.provincia_id || null,
        provincia: presupuesto.provincia || null,
        pais_id: presupuesto.pais_id || null,
        apartado: presupuesto.apartado || null,
        telefono: presupuesto.telefono || null,
      }
    };
  }

  const payload = {
    cliente: clientePayload,
    empresa_id: presupuesto.empresa_id
  };

  return await RestAPI.post(baseUrl, payload, "Error al crear presupuesto").then((respuesta) => respuesta.id);
}

export const borrarPresupuesto = async (id: string): Promise<void> => {
  await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar presupuesto");
}

export const patchCambiarAgente = async (id: string, agenteId: string) => {
  await RestAPI.patch(`${baseUrl}/${id}`, { cambios: { agente_id: agenteId } }, "Error al cambiar agente del presupuesto");
}

export const patchCambiarDivisa: PatchCambiarDivisa = async (id, divisaId) => {
  await RestAPI.patch(`${baseUrl}/${id}`, { cambios: { divisa_id: divisaId } }, "Error al cambiar divisa del presupuesto");
}

export const patchCambiarCliente = async (id: string, cambio: CambioCliente): Promise<void> => {
  if (cambio.cliente_id) {
    const clientePayload = {
      cambios: {
        cliente: {
          cliente_id: cambio.cliente_id,
          direccion_id: cambio.direccion_id
        }
      }
    }
    await RestAPI.patch(`${baseUrl}/${id}`, clientePayload, "Error al cambiar cliente del presupuesto");
  } else {
    const clientePayload = {
      cambios: {
        cliente: {
          nombre: cambio.nombre_cliente || "",
          id_fiscal: cambio.id_fiscal,
          direccion: {
            nombre_via: cambio.nombre_via,
            tipo_via: cambio.tipo_via || null,
            numero: cambio.numero || null,
            otros: cambio.otros || null,
            cod_postal: cambio.cod_postal || null,
            ciudad: cambio.ciudad || null,
            provincia_id: cambio.provincia_id || null,
            provincia: cambio.provincia || null,
            pais_id: cambio.pais_id || null,
            apartado: cambio.apartado || null,
            telefono: cambio.telefono || null,
          }
        }
      }
    }
    await RestAPI.patch(`${baseUrl}/${id}`, clientePayload, "Error al cambiar cliente del presupuesto");
  }


}

export const getLineas = async (id: string): Promise<LineaPresupuesto[]> =>
  await RestAPI.get<{ datos: LineaPresupuestoAPI[] }>(`${baseUrl}/${id}/linea`).then((respuesta) => {
    const lineas = respuesta.datos.map((d) => lineaPresupuestoFromAPI(d));
    return lineas
  });


export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [{
      articulo_id: linea.referencia,
      cantidad: linea.cantidad
    }]
  }, "Error al crear línea de presupuesto").then((respuesta) => {
    const miRespuesta = respuesta as unknown as { ids: string[] };
    return miRespuesta.ids[0];
  });
}

export const patchArticuloLinea: CambiarArticuloLinea = async (id, lineaId, referencia) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: referencia
      },
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload, "Error al actualizar artículo de la línea del presupuesto");
}

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
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar línea del presupuesto");
}


export const patchCantidadLinea: CambiarCantidadLinea = async (id, linea, cantidad) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: linea.referencia
      },
      cantidad: cantidad,
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar cantidad de la línea del presupuesto");
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  }, "Error al borrar línea del presupuesto");
}

export const patchPresupuesto = async (id: string, presupuesto: Presupuesto) => {
  const payload = {
    cambios: {
      agente_id: presupuesto.agente_id,
      divisa: {
        divisa_id: presupuesto.divisa_id,
        tasa_conversion: presupuesto.tasa_conversion,
      },
      fecha: presupuesto.fecha,
      cliente_id: presupuesto.cliente_id,
      nombre_cliente: presupuesto.nombre_cliente,
      id_fiscal: presupuesto.id_fiscal,
      direccion_id: presupuesto.direccion_id,
      forma_pago_id: presupuesto.forma_pago_id,
      grupo_iva_negocio_id: presupuesto.grupo_iva_negocio_id,
      observaciones: presupuesto.observaciones,
    },
  };

  await RestAPI.patch(`${baseUrl}/${id}`, payload, "Error al actualizar presupuesto");
};


export const aprobarPresupuesto = async (id: string) => {
  await RestAPI.patch(`${baseUrl}/${id}/aprobar`, {}, "Error al aprobar presupuesto");
};
