import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useFocus } from "@olula/lib/useFocus.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { DirCliente } from "../diseño.ts";
import { actualizarDireccion } from "../infraestructura.ts";
import { metaDireccion } from "./dominio.ts";

export const EdicionDireccion = ({
  direccion,
  clienteId,
  publicar,
}: {
  direccion: DirCliente;
  clienteId: string;
  publicar: ProcesarEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const direccionEditada = useModelo(metaDireccion, direccion);
  const [editando, setEditando] = useState(false);
  const focus = useFocus();

  const guardar = useCallback(async () => {
    await intentar(() =>
      actualizarDireccion(clienteId, direccionEditada.modelo)
    );
    setEditando(true);
    publicar("direccion_actualizada");
  }, [direccionEditada.modelo, publicar, clienteId, intentar]);

  const cancelar = useCallback(() => {
    if (!editando) publicar("edicion_cancelada");
  }, [editando, publicar]);

  const opciones = [
    { valor: "Calle", descripcion: "Calle" },
    { valor: "Avenida", descripcion: "Avenida" },
    { valor: "Plaza", descripcion: "Plaza" },
    { valor: "Paseo", descripcion: "Paseo" },
    { valor: "Camino", descripcion: "Camino" },
    { valor: "Carretera", descripcion: "Carretera" },
  ];

  return (
    <div className="EdicionDireccion">
      <quimera-formulario>
        <div style={{ gridColumn: "span 2" }}>
          <QSelect
            label="Tipo de Vía"
            opciones={opciones}
            {...direccionEditada.uiProps("tipo_via")}
            ref={focus}
          />
        </div>
        <div style={{ gridColumn: "span 10" }}>
          <QInput
            label="Nombre de la Vía"
            {...direccionEditada.uiProps("nombre_via")}
          />
        </div>
        <div style={{ gridColumn: "span 12" }}>
          <QInput label="Ciudad" {...direccionEditada.uiProps("ciudad")} />
        </div>
      </quimera-formulario>
      <div className="botones maestro-botones">
        <QBoton deshabilitado={!direccionEditada.valido} onClick={guardar}>
          Guardar
        </QBoton>
        <QBoton tipo="reset" variante="texto" onClick={cancelar}>
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
