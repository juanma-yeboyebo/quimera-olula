import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function Groups({ idGroup }) {
  const [{ groups }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch({
  //     type: "onIdGroupsProp",
  //     payload: { id: idGroup ?? "" },
  //   });
  // }, [dispatch, idGroup]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !groups.current);
  const detalleVisible = !!groups.current && groups.current !== "nuevo";
  const nuevoVisible = !!groups.current && groups.current === "nuevo";

  return (
    <Quimera.Template id="Groups">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="Groups/MasterGroups" />}
          {detalleVisible && <Quimera.SubView id="Groups/DetalleGroups" />}
          {nuevoVisible && <Quimera.SubView id="Groups/NuevoGroup" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Groups;
