import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useCallback, useEffect } from "react";

function ShPreparacionDePedidos({ codPreparacionDePedido, useStyles }) {
  const [{ preparaciones }, dispatch] = useStateValue();
  const _c = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdPreparacionesProp",
      payload: { id: codPreparacionDePedido ? codPreparacionDePedido : "" },
    });
  }, [codPreparacionDePedido]);

  const width = useWidth();

  // const mobile = ["xs", "sm", "md"].includes(width);
  const mobile = true;
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !preparaciones.current);
  const detalleVisible = desktop || (mobile && preparaciones.current);

  const callbackPreparacionCambiado = useCallback(
    payload => dispatch({ type: "onPreparacionesItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="ShPreparacionDePedidos">
      {masterVisible && (
        <Quimera.SubView
          id="ShPreparacionDePedidosMaster"
          codPreparacionDePedido={codPreparacionDePedido}
        />
      )}
      {detalleVisible && (
        <Quimera.View
          id="ShPreparacionDePedido"
          initPreparacion={preparaciones.dict[preparaciones.current]}
          codPreparacionDePedido={preparaciones.current}
          callbackChanged={callbackPreparacionCambiado}
        />
      )}
      {/* <QMasterDetail
        MasterComponent={
          <Quimera.SubView
            id="ShPreparacionDePedidosMaster"
            codPreparacionDePedido={codPreparacionDePedido}
          />
        }
        DetailComponent={
          <Quimera.View
            id="ShPreparacionDePedido"
            initPreparacion={preparaciones.dict[preparaciones.current]}
            callbackChanged={callbackPreparacionCambiado}
          />
        }
        current={preparaciones.current}
      /> */}
    </Quimera.Template>
  );
}

export default ShPreparacionDePedidos;
