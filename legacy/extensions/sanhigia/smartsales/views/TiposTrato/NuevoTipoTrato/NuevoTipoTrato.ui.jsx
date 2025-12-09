import { Box, Button, Field, QBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth } from "quimera";

function NuevoTipoTrato() {
  const [{ tipostratoBuffer }] = useStateValue();
  const width = useWidth();
  const schemas = getSchemas();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="NuevoTipoTrato">
      {tipostratoBuffer && (
        <QBox
          width={anchoDetalle}
          titulo="Nuevo tipo de trato"
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <Box px={0} my={1}>
            <Field.Schema
              id="tipostratoBuffer.tipo"
              schema={schemas.tipotrato}
              fullWidth
              autoFocus
            />
          </Box>

          <Button id="guardarNuevoTipoTrato" text="Guardar" variant="contained" color="primary" />
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default NuevoTipoTrato;
