import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useState } from "react";
import { Cliente } from "../../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../../comun/componentes/dirCliente.tsx";
import {
  NuevoPresupuesto,
  NuevoPresupuestoClienteNoRegistrado,
} from "../../diseño.ts";
import {
  metaNuevoPresupuesto,
  metaNuevoPresupuestoClienteNoRegistrado,
  nuevoPresupuestoClienteNoRegistradoVacio,
  nuevoPresupuestoVacio,
} from "../../dominio.ts";
import { getPresupuesto, postPresupuesto } from "../../infraestructura.ts";
import "./CrearPresupuesto.css";

export const CrearPresupuesto = ({
  publicar = () => {},
  activo = false,
}: {
  publicar?: EmitirEvento;
  activo: boolean;
}) => {
  const [modoNoRegistrado, setModoNoRegistrado] = useState(false);
  const presupuestoRegistrado = useModelo(
    metaNuevoPresupuesto,
    nuevoPresupuestoVacio
  );
  const presupuestoNoRegistrado = useModelo(
    metaNuevoPresupuestoClienteNoRegistrado,
    nuevoPresupuestoClienteNoRegistradoVacio
  );

  const toggleModoCliente = () => {
    const nuevoModo = !modoNoRegistrado;
    setModoNoRegistrado(nuevoModo);

    presupuestoRegistrado.init(nuevoPresupuestoVacio);
    presupuestoNoRegistrado.init(nuevoPresupuestoClienteNoRegistradoVacio);
  };

  const cancelar = () => {
    presupuestoRegistrado.init(nuevoPresupuestoVacio);
    presupuestoNoRegistrado.init(nuevoPresupuestoClienteNoRegistradoVacio);
    setModoNoRegistrado(false);
    publicar("creacion_presupuesto_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaPresupuesto
        publicar={publicar}
        presupuestoRegistrado={presupuestoRegistrado}
        presupuestoNoRegistrado={presupuestoNoRegistrado}
        modoNoRegistrado={modoNoRegistrado}
        onToggleModoCliente={toggleModoCliente}
      />
    </Mostrar>
  );
};

const FormAltaPresupuesto = ({
  publicar = () => {},
  presupuestoRegistrado,
  presupuestoNoRegistrado,
  modoNoRegistrado,
  onToggleModoCliente,
}: {
  publicar?: EmitirEvento;
  presupuestoRegistrado: HookModelo<NuevoPresupuesto>;
  presupuestoNoRegistrado: HookModelo<NuevoPresupuestoClienteNoRegistrado>;
  modoNoRegistrado: boolean;
  onToggleModoCliente: () => void;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    let modelo;

    if (modoNoRegistrado) {
      modelo = { ...presupuestoNoRegistrado.modelo };
    } else {
      modelo = { ...presupuestoRegistrado.modelo };
    }

    const id = await intentar(() => postPresupuesto(modelo));
    const presupuestoCreada = await getPresupuesto(id);
    publicar("presupuesto_creado", presupuestoCreada);

    // Reiniciar ambos modelos
    presupuestoRegistrado.init(nuevoPresupuestoVacio);
    presupuestoNoRegistrado.init(nuevoPresupuestoClienteNoRegistradoVacio);
  };

  const cancelar = () => {
    publicar("creacion_presupuesto_cancelada");
    presupuestoRegistrado.init(nuevoPresupuestoVacio);
    presupuestoNoRegistrado.init(nuevoPresupuestoClienteNoRegistradoVacio);
  };

  return (
    <div className="CrearPresupuesto">
      <h2>Nueva Presupuesto</h2>
      <div className="modo-cliente">
        <QBoton onClick={onToggleModoCliente} variante="texto" tipo="button">
          {modoNoRegistrado ? "Cliente no registrado" : "Cliente registrado"}
        </QBoton>
      </div>
      <quimera-formulario>
        {modoNoRegistrado ? (
          <>
            <QInput
              label="Nombre del Cliente"
              {...presupuestoNoRegistrado.uiProps("nombre_cliente")}
            />
            <QInput
              label="ID Fiscal"
              {...presupuestoNoRegistrado.uiProps("id_fiscal")}
            />

            <QInput
              label="Tipo de Vía"
              {...presupuestoNoRegistrado.uiProps("tipo_via")}
            />
            <QInput
              label="Nombre de la Vía"
              {...presupuestoNoRegistrado.uiProps("nombre_via")}
            />
            <QInput
              label="Ciudad"
              {...presupuestoNoRegistrado.uiProps("ciudad")}
            />
            <QInput
              label="Empresa"
              {...presupuestoNoRegistrado.uiProps("empresa_id")}
            />
          </>
        ) : (
          <>
            <Cliente
              {...presupuestoRegistrado.uiProps("cliente_id", "nombre")}
              nombre="clientePresupuesto"
            />
            <DirCliente
              clienteId={presupuestoRegistrado.modelo.cliente_id}
              {...presupuestoRegistrado.uiProps("direccion_id")}
            />
            <QInput
              label="Empresa"
              {...presupuestoRegistrado.uiProps("empresa_id")}
            />
          </>
        )}
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!presupuestoRegistrado.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
