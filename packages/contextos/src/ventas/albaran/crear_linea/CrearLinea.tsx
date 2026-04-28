import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useFocus } from "@olula/lib/useFocus.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { postLinea } from "../infraestructura.ts";
import "./CrearLinea.css";
import { metaNuevaLineaAlbaran, nuevaLineaAlbaranVacia } from "./dominio.ts";

export const CrearLinea = ({
  albaranId,
  publicar,
}: {
  albaranId: string;
  publicar: ProcesarEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLineaAlbaran,
    nuevaLineaAlbaranVacia
  );
  const [creando, setCreando] = useState(false);
  const focus = useFocus();

  const crear = useCallback(async () => {
    await intentar(() => postLinea(albaranId, modelo));
    setCreando(true);
    publicar("alta_linea_lista");
  }, [modelo, publicar, albaranId, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("crear_linea_cancelado");
  }, [creando, publicar]);

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_albaran"
      titulo="Crear línea"
      onCerrar={cancelar}
    >
      <div className="CrearLinea">
        <quimera-formulario>
          <Articulo
            {...uiProps("referencia", "descripcion")}
            nombre="referencia_nueva_linea_albaran"
            ref={focus}
          />
          <QInput label="Cantidad" {...uiProps("cantidad")} />
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
