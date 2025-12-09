import { Box } from "@quimera/comps";
import { Plot } from "@quimera/thirdparty";
import Quimera, { navigate, useStateValue } from "quimera";

function BiVentasComunidad() {
  const [{ data }] = useStateValue();

  return (
    <Quimera.Template id="BiVentasComunidad">
      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
        <Box display="flex" flexDirection="column" w="1" h="1">
          {data?.VentasComunidadFamiliaBar ? (
            <Plot
              data={data.VentasComunidadFamiliaBar}
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
                navigate(`/ss/bi/ventascomunidad/${customdata.group_id}/${customdata.stack_id}`);
              }}
            />
          ) : (
            ""
          )}

          {data?.VentasGeoMap ? (
            <Plot
              data={data.VentasGeoMap}
              layout={{
                // autosize: true,
                hovermode: "closest",
                dragmode: "zoom",
                mapbox: {
                  bearing: 0,
                  center: {
                    lat: 40,
                    lon: -3.683,
                  },
                  domain: {
                    x: [0, 1],
                    y: [0, 1],
                  },
                  pitch: 0,
                  zoom: 4.9,
                  style: "open-street-map",
                },
                margin: {
                  r: 0,
                  t: 0,
                  b: 0,
                  l: 0,
                  pad: 0,
                },
              }}
              config={{
                // responsive: true,
                displaylogo: false,
                displayModeBar: false,
              }}
            // onRelayout={handleRelayout}
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

export default BiVentasComunidad;
