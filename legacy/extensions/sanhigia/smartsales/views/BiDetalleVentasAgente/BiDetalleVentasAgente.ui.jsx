import { Box, Button } from "@quimera/comps";
import { Plot } from "@quimera/thirdparty";
import Quimera, { navigate, useStateValue } from "quimera";
import { useEffect } from "react";

function BiDetalleVentasAgente({ codAgente, codFamilia }) {
  const [{ data }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  return (
    <Quimera.Template id="BiDetalleVentasAgente">
      <Button id="backToDashboard" onClick={() => navigate("/ss/bi")}>
        Volver
      </Button>
      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
        <Box display="flex" flexDirection="column" w="1" h="1">
          {data?.VentasAnyoSubfamilia ? (
            <Plot
              data={data.VentasAnyoSubfamilia}
              layout={{
                xaxis: {
                  tickangle: -45,
                  type: "category",
                },
                yaxis: {
                  type: "linear",
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                height: 450,
                // showlegend: false,
                margin: {
                  r: 0,
                  t: 0,
                  b: 150,
                  l: 50,
                  pad: 0,
                },
              }}
            />
          ) : (
            ""
          )}
        </Box>

        <Quimera.SubView
          id="BiDashboard/BiFiltros"
          intervals={["preYear", ["preNYears", 2], ["preNYears", 3], ["preNYears", 5]]}
          defaultInterval="preYear"
          codAgente={codAgente}
          codFamilia={codFamilia}
        />
      </Box>
    </Quimera.Template>
  );
}

export default BiDetalleVentasAgente;
