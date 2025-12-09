import { Box, Button, Field, QBox } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";

import schemas from "../../../static/schemas";

function NuevoGroup() {
  const [{ groupsBuffer }] = useStateValue();
  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="NuevoGroup">
      {groupsBuffer && (
        <QBox
          width={anchoDetalle}
          titulo="Nuevo Grupo"
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <Box px={0} my={1}>
            <Field.Schema id="groupsBuffer.id" schema={schemas.group} fullWidth autoFocus />
            <Field.Schema id="groupsBuffer.descripcion" schema={schemas.group} fullWidth />
          </Box>
          <Button id="guardarNuevoGrupo" text="Guardar" variant="contained" color="primary" />
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default NuevoGroup;
