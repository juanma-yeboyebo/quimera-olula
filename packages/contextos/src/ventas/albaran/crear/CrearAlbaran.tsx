import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useFocus } from "@olula/lib/useFocus.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoAlbaran, nuevoAlbaranVacio } from "../dominio.ts";
import { getAlbaran, postAlbaran } from "../infraestructura.ts";
import "./CrearAlbaran.css";

export const CrearAlbaran = ({
  publicar = async () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const nuevoAlbaran = useModelo(metaNuevoAlbaran, nuevoAlbaranVacio);
  const { intentar } = useContext(ContextoError);
  const focus = useFocus();

  const guardar = async () => {
    const id = await intentar(() => postAlbaran(nuevoAlbaran.modelo));
    const albaranCreado = await getAlbaran(id);
    publicar("albaran_creado", albaranCreado);
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    nuevoAlbaran.init();
  };

  return (
    <div className="CrearAlbaran">
      <quimera-formulario>
        <Cliente
          {...nuevoAlbaran.uiProps("cliente_id", "nombre")}
          nombre="albaran_cliente_id"
          ref={focus}
        />
        <DirCliente
          clienteId={nuevoAlbaran.modelo.cliente_id}
          {...nuevoAlbaran.uiProps("direccion_id")}
        />
        <QInput label="Empresa" {...nuevoAlbaran.uiProps("empresa_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoAlbaran.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
