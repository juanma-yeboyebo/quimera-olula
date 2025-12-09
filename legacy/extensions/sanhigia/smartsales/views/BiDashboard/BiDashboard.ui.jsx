import { Tab, TabWidget } from "@quimera/comps";
import Quimera, { PropValidation } from "quimera";

function BiDashboard() {
  return (
    <Quimera.Template id="BiDashboard">
      <TabWidget>
        <Tab title="Ventas por agente" style={{ width: "100%" }}>
          <Quimera.View id="BiVentasAgente" />
        </Tab>
        <Tab title="Ventas por comunidad" style={{ width: "100%" }}>
          <Quimera.View id="BiVentasComunidad" />
        </Tab>
        <Tab title="Segmentos" style={{ width: "100%" }}>
          <Quimera.View id="BiSegmentos" />
        </Tab>
        <Tab title="Árbol recomendaciones" style={{ width: "100%" }}>
          <Quimera.View id="BiRecomendaciones" />
        </Tab>
      </TabWidget>
    </Quimera.Template>
  );
}

export default BiDashboard;
