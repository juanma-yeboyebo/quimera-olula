import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QCheckbox, QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { getFuenteLead, postFuenteLead } from "../infraestructura.ts";
import "./CrearFuenteLead.css";
import { metaNuevaFuenteLead, nuevaFuenteLeadVacia } from "./crear.ts";

export const CrearFuenteLead = ({ publicar }: { publicar: EmitirEvento }) => {
  const { intentar } = useContext(ContextoError);

  const [creando, setCreando] = useState(false);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaFuenteLead,
    nuevaFuenteLeadVacia
  );

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postFuenteLead(modelo));
    const fuente_lead = await intentar(() => getFuenteLead(id));
    publicar("fuente_lead_creada", fuente_lead);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_fuente_lead_cancelada");
  }, [creando, publicar]);

  return (
    <QModal
      abierto={true}
      nombre="mostrar"
      titulo="Nueva Fuente de Lead"
      onCerrar={cancelar}
    >
      <div className="CrearFuenteLead">
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
