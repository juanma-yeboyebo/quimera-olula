import { Usuario } from "#/comun/componentes/usuario.tsx";
import { EstadoIncidencia } from "#/crm/comun/componentes/EstadoIncidencia.tsx";
import { PrioridadIncidencia } from "#/crm/comun/componentes/PrioridadIncidencia.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QDate, QModal, QTextArea } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { getIncidencia, postIncidencia } from "../infraestructura.ts";
import "./CrearIncidencia.css";
import { metaNuevaIncidencia, nuevaIncidenciaVacia } from "./crear.ts";

export const CrearIncidencia = ({ publicar }: { publicar: EmitirEvento }) => {
  const { intentar } = useContext(ContextoError);

  const [creando, setCreando] = useState(false);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaIncidencia,
    nuevaIncidenciaVacia
  );

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postIncidencia(modelo));
    const incidencia = await intentar(() => getIncidencia(id));
    publicar("incidencia_creada", incidencia);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_incidencia_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearIncidencia">
        <h2>Nueva Incidencia</h2>

        <quimera-formulario>
          <QInput label="Descripción" {...uiProps("descripcion")} />
          <QInput label="Nombre" {...uiProps("nombre")} />
          <QDate label="Fecha" {...uiProps("fecha")} />
          <PrioridadIncidencia {...uiProps("prioridad")} />
          <EstadoIncidencia {...uiProps("estado")} />
          <Usuario {...uiProps("responsable_id")} label="Responsable" />
          <QTextArea
            label="Descripción larga"
            rows={5}
            {...uiProps("descripcion_larga")}
          />
        </quimera-formulario>

        <div className="botones">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Guardar
          </QBoton>
          <QBoton onClick={cancelar} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
