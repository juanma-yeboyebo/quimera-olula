import { Usuario } from "#/comun/componentes/usuario.tsx";
import { EstadoIncidencia } from "#/crm/comun/componentes/EstadoIncidencia.tsx";
import { PrioridadIncidencia } from "#/crm/comun/componentes/PrioridadIncidencia.tsx";
import {
  QDate,
  QInput,
  QTextArea,
  Tab,
  Tabs,
} from "@olula/componentes/index.js";
import { HookModelo } from "@olula/lib/useModelo.js";
import { Incidencia } from "../../diseño.ts";

export const TabGeneral = ({
  incidencia,
}: {
  incidencia: HookModelo<Incidencia>;
}) => {
  const { uiProps } = incidencia;

  return (
    <div className="TabGeneral">
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} />
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QDate label="Fecha" {...uiProps("fecha")} />
        <PrioridadIncidencia {...uiProps("prioridad")} />
        <EstadoIncidencia {...uiProps("estado")} />
        <Usuario
          {...uiProps("responsable_id", "nombre_responsable")}
          label="Responsable"
        />
        <div className="Tabs">
          <Tabs>
            <Tab label="Descripción">
              <QTextArea
                label="Descripción larga"
                rows={5}
                {...uiProps("descripcion_larga")}
              />
            </Tab>
            <Tab label="Resolución">
              <QTextArea
                label="Resolución"
                rows={5}
                {...uiProps("resolucion")}
              />
            </Tab>
          </Tabs>
        </div>
      </quimera-formulario>
    </div>
  );
};
