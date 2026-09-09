import { IndicadorGuardado } from "#/ventas/comun/componentes/IndicadorGuardado.tsx";
import { CambiarDescuento } from "#/ventas/comun/componentes/moleculas/CambiarDescuento/CambiarDescuento.tsx";
import "#/ventas/comun/estilos/campos.css";
import "#/ventas/comun/estilos/detalle_documento.css";
import { tituloDocumentoVenta } from "#/ventas/venta/dominio.ts";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { BorrarPagoVentaTpv } from "../borrar_pago/BorrarPagoVentaTpv.tsx";
import { BorrarVentaTpv } from "../borrar/BorrarVentaTpv.tsx";
import { PagoVentaTpv, VentaTpv } from "../diseño.ts";
import { PagarTarjetaVentaTpv } from "../pagar_con_tarjeta/PagarTarjetaVentaTpv.tsx";
import { PagarEfectivoVentaTpv } from "../pagar_en_efectivo/PagarEfectivoVentaTpv.tsx";
import { editable, ventaTpvVacia, metaVentaTpv } from "./detalle.ts";
import "./DetalleVentaTpv.css";
import { Lineas } from "./lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { PendienteVenta } from "./comps/PendienteVenta.tsx";
import { Pagos } from "./pagos/Pagos.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TotalesVentaTpv } from "./TotalesVentaTpv.tsx";

export type DetalleVentaTpvProps = {
  id?: string;
  publicar: EmitirEvento;
};

// Ningún campo de cabecera (agente/fecha/almacén) es editable desde aquí
// (ver TabDatos): el modelo no necesita autoguardado propio, solo lo usan
// las líneas y el cliente vía sus propios eventos.
const sinAutoGuardar = async () => {};

export const DetalleVentaTpv = ({
  id,
  publicar = async () => {},
}: DetalleVentaTpvProps) => {
  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      venta: ventaTpvVacia(),
      ventaInicial: ventaTpvVacia(),
      lineaActiva: null,
      pagos: listaEntidadesInicial<PagoVentaTpv>(),
    },
    publicar
  );

  const venta = useModelo(metaVentaTpv, ctx.venta, sinAutoGuardar);
  const esMovil = useEsMovil();

  useEffect(() => {
    emitir("venta_id_cambiada", id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { estado, lineaActiva } = ctx;

  const titulo = (venta: VentaTpv) =>
    tituloDocumentoVenta(
      { codigo: venta.codigo, cliente: { nombre_cliente: venta.cliente?.nombre ?? "" } },
      "Nueva Venta"
    );

  if (!ctx.venta.id) return;

  const esEditable = editable(ctx.venta);

  const acciones = [
    {
      icono: "eliminar",
      texto: "Borrar",
      advertencia: true,
      onClick: () => emitir("borrar_solicitado"),
      deshabilitado: !esEditable,
    },
  ];

  // En móvil, las líneas van primero (es lo primero que se hace al abrir
  // un pedido) y las pestañas al final; en escritorio se mantiene el
  // orden clásico de pestañas arriba.
  const bloqueLineas = (
    <Lineas
      venta={ctx.venta}
      lineaActiva={lineaActiva}
      publicar={emitir}
      estadoVenta={estado}
      ventaEditable={esEditable}
    />
  );

  const bloqueTotales = (
    <>
      <TotalesVentaTpv modeloVenta={venta} publicar={emitir} />

      {estado === "CAMBIANDO_DESCUENTO" && (
        <CambiarDescuento publicar={emitir} venta={ctx.venta} />
      )}

      {ctx.venta.pendiente !== 0 && (
        <PendienteVenta venta={ctx.venta} publicar={emitir} />
      )}
    </>
  );

  const bloqueTabs = (
    <Tabs>
      <Tab label="Datos">
        <TabDatos venta={venta} />
      </Tab>

      <Tab label="Cliente">
        <TabCliente venta={venta} publicar={emitir} />
      </Tab>

      <Tab label="Pagos" deshabilitado={ctx.pagos.lista.length === 0}>
        <Pagos pagos={ctx.pagos.lista} pagoActivo={ctx.pagos.activo} publicar={emitir} />
      </Tab>
    </Tabs>
  );

  return (
    <Detalle
      id={ctx.venta.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.venta}
      cerrarDetalle={() => emitir("venta_deseleccionada", null)}
    >
      <div className="fila-acciones-documento">
        <IndicadorGuardado
          modificado={venta.modificado}
          error={venta.errorGuardado}
          guardados={venta.guardados}
        />
        <QuimeraAcciones acciones={acciones} vertical />
      </div>

      {esMovil ? (
        <>
          {bloqueLineas}
          {bloqueTotales}
          {bloqueTabs}
        </>
      ) : (
        <>
          {bloqueTabs}
          {bloqueTotales}
          {bloqueLineas}
        </>
      )}

      {estado === "BORRANDO_VENTA" && (
        <BorrarVentaTpv venta={ctx.venta} publicar={emitir} />
      )}

      {estado === "PAGANDO_EN_EFECTIVO" && (
        <PagarEfectivoVentaTpv publicar={emitir} venta={ctx.venta} />
      )}

      {estado === "PAGANDO_CON_TARJETA" && (
        <PagarTarjetaVentaTpv publicar={emitir} venta={ctx.venta} />
      )}

      {estado === "BORRANDO_PAGO" && ctx.pagos.activo && (
        <BorrarPagoVentaTpv
          ventaId={ctx.venta.id}
          pago={ctx.pagos.activo}
          publicar={emitir}
        />
      )}
    </Detalle>
  );
};
