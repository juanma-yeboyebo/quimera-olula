import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

function ToCarritos({ idCarrito, useStyles }) {
  const [{ carritos }, dispatch] = useStateValue();
  // const _c = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdCarritosProp",
      payload: { id: idCarrito ? parseInt(idCarrito) : "" },
    });
  }, [idCarrito]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !carritos.current);
  const detalleVisible = desktop || (mobile && carritos.current);

  const callbackCarritoCambiado = useCallback(
    payload => dispatch({ type: "getCarritos", payload }),
    [],
  );

  const guest = util.getUser().user === "guest";
  if (guest) {
    window.location.href = "/";
  }

  return (
    <Quimera.Template id="ToCarritos">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="ToCarritosMaster" idCarrito={idCarrito} />}
        DetailComponent={
          <Quimera.View
            id="ToCarrito"
            initCarrito={carritos.dict[carritos.current]}
            idCarrito={carritos.current}
            callbackChanged={callbackCarritoCambiado}
          />
        }
        current={carritos.current}
      />
    </Quimera.Template>
  );
}

export default ToCarritos;
