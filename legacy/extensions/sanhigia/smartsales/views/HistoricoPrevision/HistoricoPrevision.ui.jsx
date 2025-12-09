import { Plot } from "@quimera/thirdparty";
import Quimera, { useStateValue } from "quimera";
import { useEffect } from "react";

function HistoricoPrevision({ fechaInicio, fechaFin, codFamilia, codSubfamilia }) {
  const [{ dataHistoricoPrevision, layoutHistoricoPrevision }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { fechaInicio, fechaFin, codFamilia, codSubfamilia },
    });
  }, [dispatch, fechaInicio, fechaFin, codFamilia, codSubfamilia]);

  return (
    <Quimera.Template id="HistoricoPrevision">
      {dataHistoricoPrevision ? (
        <Plot
          data={dataHistoricoPrevision}
          layout={layoutHistoricoPrevision}
          config={{
            responsive: true,
            displaylogo: false,
            displayModeBar: false,
          }}
        />
      ) : null}
    </Quimera.Template>
  );
}

export default HistoricoPrevision;
