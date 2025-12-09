import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import { ListItemTemplateName } from "../../../comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

function TemplateNameMasterSubView({ templatePK }) {
  const [{ templateName }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewTemplateNameChanged = useCallback(
    payload => dispatch({ type: "onNewTemplateNameChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="TemplateNameMasterSubView">
      <Box width={anchoDetalle}>
        <QBox
          titulo={templatePK === "nuevo" ? "Nuevo templateName" : "TemplateName"}
          sideButtons={
            <>
              <QBoxButton id="nuevoTemplateName" title="Nuevo templateName" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          {/* {templatePK === "nuevo" && (
            <Quimera.View id="TemplateNameNuevo" callbackGuardado={callbackNewTemplateNameChanged} />
          )} */}
          <Quimera.SubView id="TemplateName/TemplateNameFiltro" />
          <QListModel
            data={templateName}
            modelName="templateName"
            ItemComponent={ListItemTemplateName}
            itemProps={{
              renderAvatar: () => (
                <Avatar>{templateName.dict[templatePK]?.nombreCliente?.charAt(0)}</Avatar>
              ),
            }}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default TemplateNameMasterSubView;
