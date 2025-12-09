// import { useEffect } from 'react'
import { Box, Button } from "@quimera/comps";
import { Plot } from "@quimera/thirdparty";
import Quimera, { navigate, useStateValue } from "quimera";

function BiDetalleVentasComunidad({ comunidad, codFamilia }) {
  const [{ data, poblaciones, offset, limit }] = useStateValue();

  return (
    <Quimera.Template id="BiDetalleVentasComunidad">
      <Button id="backToDashboard" onClick={() => navigate("/ss/bi")}>
        Volver
      </Button>
      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
        <Box display="flex" flexDirection="column" w="1" h="1">
          {Object.entries(data ?? {}).map(([poblacion, dataGrafPoblacion]) => (
            <div key={poblacion.slice(2)}>
              <h1>{poblacion.slice(2)}</h1>
              <Plot
                data={dataGrafPoblacion}
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
            </div>
          )) ?? ""}

          {data && Object.keys(data).length ? (
            <Button
              id="nextOffset"
              variant="contained"
              color="primary"
              disabled={offset + limit >= poblaciones.VentasPorPoblacion.length}
              style={{
                marginTop: "20px",
                alignSelf: "center",
              }}
            >
              Cargar más
            </Button>
          ) : (
            ""
          )}
        </Box>

        <Quimera.SubView
          id="BiDashboard/BiFiltros"
          intervals={["preYear", ["preNYears", 2], ["preNYears", 3], ["preNYears", 5]]}
          defaultInterval="preYear"
          comunidad={comunidad}
          codFamilia={codFamilia}
        />
      </Box>
    </Quimera.Template>
  );
}

export default BiDetalleVentasComunidad;
