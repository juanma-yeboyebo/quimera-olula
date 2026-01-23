import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { getContacto, postContacto } from "../infraestructura.ts";
import "./CrearContacto.css";
import { metaNuevoContacto, nuevoContactoVacio } from "./crear.ts";

export const CrearContacto = ({ publicar }: { publicar: EmitirEvento }) => {
  const { intentar } = useContext(ContextoError);

  const { modelo, uiProps, valido } = useModelo(
    metaNuevoContacto,
    nuevoContactoVacio
  );
  const [creando, setCreando] = useState(false);

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postContacto(modelo));
    const contacto = await intentar(() => getContacto(id));
    publicar("contacto_creado", contacto);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_contacto_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearContacto">
        <h2>Nuevo Contacto</h2>

        <quimera-formulario>
          <QInput label="Nombre" {...uiProps("nombre")} />
          <QInput label="Email" {...uiProps("email")} />
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
