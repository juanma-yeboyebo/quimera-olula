import { QSection, Typography } from "@quimera/comps";
import { ModelContext } from "quimera";
import { useContext } from "react";

import { Cliente, DirCliente } from "../..";

function DocClienteYDir({ cliKeys = {
  codigo: "codCliente", 
  codDir: "codDir", 
  nombre: "nombreCliente"
}, ...props }) {
  const [{ disabled, model, modelName, schema }, _] = useContext(ModelContext);

  const dyn = () => (
    <>
      <Cliente id={`${modelName}.${cliKeys.codigo}`} label="Cliente" fullWidth async />
      <DirCliente
        id={`${modelName}.${cliKeys.codDir}`}
        codCliente={model[cliKeys.codigo]}
        label="Dirección"
        fullWidth
      />
    </>
  );

  return (
    <QSection
      title={`Cliente ${model[cliKeys.codigo] ?? ""}`}
      actionPrefix={modelName}
      alwaysInactive={disabled}
      dynamicComp={dyn}
      saveDisabled={() => !schema.isValid(model)}
    >
      <Typography variant="h5">{model[cliKeys.nombre]}</Typography>
    </QSection>
  );
}

export default DocClienteYDir;
