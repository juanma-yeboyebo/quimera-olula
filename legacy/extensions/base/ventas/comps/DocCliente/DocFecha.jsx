import { Box, Field, Icon, QSection, Typography } from "@quimera/comps";
import { ModelContext, util } from "quimera";
import { useContext } from "react";

function DocFecha({ fechaKey = "fecha", ...props }) {
  const [{ disabled, model, modelName, schema }, _] = useContext(ModelContext);

  return (
    <QSection
      title="Fecha"
      actionPrefix={modelName}
      alwaysInactive={disabled}
      dynamicComp={() => (
        <Field.Schema id={`${modelName}.fecha`} schema={schema} label="" fullWidth autoFocus />
      )}
      saveDisabled={() => !schema.isValid(model)}
    >
      <Box display="flex" alignItems="center">
        <Box mr={1}>
          <Icon color="action" fontSize="medium">
            event
          </Icon>
        </Box>
        <Typography variant="h5">{util.formatDate(model[fechaKey])}</Typography>
      </Box>
    </QSection>
  );
}

export default DocFecha;
