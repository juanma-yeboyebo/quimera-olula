import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QCheckbox, QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import {
  getEstadoOportunidad,
  postEstadoOportunidad,
} from "../infraestructura.ts";
import "./CrearEstadoOportunidad.css";
import {
  metaNuevoEstadoOportunidad,
  nuevoEstadoOportunidadVacio,
} from "./crear.ts";

export const CrearEstadoOportunidad = ({
  publicar,
}: {
  publicar: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);

  const [creando, setCreando] = useState(false);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevoEstadoOportunidad,
    nuevoEstadoOportunidadVacio
  );

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postEstadoOportunidad(modelo));
    const estado_oportunidad = await intentar(() => getEstadoOportunidad(id));
    publicar("estado_oportunidad_creado", estado_oportunidad);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_estado_oportunidad_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearEstadoOportunidad">
        <h2>Nuevo Estado de Oportunidad de Venta</h2>

        <quimera-formulario>
          <QInput label="Descripción" {...uiProps("descripcion")} />
          <QInput label="Probabilidad (%)" {...uiProps("probabilidad")} />
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
