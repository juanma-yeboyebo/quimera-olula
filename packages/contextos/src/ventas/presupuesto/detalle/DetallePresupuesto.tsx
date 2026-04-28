import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { CambiarDescuento } from "../../comun/componentes/moleculas/CambiarDescuento/CambiarDescuento.tsx";
import { TotalesVenta } from "../../venta/vistas/TotalesVenta.tsx";
import { AprobarPresupuesto } from "../aprobar/AprobarPresupuesto.tsx";
import { BorrarPresupuesto } from "../borrar/BorrarPresupuesto.tsx";
import { Presupuesto } from "../diseño.ts";
import "./DetallePresupuesto.css";
import { metaPresupuesto, presupuestoVacio } from "./dominio.ts";
import { Lineas } from "./Lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosBase as TabDatos } from "./TabDatosBase.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetallePresupuesto = ({
  id,
  publicar = async () => {},
}: {
  id?: string;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const presupuestoId = id ?? params.id;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      presupuesto: presupuestoVacio(),
      presupuestoInicial: presupuestoVacio(),
      lineaActiva: null,
    },
    publicar
  );

  const presupuesto = useModelo(metaPresupuesto, ctx.presupuesto);
  const { modificado, valido } = presupuesto;

  useEffect(() => {
    emitir("presupuesto_id_cambiado", presupuestoId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presupuestoId]);

  const { estado, lineaActiva } = ctx;

  const titulo = (presupuesto: Presupuesto) => presupuesto.codigo;

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_presupuesto_lista", presupuesto.modelo);
  }, [emitir, presupuesto]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_presupuesto_cancelada");
  }, [emitir]);

  if (!ctx.presupuesto.id) return;

  const acciones = [
    {
      texto: "Aprobar",
      onClick: () => emitir("aprobacion_solicitada", ctx.presupuesto),
      deshabilitado: ctx.presupuesto.aprobado,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      advertencia: true,
      onClick: () => emitir("borrar_solicitado"),
      deshabilitado: ctx.presupuesto.aprobado,
    },
  ];

  return (
    <Detalle
      id={ctx.presupuesto.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.presupuesto}
      cerrarDetalle={() => emitir("presupuesto_deseleccionado", null)}
    >
      {estado === "ABIERTO" && !ctx.presupuesto.aprobado && (
        <QuimeraAcciones acciones={acciones} vertical />
      )}

      <Tabs>
        <Tab label="Cliente">
          <TabCliente
            presupuesto={presupuesto}
            estado={estado}
            publicar={emitir}
          />
        </Tab>

        <Tab label="Datos">
          <TabDatos presupuesto={presupuesto} />
        </Tab>

        <Tab label="Observaciones">
          <TabObservaciones presupuesto={presupuesto} />
        </Tab>
      </Tabs>

      {estado === "ABIERTO" && !ctx.presupuesto.aprobado && modificado && (
        <div className="botones maestro-botones">
          <QBoton onClick={handleGuardar} deshabilitado={!valido}>
            Guardar Cambios
          </QBoton>
          <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
            Cancelar
          </QBoton>
        </div>
      )}

      <TotalesVenta modeloVenta={presupuesto} publicar={emitir} />

      {estado === "CAMBIANDO_DESCUENTO" && (
        <CambiarDescuento publicar={emitir} venta={ctx.presupuesto} />
      )}

      <Lineas
        presupuesto={ctx.presupuesto}
        lineaActiva={lineaActiva}
        publicar={emitir}
        estadoPresupuesto={estado}
      />

      {estado === "BORRANDO_PRESUPUESTO" && (
        <BorrarPresupuesto presupuesto={ctx.presupuesto} publicar={emitir} />
      )}

      {estado === "APROBANDO_PRESUPUESTO" && (
        <AprobarPresupuesto presupuesto={ctx.presupuesto} publicar={emitir} />
      )}
    </Detalle>
  );
};
