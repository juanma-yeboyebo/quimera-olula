import { QSection } from "@quimera/comps";
import Quimera from "quimera";
import React from "react";

import { ListItemLinea } from "..";

function LineaAlbaranCliComp({ callbackChanged, disabled, linea, model, modelName, selected, variant = "form", ...props }) {
  const form = (
    <Quimera.View
      key={model.idLinea}
      id="LineaAlbaranCli"
      idLinea={model.idLinea}
      lineaInicial={model}
      disabled={disabled}
      callbackGuardada={callbackChanged}
    />
  );

  const listItem = <ListItemLinea selected={selected} model={model} modelName={modelName} />;

  const section = (
    <QSection
      key={model.idLinea}
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

export default LineaAlbaranCliComp;
