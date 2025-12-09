import { QSection } from "@quimera/comps";
import Quimera from "quimera";
import React from "react";

import { ListItemLineaInventario } from "../../comps";

function LineaInventarioComp({ callbackChanged, disabled, key, linea, model, modelName, selected, variant = "form", ...props }) {
  const form = (
    <Quimera.View
      id="LineaInventario"
      idLinea={model.idLinea}
      lineaInicial={model}
      disabled={disabled}
      callbackGuardada={callbackChanged}
    />
  );

  const listItem = (
    <ListItemLineaInventario key={key} selected={selected} model={model} modelName={modelName} />
  );

  const section = (
    <QSection
      actionPrefix={modelName}
      readOnly
      mt={0}
      p={0}
      ensureVisible
      alwaysInactive={!selected}
      focusStyle="listItem"
      collapsible={true}
      dynamicComp={() => form}
    >
      {listItem}
    </QSection>
  );

  const variants = {
    form,
    listItem,
    section,
  };

  return variants[variant];
}

export default LineaInventarioComp;
