import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { NuevaCaja } from "../diseño.ts";
import { metaNuevaCaja, nuevaCajaVacia } from "../dominio.ts";
import { getCaja, postCaja } from "../infraestructura.ts";
import "./CrearCaja.css";

export const CrearCaja = ({
  publicar = () => {},
  activo = false,
}: {
  publicar?: EmitirEvento;
  activo: boolean;
}) => {
  const caja = useModelo(metaNuevaCaja, {
    ...nuevaCajaVacia,
  });

  const cancelar = () => {
    caja.init();
    publicar("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaCaja publicar={publicar} caja={caja} />
    </Mostrar>
  );
};

const FormAltaCaja = ({
  publicar = () => {},
  caja,
}: {
  publicar?: EmitirEvento;
  caja: HookModelo<NuevaCaja>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...caja.modelo,
    };
    const id = await intentar(() => postCaja(modelo));
    const cajaCreada = await getCaja(id);
    publicar("caja_creada", cajaCreada);
    caja.init();
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    caja.init();
  };

  return (
    <div className="CrearCaja">
      <h2>Nueva Caja</h2>
      <quimera-formulario>
        <QInput label="Código caja" {...caja.uiProps("id")} />
        <Almacen label="Almacen" {...caja.uiProps("codigo_almacen")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!caja.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
