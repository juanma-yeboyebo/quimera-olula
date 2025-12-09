import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function PartesCarros({ codigoParteProp, idParte, useStyles }) {
  const [{ codigoParte, partesCarros }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { codigoParteProp },
    });
  }, [codigoParteProp]);

  useEffect(() => {
    dispatch({
      type: "onIdPartesCarrosProp",
      payload: { id: idParte ? parseInt(idParte, 10) : "" },
    });
  }, [idParte]);

  const callbackParteCarroCambiado = useCallback(
    payload => dispatch({ type: "onPartesCarrosItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="PartesCarros">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="PartesCarros/PartesCarrosMaster" idParte={idParte} />}
        DetailComponent={
          <Quimera.View
            id="ParteCarro"
            urlAtrasProp={codigoParte ? "albaranesVenta" : null}
            initParteCarro={partesCarros.dict[partesCarros.current]}
            idParte={partesCarros.current}
            callbackChanged={callbackParteCarroCambiado}
          />
        }
        loading={partesCarros.loading}
        variant={codigoParte ? "onlydetail" : "partida_vertical"}
        current={partesCarros.current}
      />
    </Quimera.Template>
  );
}

export default PartesCarros;
