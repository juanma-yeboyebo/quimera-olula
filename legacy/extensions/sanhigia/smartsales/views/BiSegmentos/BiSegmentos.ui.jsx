import { Box, Field } from "@quimera/comps";
import { Plot } from "@quimera/thirdparty";
import Quimera, { useStateValue } from "quimera";

function BiSegmentos() {
  const [{ data }] = useStateValue();

  return (
    <Quimera.Template id="BiSegmentos">
      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
        {data?.SegmentosGeoMap ? (
          <Plot
            data={data.SegmentosGeoMap}
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

        <Box>
          <Field.RealSelect
            id="cluster"
            label="Tipo de cluster"
            options={[
              { key: "cluster_fam", value: "Por familias" },
              { key: "cluster_subfam", value: "Por subfamilias" },
              { key: "cluster_art", value: "Por artículos" },
              { key: "cluster_cp", value: "Por criterios socioeconómicos" },
              { key: "cluster_cpyv", value: "Por todos los criterios" },
            ]}
          />
          <Quimera.SubView
            id="BiDashboard/BiFiltros"
            intervals={[
              "preMonth",
              "preYear",
              ["preNYears", 2],
              ["preNYears", 3],
              ["preNYears", 5],
            ]}
            defaultInterval="preYear"
          />
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default BiSegmentos;
