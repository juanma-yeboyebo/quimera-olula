import { QSection } from "@quimera/comps";
import { ModelContext } from "quimera";
import { useContext } from "react";

import { Agente } from "../..";

function DocAgente({ ...props }) {
  const [{ disabled, model, modelName, schema }, _] = useContext(ModelContext);

  return (
    <QSection
      title="Agente y comisión"
      actionPrefix={modelName}
      alwaysInactive={disabled}
      saveDisabled={() => !schema.isValid(model)}
      dynamicComp={() => <Agente id={`${modelName}.codAgente`} fullWidth autoFocus />}
    >
      <Agente id={`${modelName}.codAgente`} estatico />
    </QSection>
  );
}

export default DocAgente;
