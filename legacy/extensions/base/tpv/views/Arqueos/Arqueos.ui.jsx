import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useEffect } from "react";

function Arqueos({ idArqueo }) {
  const [{ arqueos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdArqueosProp",
      payload: { id: idArqueo ? idArqueo : "" },
    });
  }, [dispatch, idArqueo]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !arqueos.current);
  const detalleVisible = !!arqueos.current;

  return (
    <Quimera.Template id="Arqueos">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="Arqueos/ArqueosMaster" />}
          {detalleVisible && <Quimera.SubView id="Arqueos/ArqueosDetalle" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Arqueos;
