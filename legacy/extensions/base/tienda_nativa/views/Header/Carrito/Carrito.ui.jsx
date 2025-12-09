import { Box, Button, Icon, Typography } from "@quimera/comps";
import { useTheme } from "@quimera/styles";
import Quimera, { navigate, useAppValue, useWidth } from "quimera";

function Carrito({ onGoingToCheckout }) {
  const theme = useTheme();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const [{ carrito }, dispatch] = useAppValue();

  return (
    <Quimera.Template id="Carrito">
      <Box mx={1}>
        {carrito.lineas.map(linea => (
          <Box width={1}>
            <hr />
            <Box display="flex" justifyContent="flex-start">
              <Icon fontSize="large">shopping_cart</Icon>
              <Typography variant="body1">{`${linea.referencia} - ${linea.descripcion}, ${linea.pvpUnitario} x ${linea.cantidad}`}</Typography>
            </Box>
          </Box>
        ))}
        <Button
          variant="text"
          color="primary"
          text="Checkout"
          onClick={() => {
            onGoingToCheckout();
            navigate("/checkout");
          }}
        />
      </Box>
    </Quimera.Template>
  );
}

export default Carrito;
