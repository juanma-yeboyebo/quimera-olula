import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QCheckbox, QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { getEstadoLead, postEstadoLead } from "../infraestructura.ts";
import "./CrearEstadoLead.css";
import { metaNuevoEstadoLead, nuevoEstadoLeadVacio } from "./crear.ts";

export const CrearEstadoLead = ({ publicar }: { publicar: EmitirEvento }) => {
  const { intentar } = useContext(ContextoError);

  const [creando, setCreando] = useState(false);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevoEstadoLead,
    nuevoEstadoLeadVacio
  );

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postEstadoLead(modelo));
    const estado_lead = await intentar(() => getEstadoLead(id));
    publicar("estado_lead_creado", estado_lead);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_estado_lead_cancelada");
  }, [creando, publicar]);

  return (
    <QModal
      abierto={true}
      nombre="mostrar"
      titulo="Nuevo Estado de Lead"
      onCerrar={cancelar}
    >
      <div className="CrearEstadoLead">
        <quimera-formulario>
          <QInput label="Descripción" {...uiProps("descripcion")} />
          <QCheckbox label="Valor por Defecto" {...uiProps("valor_defecto")} />
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
