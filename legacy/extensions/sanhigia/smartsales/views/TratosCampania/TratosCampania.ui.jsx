import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function TratosCampania({ idTrato, idCampania }) {
  const [{ tratosCampania }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idCampania: idCampania ? parseInt(idCampania) : "",
      },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdTratosCampaniaProp",
      payload: { id: idTrato ? parseInt(idTrato) : "" },
    });
  }, [dispatch, idTrato]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !tratosCampania.current);
  const detalleVisible = !!tratosCampania.current && tratosCampania.current !== "nuevo";
  // const nuevoVisible = !!tratosCampania.current && tratosCampania.current === 'nuevo'

  return (
    <Quimera.Template id="Tratos">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && (
            <Quimera.SubView id="TratosCampania/MasterTratosCampania" idCampania={idCampania} />
          )}
          {detalleVisible && (
            <Quimera.View
              id="TratoCampania"
              idTrato={tratosCampania.current}
              idCampania={idCampania}
              refreshCallback={() => dispatch({ type: "refreshTrato" })}
              deletedCallback={() => dispatch({ type: "deletedTrato" })}
            />
          )}
          {/* { nuevoVisible && <Quimera.SubView id='Tratos/NuevoUser' /> } */}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default TratosCampania;
