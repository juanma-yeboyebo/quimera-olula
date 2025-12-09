import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function TratosFarma({ idTrato, mkt }) {
  const [{ tratosFarma }, dispatch] = useStateValue();

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
      type: "onIdTratosFarmaProp",
      payload: { id: idTrato ? parseInt(idTrato) : "" },
    });
  }, [dispatch, idTrato]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !tratosFarma.current);
  const detalleVisible = !!tratosFarma.current && tratosFarma.current !== "nuevo";
  // const nuevoVisible = !!tratosFarma.current && tratosFarma.current === 'nuevo'

  return (
    <Quimera.Template id="TratosFarma">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="TratosFarma/MasterTratosFarma" />}
          {detalleVisible && (
            <Quimera.View
              id="Trato"
              idTrato={tratosFarma.current}
              refreshCallback={() => dispatch({ type: "refreshTrato" })}
              deletedCallback={() => dispatch({ type: "deletedTrato" })}
            />
          )}
          {/* { nuevoVisible && <Quimera.SubView id='TratosFarma/NuevoUser' /> } */}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default TratosFarma;
