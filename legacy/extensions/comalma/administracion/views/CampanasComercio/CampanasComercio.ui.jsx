import { Box } from "@quimera/comps";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function CampanasComercio({ idComercio, useStyles }) {
  const [{ campanas }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idComercio: idComercio,
      },
    });
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch({
  //     type: "onIdComerciosProp",
  //     payload: { id: idComercio ? parseInt(idComercio) : "" },
  //   });
  // }, [idComercio]);


  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = true;
  const detalleVisible = true;

  return (
    <Quimera.Template id="CampanasComercio">
      {idComercio && (
        <Box mx={desktop ? 0.5 : 0}>
          <Box width={1} display="flex">
            {masterVisible && <Quimera.SubView id="CampanasComercio/CampanasComercioMaster" />}
            {detalleVisible && <Quimera.SubView id="CampanasComercio/CampanasComercioDetail" />}
          </Box>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default CampanasComercio;
