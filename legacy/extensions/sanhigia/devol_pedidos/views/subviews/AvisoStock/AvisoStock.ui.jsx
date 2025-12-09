import { Box, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";

function AvisoStock({ useStyles }) {
  const [{ stock, linea }, dispatch] = useStateValue();
  const classes = useStyles();

  const stockInsuficiente =
    linea.buffer.referencia &&
    stock.disponible !== null &&
    stock.disponible < linea.buffer.cantidad;

  return (
    <Quimera.Template id="AvisoStock">
      {stockInsuficiente && (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body1"
            color="secondary"
          >{`Este artículo no tiene stock suficiente (${stock.disponible} < ${linea.buffer.cantidad})`}</Typography>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default AvisoStock;
