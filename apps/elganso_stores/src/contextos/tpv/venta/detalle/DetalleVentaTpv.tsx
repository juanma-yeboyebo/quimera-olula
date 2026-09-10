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
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect, useState } from "react";
import { BorrarPagoVentaTpv } from "../borrar_pago/BorrarPagoVentaTpv.tsx";
import { BorrarVentaTpv } from "../borrar/BorrarVentaTpv.tsx";
import { VENTA_PDA } from "../crear/CrearVentaTpv.tsx";
import { PagoVentaTpv, VentaTpv } from "../diseño.ts";
import { PagarTarjetaVentaTpv } from "../pagar_con_tarjeta/PagarTarjetaVentaTpv.tsx";
import { PagarEfectivoVentaTpv } from "../pagar_en_efectivo/PagarEfectivoVentaTpv.tsx";
import { buscarTarjetasPuntos, TarjetaPuntos } from "../infraestructura.ts";
import { editable, ventaTpvVacia, metaVentaTpv } from "./detalle.ts";
import "./DetalleVentaTpv.css";
import { Lineas } from "./lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { aplicarTarjetaACliente, TarjetaGansociety } from "./comps/TarjetaGansociety.tsx";
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

  // Igual que en Eneboo ("DATOS FACTURA"): por defecto la venta es
  // anónima y el tab Cliente queda bloqueado; si la venta ya tiene un
  // CIF/NIF guardado (se reabre una venta ya facturada a un cliente), se
  // arranca con el tab desbloqueado. No se persiste en ningún sitio — es
  // el mismo criterio que usa el propio Eneboo (no hay columna para esto).
  const [datosFacturaActivo, setDatosFacturaActivo] = useState(false);
  const [confirmandoDatosFactura, setConfirmandoDatosFactura] = useState(false);
  const [tarjetaParaSobrescribir, setTarjetaParaSobrescribir] = useState<TarjetaPuntos | null>(null);

  useEffect(() => {
    emitir("venta_id_cambiada", id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setDatosFacturaActivo(!!ctx.venta.cliente?.idFiscal);
  }, [ctx.venta.id, ctx.venta.cliente?.idFiscal]);

  const { estado, lineaActiva } = ctx;

  const titulo = (venta: VentaTpv) =>
    tituloDocumentoVenta(
      { codigo: venta.codigo, cliente: { nombre_cliente: venta.cliente?.nombre ?? "" } },
      "Nueva Venta"
    );

  if (!ctx.venta.id) return;

  const esEditable = editable(ctx.venta);

  // Al desactivar, se limpian los datos de cliente (vuelve al cliente de
  // paso "Venta PDA") y el email, igual que limpiarDatosCliente() en
  // Eneboo — la tarjeta Gansociety no se toca, se queda vinculada.
  const desactivarDatosFactura = async () => {
    await emitir("cambio_cliente_listo", VENTA_PDA);
    await emitir("datos_cliente_listo", {
      email: "",
      tarjeta_puntos_id: ctx.venta.tarjetaPuntosId ?? "",
    });
    setDatosFacturaActivo(false);
  };

  // Igual que en Eneboo (tbnDatosFra_toggled): si la venta ya tiene una
  // tarjeta Gansociety vinculada de antes (p.ej. se desactivó y se vuelve a
  // activar sin borrar la tarjeta), se pregunta si se quieren volcar de
  // nuevo los datos de esa tarjeta sobre el cliente o dejarlo como está.
  const confirmarDatosFactura = async () => {
    setDatosFacturaActivo(true);
    setConfirmandoDatosFactura(false);

    if (ctx.venta.tarjetaPuntosId) {
      const tarjetas = await buscarTarjetasPuntos({ codigo: ctx.venta.tarjetaPuntosId });
      if (tarjetas[0]) setTarjetaParaSobrescribir(tarjetas[0]);
    }
  };

  const sobrescribirConDatosTarjeta = async () => {
    if (!tarjetaParaSobrescribir) return;
    await aplicarTarjetaACliente(emitir, tarjetaParaSobrescribir, ctx.venta.email ?? "", true);
    setTarjetaParaSobrescribir(null);
  };

  const acciones = [
    {
      icono: datosFacturaActivo ? "candado_abierto" : "candado",
      texto: "Datos Factura",
      onClick: () =>
        datosFacturaActivo
          ? desactivarDatosFactura()
          : setConfirmandoDatosFactura(true),
      deshabilitado: !esEditable,
    },
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
      <TarjetaGansociety
        venta={ctx.venta}
        publicar={emitir}
        editable={esEditable}
        datosFacturaActivo={datosFacturaActivo}
      />

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
    // Tabs solo permite fijar la pestaña inicial en el montaje (no cambia
    // en caliente) — key fuerza un remontaje cada vez que cambia el
    // candado, para saltar a "Cliente" (índice 1) al activar y volver a
    // "Datos" (índice 0) al desactivar, en vez de quedarse en una pestaña
    // que acaba de (des)habilitarse.
    <Tabs
      key={datosFacturaActivo ? "con-datos-factura" : "sin-datos-factura"}
      tabInicial={datosFacturaActivo ? 1 : 0}
    >
      <Tab label="Datos">
        <TabDatos venta={venta} />
      </Tab>

      <Tab label="Cliente" deshabilitado={!datosFacturaActivo}>
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

      {confirmandoDatosFactura && (
        <QModalConfirmacion
          nombre="confirmarDatosFacturaVentaTpv"
          abierto={true}
          titulo="Datos Factura"
          mensaje="Vas a facturar esta venta con los datos fiscales de un cliente. ¿Deseas continuar?"
          onCerrar={() => setConfirmandoDatosFactura(false)}
          onAceptar={confirmarDatosFactura}
        />
      )}

      {tarjetaParaSobrescribir && (
        <QModalConfirmacion
          nombre="sobrescribirClienteConTarjetaVentaTpv"
          abierto={true}
          titulo="Gansociety"
          mensaje="Ya hay datos del cliente informados. ¿Desea modificarlos por los de la tarjeta seleccionada?"
          onCerrar={() => setTarjetaParaSobrescribir(null)}
          onAceptar={sobrescribirConDatosTarjeta}
        />
      )}
    </Detalle>
  );
};
