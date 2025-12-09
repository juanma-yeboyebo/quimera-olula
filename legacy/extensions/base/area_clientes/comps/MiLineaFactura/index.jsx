import { QSection } from "@quimera/comps";
import Quimera from "quimera";
import React from "react";

import { ListItemMiLineaFactura } from "..";

function MiLineaFacturaComp({ callbackChanged, disabled, linea, model, modelName, selected, variant = "form", ...props }) {
  const form = (
    <Quimera.View
      key={model.idLinea}
      id="LineaFacturaCli"
      idLinea={model.idLinea}
      lineaInicial={model}
      disabled={disabled}
      callbackGuardada={callbackChanged}
    />
  );

  const listItem = <ListItemMiLineaFactura selected={false} model={model} modelName={modelName} />;

  const section = (
    <QSection
      key={model.idLinea}
      actionPrefix={modelName}
      readOnly
      mt={0}
      p={0}
      ensureVisible
      alwaysInactive={true}
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

export default MiLineaFacturaComp;
