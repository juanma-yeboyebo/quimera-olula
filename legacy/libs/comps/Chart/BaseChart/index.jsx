import { Chart, ChartAnnotation } from "@quimera/thirdparty";
import React, { useEffect, useRef, useState } from "react";

function BaseChart({ type = "bar", labels = [], data = [], title = "", color = "#771111", chartProps = {}, ...props }) {
  const chartRef = useRef(null);
  const [currentChart, setCurrentChart] = useState(null);

  function loadChart() {
    if (chartRef.current) {
      let myChart = currentChart;
      if (myChart !== null) {
        myChart.destroy();
      }
      chartProps.plugins = [ChartAnnotation];
      myChart = new Chart(chartRef.current, {
        type,
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: color,
            },
          ],
        },
        plugins: [ChartAnnotation],
        ...chartProps,
      });
      setCurrentChart(myChart);
    }
  }

  useEffect(() => {
    loadChart();
  }, [data, chartProps]);

  return (
    <div className="chart-container" style={{ height: "100%", width: "100%" }}>
      <canvas id="chart" ref={chartRef} {...props}>
        {"No se cargaron los datos"}
      </canvas>
    </div>
  );
}

export default BaseChart;
