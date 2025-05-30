import { useEffect } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../../../componentes/atomos/qselect.tsx";
import { useModelo } from "../../../../../comun/useModelo.ts";
import { DirCliente } from "../../../diseño.ts";
import { metaDireccion } from "../../../dominio.ts";
import { actualizarDireccion } from "../../../infraestructura.ts";
// import "./TabComercial.css";

export const EdicionDireccion = ({
  clienteId,
  direccion,
  emitir,
}: {
  clienteId: string;
  direccion: DirCliente;
  emitir: (evento: string, payload?: unknown) => void;
}) => {
  const direccionEditada = useModelo(metaDireccion, direccion);

  useEffect(() => {
    direccionEditada.init(direccion);
  }, [direccion, direccionEditada]);

  const guardar = async () => {
    await actualizarDireccion(clienteId, direccionEditada.modelo);
    emitir("DIRECCION_ACTUALIZADA", direccionEditada.modelo);
  };

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
      <h2>Edición de dirección</h2>
      <quimera-formulario>
        <div style={{ gridColumn: "span 2" }}>
          <QSelect
            label="Tipo de Vía"
            opciones={opciones}
            {...direccionEditada.uiProps("tipo_via")}
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
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("EDICION_CANCELADA")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
