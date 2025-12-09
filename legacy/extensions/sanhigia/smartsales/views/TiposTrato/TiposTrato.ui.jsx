import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function TiposTrato({ idTipoTrato }) {
  const [{ tipostrato }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdTipostratoProp",
      payload: { id: idTipoTrato ? parseInt(idTipoTrato) : "" },
    });
  }, [dispatch, idTipoTrato]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !tipostrato.current);
  const detalleVisible = !!tipostrato.current && tipostrato.current !== "nuevo";
  const nuevoVisible = !!tipostrato.current && tipostrato.current === "nuevo";

  return (
    <Quimera.Template id="TiposTrato">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="TiposTrato/MasterTiposTrato" />}
          {detalleVisible && <Quimera.SubView id="TiposTrato/DetalleTiposTrato" />}
          {nuevoVisible && <Quimera.SubView id="TiposTrato/NuevoTipoTrato" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default TiposTrato;
