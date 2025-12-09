import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function Clientes({ codCliente }) {
  const [{ clientes }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdClientesProp",
      payload: { id: codCliente ? codCliente : "" },
    });
  }, [dispatch, codCliente]);

  const callbackClienteChanged = useCallback(
    payload => dispatch({ type: "onClientesItemChanged", payload }),
    [dispatch],
  );

  console.log("????????????", codCliente, clientes?.current);

  return (
    <Quimera.Template id="Clientes">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Clientes/MasterClientes" codCliente={codCliente} />}
        DetailComponent={
          <Quimera.View
            id="Cliente"
            initCliente={clientes.dict[clientes.current]}
            codCliente={clientes.current}
            callbackChanged={callbackClienteChanged}
          />
        }
        current={clientes.current}
      />
    </Quimera.Template>
  );
}

export default Clientes;
