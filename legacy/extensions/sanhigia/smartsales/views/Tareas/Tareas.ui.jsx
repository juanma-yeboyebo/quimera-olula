import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect, useState } from "react";

function Tareas({ idTarea }) {
  const [{ tareas }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdTareasProp",
      payload: { id: idTarea ? parseInt(idTarea) : "" },
    });
  }, [dispatch, idTarea]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !tareas.current);
  const detalleVisible = !!tareas.current && tareas.current !== "nuevo";
  // const nuevoVisible = !!tareas.current && tareas.current === 'nuevo'
  const [timer, setTimer] = useState();
  const handleRefreshTarea = () => {
    clearTimeout(timer);
    setTimer(setTimeout(() => dispatch({ type: "refreshTarea" }), 100));
  };

  return (
    <Quimera.Template id="Tareas">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="Tareas/MasterTareas" />}
          {detalleVisible && (
            <Quimera.View
              id="Tarea"
              idTarea={tareas?.current}
              desdeMasterTareas={true}
              // refreshCallback={payload => dispatch({ type: "refreshTarea", payload })}
              refreshCallback={handleRefreshTarea}
            />
          )}
          {/* { nuevoVisible && <Quimera.SubView id='Tareas/NuevoUser' /> } */}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Tareas;
