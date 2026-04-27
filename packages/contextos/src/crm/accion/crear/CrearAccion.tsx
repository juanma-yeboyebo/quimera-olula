import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { getAccion, postAccion } from "../infraestructura.ts";
import "./CrearAccion.css";
import { metaNuevaAccion, nuevaAccionVacia } from "./crear.ts";
import { NuevaAccion } from "./diseño.ts";

export const CrearAccion = ({
  publicar,
  modeloVacio = nuevaAccionVacia,
}: {
  publicar: ProcesarEvento;
  modeloVacio?: NuevaAccion;
}) => {
  const { intentar } = useContext(ContextoError);

  const [creando, setCreando] = useState(false);
  const { modelo, uiProps, valido } = useModelo(metaNuevaAccion, modeloVacio);

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postAccion(modelo));
    const accion = await intentar(() => getAccion(id));
    publicar("accion_creada", accion);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_accion_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearAccion">
        <h2>Nueva Acción</h2>

        <quimera-formulario>
          <QInput label="Descripción" {...uiProps("descripcion")} />
          <QInput label="Fecha" {...uiProps("fecha")} />
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
