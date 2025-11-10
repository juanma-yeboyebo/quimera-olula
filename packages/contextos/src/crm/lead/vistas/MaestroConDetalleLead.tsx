import { QBoton } from "@olula/componentes/index.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useCallback } from "react";
import { Lead } from "../diseño.ts";
import { metaTablaLead } from "../dominio.ts";
import { getLeads } from "../infraestructura.ts";
import { AltaLead } from "./AltaLead.tsx";
import { DetalleLead } from "./DetalleLead/DetalleLead.tsx";

type Estado = "inactivo" | "creando";

type Contexto = {
  leads: ListaSeleccionable<Lead>;
};

const setLeads =
  (aplicable: (leads: ListaSeleccionable<Lead>) => ListaSeleccionable<Lead>) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        leads: aplicable(maquina.contexto.leads),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      leads: listaSeleccionableVacia<Lead>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      lead_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setLeads(cambiarItem(payload as Lead))),
      lead_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setLeads(seleccionarItem(payload as Lead))),
      lead_borrado: ({ maquina }) => {
        const { leads } = maquina.contexto;
        if (!leads.idActivo) {
          return maquina;
        }
        return pipe(maquina, setLeads(quitarItem(leads.idActivo)));
      },
      leads_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setLeads(cargar(payload as Lead[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setLeads((leads) => ({
            ...leads,
            idActivo: null,
          }))
        ),
    },
    creando: {
      lead_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setLeads(incluirItem(payload as Lead, {}))
        ),
      creacion_cancelada: "inactivo",
    },
  },
};

export const MaestroConDetalleLead = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { leads } = contexto;

  const setEntidades = useCallback(
    (payload: Lead[]) => emitir("leads_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Lead) => emitir("lead_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(leads);

  return (
    <div className="Lead">
      <MaestroDetalle<Lead>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Leads</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        metaTabla={metaTablaLead}
        entidades={leads.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getLeads}
        Detalle={<DetalleLead leadInicial={seleccionada} publicar={emitir} />}
      />
      <AltaLead emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
