import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function Users({ idUser }) {
  const [{ users }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdUsersProp",
      payload: { id: idUser ?? "" },
    });
  }, [dispatch, idUser]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !users.current);
  const detalleVisible = !!users.current && users.current !== "nuevo";
  const nuevoVisible = !!users.current && users.current === "nuevo";

  return (
    <Quimera.Template id="Users">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="Users/MasterUsers" />}
          {detalleVisible && <Quimera.SubView id="Users/DetalleUsers" />}
          {nuevoVisible && <Quimera.SubView id="Users/NuevoUser" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Users;
