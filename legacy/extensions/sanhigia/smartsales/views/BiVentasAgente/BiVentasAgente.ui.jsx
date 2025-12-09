import { Box } from "@quimera/comps";
import { Plot } from "@quimera/thirdparty";
import Quimera, { navigate, useStateValue } from "quimera";

function BiVentasAgente() {
  const [{ data }] = useStateValue();

  return (
    <Quimera.Template id="BiVentasAgente">
      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
        <Box display="flex" flexDirection="column" w="1" h="1">
          {data?.VentasAgenteFamiliaBar ? (
            <Plot
              data={data.VentasAgenteFamiliaBar}
              layout={{
                barmode: "stack",
                paper_bgcolor: "rgba(0,0,0,0)",
                height: 700,
                // showlegend: false,
                legend: { orientation: "h" },
                xaxis: {
                  tickangle: -45,
                },
                margin: {
                  r: 0,
                  t: 0,
                  // b: 0,
                  l: 50,
                  pad: 0,
                },
              }}
              onClick={event => {
                const {
                  points: [{ customdata }],
                } = event;
                navigate(`/ss/bi/ventasagente/${customdata.group_id}/${customdata.stack_id}`);
              }}
            />
          ) : (
            ""
          )}

          {data?.VentasSubfamiliaTreemap ? (
            <Plot
              data={data.VentasSubfamiliaTreemap}
              layout={{
                paper_bgcolor: "rgba(0,0,0,0)",
                height: 700,
                margin: {
                  r: 0,
                  t: 0,
                  b: 0,
                  l: 0,
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
          intervals={["preMonth", "preYear", ["preNYears", 2], ["preNYears", 3], ["preNYears", 5]]}
          defaultInterval="preYear"
        />
      </Box>
    </Quimera.Template>
  );
}

export default BiVentasAgente;
