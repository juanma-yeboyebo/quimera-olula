import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function TratosMkt({ idTrato, mkt }) {
  const [{ tratos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        mkt,
      },
    });
  }, [dispatch, mkt]);

  useEffect(() => {
    dispatch({
      type: "onIdTratosProp",
      payload: { id: idTrato ? parseInt(idTrato) : "" },
    });
  }, [dispatch, idTrato]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !tratos.current);
  const detalleVisible = !!tratos.current && tratos.current !== "nuevo";
  // const nuevoVisible = !!tratos.current && tratos.current === 'nuevo'

  return (
    <Quimera.Template id="TratosMkt">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="TratosMkt/MasterTratosMkt" />}
          {detalleVisible && (
            <Quimera.View
              id="Trato"
              idTrato={tratos.current}
              refreshCallback={() => dispatch({ type: "refreshTrato" })}
              deletedCallback={() => dispatch({ type: "deletedTrato" })}
            />
          )}
          {/* { nuevoVisible && <Quimera.SubView id='TratosMkt/NuevoUser' /> } */}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default TratosMkt;
