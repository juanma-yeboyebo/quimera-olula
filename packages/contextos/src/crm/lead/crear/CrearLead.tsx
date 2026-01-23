import { Usuario } from "#/comun/componentes/usuario.tsx";
import { EstadoLead } from "#/crm/comun/componentes/estado_lead.tsx";
import { FuenteLead } from "#/crm/comun/componentes/fuente_lead.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { getLead, postLead } from "../infraestructura.ts";
import "./CrearLead.css";
import { metaNuevoLead, nuevoLeadVacio } from "./crear.ts";

export const CrearLead = ({ publicar }: { publicar: EmitirEvento }) => {
  const { intentar } = useContext(ContextoError);

  const { modelo, uiProps, valido } = useModelo(metaNuevoLead, nuevoLeadVacio);
  const [creando, setCreando] = useState(false);

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postLead(modelo));
    const lead = await intentar(() => getLead(id));
    publicar("lead_creado", lead);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_lead_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearLead">
        <h2>Nuevo Lead</h2>

        <quimera-formulario>
          <QInput label="Nombre" {...uiProps("nombre")} />
          <Usuario {...uiProps("responsable_id")} label="Responsable" />
          <EstadoLead {...uiProps("estado_id")} />
          <FuenteLead {...uiProps("fuente_id")} />
        </quimera-formulario>

        <div className="botones">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
          <QBoton onClick={cancelar} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
