import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QForm } from "@olula/componentes/atomos/qform.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useEffect, useState } from "react";
import { Presupuesto, Cliente as TipoCliente } from "../diseño.ts";
import { patchCambiarCliente } from "../infraestructura.ts";

interface ClienteProps {
  presupuesto: Presupuesto;
  onClienteCambiadoCallback: (cliente: TipoCliente) => void;
}

export const ClientePresupuesto = ({
  presupuesto,
  onClienteCambiadoCallback,
}: ClienteProps) => {
  const [modoLectura, setModoLectura] = useState(true);

  useEffect(() => {
    setModoLectura(true);
  }, [presupuesto]);

  return modoLectura ? (
    <ClienteLectura
      presupuesto={presupuesto}
      onEditarCallback={() => setModoLectura(false)}
    />
  ) : (
    <ClienteEdicion
      presupuesto={presupuesto}
      onClienteCambiadoCallback={onClienteCambiadoCallback}
      canceladoCallback={() => setModoLectura(true)}
    />
  );
};

const ClienteLectura = ({
  presupuesto,
  onEditarCallback,
}: {
  presupuesto: Presupuesto;
  onEditarCallback: () => void;
}) => {
  return (
    <>
      <label>
        {presupuesto.cliente_id}: {presupuesto.nombre_cliente}
      </label>
      <label>
        {presupuesto?.nombre_via}: {presupuesto.ciudad}
      </label>
      <button onClick={onEditarCallback}>Editar</button>
    </>
  );
};

const ClienteEdicion = ({
  presupuesto,
  onClienteCambiadoCallback,
  canceladoCallback,
}: {
  presupuesto: Presupuesto;
  onClienteCambiadoCallback: (cliente: TipoCliente) => void;
  canceladoCallback: () => void;
}) => {
  const guardarClienteClicked = async ({
    cliente_id,
    direccion_id,
  }: Record<string, string>) => {
    const cambio = { cliente_id, direccion_id };
    patchCambiarCliente(presupuesto.id, cambio).then(() => {
      onClienteCambiadoCallback({ cliente_id, direccion_id });
    });
  };

  return (
    <QForm onSubmit={guardarClienteClicked} onReset={canceladoCallback}>
      <section>
        <QInput
          label="ID Dirección"
          nombre="direccion_id"
          valor={presupuesto.direccion_id}
        />
      </section>
      <section>
        <QBoton tipo="submit">Guardar</QBoton>
        <QBoton tipo="reset" variante="texto">
          Cancelar
        </QBoton>
      </section>
    </QForm>
  );
};
