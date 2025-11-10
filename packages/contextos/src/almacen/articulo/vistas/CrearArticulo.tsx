import { QBoton, QInput } from "@olula/componentes/index.js";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { Articulo } from "../diseño.ts";
import { metaNuevoArticulo, nuevoArticuloVacio } from "../dominio.ts";
import { getArticulo, postArticulo } from "../infraestructura.ts";

export const CrearArticulo = ({
  emitir = () => {},
  activo = false,
}: {
  emitir?: EmitirEvento;
  activo: boolean;
}) => {
  const articulo = useModelo(metaNuevoArticulo, { ...nuevoArticuloVacio });

  const cancelar = () => {
    articulo.init();
    emitir("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaArticulo emitir={emitir} articulo={articulo} />
    </Mostrar>
  );
};

const FormAltaArticulo = ({
  emitir = () => {},
  articulo,
}: {
  emitir?: EmitirEvento;
  articulo: HookModelo<Partial<Articulo>>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = { ...articulo.modelo };
    const id = await intentar(() => postArticulo(modelo));
    const articuloCreado = await getArticulo(id);
    emitir("articulo_creado", articuloCreado);
    articulo.init();
  };

  const cancelar = () => {
    emitir("creacion_cancelada");
    articulo.init();
  };

  return (
    <div className="CrearArticulo">
      <h2>Nuevo Módulo</h2>
      <quimera-formulario>
        <QInput label="Referencia" {...articulo.uiProps("id")} />
        <QInput label="Descripción" {...articulo.uiProps("descripcion")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!articulo.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
