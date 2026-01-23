import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect, useState } from "react";
import { CrearOportunidadVenta } from "../crear/CrearOportunidadVenta.tsx";
import { OportunidadVenta } from "../diseño.ts";
import { DetalleOportunidadVenta } from "../vistas/DetalleOportunidadVenta/DetalleOportunidadVenta.tsx";
import { TarjetaOportunidadVenta } from "../vistas/TarjetaOportunidadVenta.tsx";
import { metaTablaOportunidadVenta } from "./maestro.ts";
import "./MaestroOportunidadesVenta.css";
import { getMaquina } from "./maquina.ts";

export const MaestroOportunidades = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    oportunidades: [],
    totalOportunidades: 0,
    activa: null,
  });

  const crear = useCallback(
    () => emitir("creacion_de_oportunidad_solicitada"),
    [emitir]
  );

  const setSeleccionada = useCallback(
    (payload: OportunidadVenta) => emitir("oportunidad_seleccionada", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_oportunidades_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="OportunidadesVenta">
      <MaestroDetalleControlado<OportunidadVenta>
        Maestro={
          <>
            <h2>Oportunidades de Venta</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nueva</QBoton>
            </div>
            <ListadoControlado<OportunidadVenta>
              metaTabla={metaTablaOportunidadVenta}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              tarjeta={(oportunidad) => (
                <TarjetaOportunidadVenta oportunidad={oportunidad} />
              )}
              entidades={ctx.oportunidades}
              totalEntidades={ctx.totalOportunidades}
              seleccionada={ctx.activa}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleOportunidadVenta
            oportunidadInicial={ctx.activa}
            publicar={emitir}
          />
        }
        seleccionada={ctx.activa}
        modoDisposicion="maestro-50"
      />
      {ctx.estado === "CREANDO" && <CrearOportunidadVenta publicar={emitir} />}
    </div>
  );
};
