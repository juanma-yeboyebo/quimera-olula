import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect, useState } from "react";
import { CrearLead } from "../crear/CrearLead.tsx";
import { DetalleLead } from "../detalle/DetalleLead.tsx";
import { Lead } from "../diseño.ts";
import { metaTablaLead } from "./maestro.ts";
import "./MaestroLeads.css";
import { getMaquina } from "./maquina.ts";

type Layout = "TABLA" | "TARJETA";

export const MaestroLeads = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    leads: listaActivaEntidadesInicial<Lead>(id, criteria),
  });

  useUrlParams(ctx.leads.activo, ctx.leads.criteria);

  useEffect(() => {
    emitir("recarga_de_leads_solicitada", ctx.leads.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const esMovil = useEsMovil();
  const [layout, setLayout] = useState<Layout>("TARJETA");

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  return (
    <div className="MaestroLeads">
      <MaestroDetalle<Lead>
        Maestro={
          <>
            <h2>Leads</h2>
            {!esMovil && (
              <div className="maestro-botones">
                <QBoton
                  texto={
                    layout === "TARJETA"
                      ? "Cambiar a TABLA"
                      : "Cambiar a TARJETA"
                  }
                  onClick={cambiarLayout}
                />
              </div>
            )}

            <Listado<Lead>
              metaTabla={metaTablaLead}
              criteria={ctx.leads.criteria}
              modo={esMovil || layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaLead}
              entidades={ctx.leads.lista}
              totalEntidades={ctx.leads.total}
              seleccionada={ctx.leads.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton onClick={() => emitir("creacion_de_lead_solicitada")}>
                    Nuevo
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) => emitir("lead_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={<DetalleLead id={ctx.leads.activo} publicar={emitir} />}
        seleccionada={ctx.leads.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearLead publicar={emitir} />}
    </div>
  );
};

const TarjetaLead = (lead: Lead) => {
  return (
    <QTarjetaGenerica
      avatar={<QAvatar nombre={lead.nombre} />}
      arribaIzquierda={lead.nombre}
      abajoIzquierda={lead.estado_id}
    />
  );
};
