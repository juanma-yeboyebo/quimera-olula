import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { MetaFiltro } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import {
  filtroAgente,
  filtroCliente,
  filtroCodigo,
  filtroFechaDocumento,
} from "#/ventas/comun/filtros.tsx";
import { CrearVentaTpv } from "../crear/CrearVentaTpv.tsx";
import { DetalleVentaTpv } from "../detalle/DetalleVentaTpv.tsx";
import { VentaTpv } from "../diseño.ts";
import { TarjetaDocumentoVenta, EstadoDocumento } from "#/ventas/comun/componentes/TarjetaDocumentoVenta.tsx";
import { colorDeEstado, etiquetaEstado, opcionesEstado } from "./configEstado.tsx";
import { getMaquina } from "./maquina.ts";
import { getMetaTablaVentaTpv } from "./metatabla_venta_tpv.tsx";

const campoFiltroEstado: MetaFiltro = {
  estado: {
    id: "estado",
    label: etiquetaEstado,
    tipo: "multiseleccion",
    opciones: opcionesEstado,
    filtro: (valor) => {
      const elegidos = (valor as string[]) ?? [];
      if (elegidos.length === 0 || elegidos.length === opcionesEstado.length) return null;
      return ["estado", "in", elegidos as unknown as string];
    },
  },
};

export const MaestroConDetalleVentaTpv = () => {
  const { id, criteria } = getUrlParams();
  const criteriaInicial =
    criteria.filtro.length === 0
      ? { ...criteriaDefecto, filtro: [] }
      : criteria;

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    ventas: listaActivaEntidadesInicial<VentaTpv>(id, criteriaInicial),
    seleccionados: [],
  });

  useUrlParams(ctx.ventas.activo, ctx.ventas.criteria);

  useEffect(() => {
    emitir("recarga_de_ventas_solicitada", ctx.ventas.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metaTablaVentaTpv = getMetaTablaVentaTpv();
  const metaFiltroVentaTpv: MetaFiltro = {
    codigo: filtroCodigo,
    cliente_id: filtroCliente,
    agente_id: filtroAgente,
    fecha: filtroFechaDocumento,
    ...campoFiltroEstado,
  };

  return (
    <div className="VentaTpv">
      <MaestroDetalle<VentaTpv>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <Listado<VentaTpv>
              metaTabla={metaTablaVentaTpv}
              metaFiltro={metaFiltroVentaTpv}
              tarjeta={(venta) => (
                <TarjetaDocumentoVenta
                  codigo={venta.codigo}
                  nombreCliente={venta.cliente?.nombre ?? ""}
                  fecha={venta.fecha}
                  total={venta.total}
                  divisa={venta.divisa_id}
                  tasaConversion={venta.tasa_conversion}
                  totalDivisaEmpresa={venta.total_divisa_empresa}
                  estado={colorDeEstado(venta.estado ?? "") as EstadoDocumento}
                />
              )}
              criteria={ctx.ventas.criteria}
              entidades={ctx.ventas.lista}
              totalEntidades={ctx.ventas.total}
              seleccionada={ctx.ventas.activo}
              seleccionadas={ctx.seleccionados}
              onMultiSeleccion={(ids) => emitir("seleccionados_cambiados", ids)}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton onClick={() => emitir("crear_venta_solicitada")}>
                    Nuevo Pedido
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) => emitir("venta_seleccionada", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
              onSiguientePagina={(payload) =>
                emitir("siguiente_pagina", payload)
              }
            />
          </>
        }
        Detalle={<DetalleVentaTpv id={ctx.ventas.activo} publicar={emitir} />}
        seleccionada={ctx.ventas.activo}
      />

      <QModal
        nombre="altaVentaTpv"
        abierto={ctx.estado === "CREANDO_VENTA"}
        titulo="Nuevo Pedido"
        onCerrar={() => emitir("creacion_venta_cancelada")}
      >
        {ctx.estado === "CREANDO_VENTA" && <CrearVentaTpv publicar={emitir} />}
      </QModal>
    </div>
  );
};
