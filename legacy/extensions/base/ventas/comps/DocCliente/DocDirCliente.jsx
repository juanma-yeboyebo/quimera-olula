import { QSection } from "@quimera/comps";
import { Direccion } from "@quimera-extension/base-area_clientes";
import Quimera, { ModelContext } from "quimera";
import { useContext } from "react";

function DocDirCliente({ ...props }) {
  const [{ disabled, model, modelName, schema }, _] = useContext(ModelContext);

  return (
    <QSection
      title="Dirección"
      actionPrefix={modelName}
      alwaysInactive={disabled}
      dynamicComp={() => <Quimera.SubView id="PedidosCli/DirCliente" modelName={modelName} />}
      saveDisabled={() => !schema.isValid(model)}
    >
      <Direccion documento={model} inline />
    </QSection>
  );
}

export default DocDirCliente;
