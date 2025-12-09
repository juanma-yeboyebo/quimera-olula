import { QSection } from "@quimera/comps";
import Quimera from "quimera";
import React from "react";

import { ListItemLineaParte } from "../../comps";

function s17LineaParteComp({ callbackChanged, disabled, linea, model, modelName, selected, variant = "form", ...props }) {
  const form = (
    <Quimera.View
      id="s17LineaParte"
      idLinea={model.idLinea}
      lineaInicial={model}
      disabled={disabled}
      callbackGuardada={callbackChanged}
    />
  );
  const listItem = <ListItemLineaParte selected={selected} model={model} modelName={modelName} />;

  const section = (
    <QSection
      actionPrefix={modelName}
      readOnly
      mt={0}
      p={0}
      ensureVisible
      alwaysInactive={!selected || disabled}
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

export default s17LineaParteComp;
