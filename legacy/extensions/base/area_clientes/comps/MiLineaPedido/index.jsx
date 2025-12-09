import { QSection } from "@quimera/comps";
import Quimera from "quimera";
import React from "react";

import { ListItemMiLineaPedido } from "../";

function MiLineaPedidoComp({ callbackChanged, disabled, key, linea, model, modelName, selected, variant = "form", ...props }) {
  const form = (
    <Quimera.View
      id="MiLineaPedido"
      idLinea={model.idLinea}
      lineaInicial={model}
      disabled={disabled}
      callbackGuardada={callbackChanged}
    />
  );

  const listItem = (
    <ListItemMiLineaPedido key={key} selected={false} model={model} modelName={modelName} />
  );

  const section = (
    <QSection
      actionPrefix={modelName}
      readOnly
      mt={0}
      p={0}
      ensureVisible
      alwaysInactive={true}
      focusStyle="listItem"
      collapsible={false}
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

export default MiLineaPedidoComp;
