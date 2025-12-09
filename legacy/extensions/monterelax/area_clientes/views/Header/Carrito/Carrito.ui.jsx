import { Box, Button, Icon, Typography } from "@quimera/comps";
import { useTheme } from "@quimera/styles";
import Quimera, { navigate, useAppValue, useWidth, util } from "quimera";

function Carrito({ onGoingToCheckout }) {
  const theme = useTheme();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const [{ carrito }, dispatch] = useAppValue();

  const total = carrito.lineas.reduce((acc, linea) => {
    return acc + linea.pvpTotal;
  }, 0);

  return (
    <Quimera.Template id="Carrito">
      <Box mx={1}>
        {carrito.lineas.map(linea => (
          <Box width={1}>
            <hr />
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
              style={{ gap: "1rem" }}
            >
              <Box>
                <Icon fontSize="large">weekend</Icon>
              </Box>
              <Box flexGrow={1}>
                <Box>
                  <Typography variant="body1">
                    Modelo: <b>{linea.idModelo}</b>, Tela: <b>{linea.idTela}</b>
                  </Typography>
                  {linea.config.map(conf => (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      style={{
                        gap: "1rem",
                        marginTop: "0.3rem",
                      }}
                    >
                      <Typography variant="body1">{`${conf.desc}`}</Typography>
                      <Typography variant="body1">{`${util.euros(conf.pvp)}`}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        <hr />
        <Box mt={1}>
          <Typography align="right" variant="body1">
            TOTAL: <b>{`${util.euros(total)}`}</b>
          </Typography>
        </Box>
        <Button
          variant="text"
          color="primary"
          text="Finalizar pedido"
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
