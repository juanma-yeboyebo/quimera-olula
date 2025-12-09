import { Box, Button, Field, QBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth } from "quimera";

import SelectGroup from "../../../comps/SelectGroup";

function NuevoUser() {
  const [{ usersBuffer }] = useStateValue();
  const width = useWidth();

  const schemas = getSchemas();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="NuevoUser">
      {usersBuffer && (
        <QBox
          width={anchoDetalle}
          titulo="Nuevo Usuario"
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <Box px={0} my={1}>
            <Field.Schema id="usersBuffer.id" schema={schemas.user} fullWidth autoFocus />
            <Field.Schema id="usersBuffer.nombre" schema={schemas.user} fullWidth />
            <Field.Schema id="usersBuffer.email" schema={schemas.user} fullWidth />
            <Field.Schema id="usersBuffer.password" schema={schemas.user} fullWidth />
          </Box>

          <SelectGroup
            id="usersBuffer.idgroup"
            field="nuevoUsersBufferIdgroup"
            value={usersBuffer?.idgroup ?? 0}
          />

          <Button id="guardarNuevoUsuario" text="Guardar" variant="contained" color="primary" />
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default NuevoUser;
