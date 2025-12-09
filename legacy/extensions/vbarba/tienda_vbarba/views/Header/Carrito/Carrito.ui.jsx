import { Totales } from "@quimera-extension/base-area_clientes";
import { ChipNoDisponible } from "@quimera-extension/vbarba-tienda_online";
import { Box, Button, Icon, Typography } from "@quimera/comps";
import { useTheme } from "@quimera/styles";
import { useTranslation } from "@quimera/thirdparty";
import Quimera, { navigate, useAppValue, useWidth, util } from "quimera";

import { noImage } from "../../../static/local";

function Carrito({ onGoingToCheckout }) {
  const theme = useTheme();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const [{ carrito }, dispatch] = useAppValue();
  const { t } = useTranslation();

  return (
    <Quimera.Template id="Carrito">
      <Box mx={1} mt={1} width={400}>
        {carrito.lineas.map(linea => (
          <Box width={1}>
            <Box display="flex" justifyContent="flex-start">
              <Box minWidth={100}>
                <img
                  src={linea.urlImagen}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = noImage || null;
                  }}
                  height={100}
                  alt={linea.descripcion}
                  loading="lazy"
                />
              </Box>
              <Box
                width={1}
                pl={1}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
              >
                <Typography variant="body1">{`${linea.referencia} - ${linea.descripcion}`}</Typography>
                <Box display="flex" alignItems="flex-start">
                  <Icon fontSize="small">open_in_full</Icon>
                  <Box pl={1}></Box>
                  <Typography component="span" variant="body1" color="textPrimary">
                    {`${linea.litraje || ""}`}
                  </Typography>
                  {!linea.disponible && (
                    <Box pl={1}>
                      <ChipNoDisponible />
                    </Box>
                  )}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">{`${linea.cantidad} x ${util.euros(
                    linea.pvpUnitario,
                  )}`}</Typography>
                  <Typography variant="h6">{`${util.euros(linea.pvpTotal)}`}</Typography>
                </Box>
              </Box>
            </Box>
            <hr />
          </Box>
        ))}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Totales
            totales={[
              { name: "Neto", value: carrito.neto },
              { name: "Total IVA", value: carrito.totalIva },
              { name: "Total", value: carrito.total },
            ]}
          />
          <Button
            variant="contained"
            color="primary"
            text={t("carrito.irACheckout")}
            onClick={() => {
              onGoingToCheckout();
              navigate("/checkout");
            }}
          />
          <Box mt={2} display="flex" flexDirection={"column"} style={{ gap: "10px" }}>
            <Typography variant="body2">{t("textoLegal.parrafo1")}</Typography>
            <Typography variant="body2">{t("textoLegal.parrafo2")}</Typography>
            <Typography variant="body2">{t("textoLegal.parrafo3")}</Typography>
          </Box>
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Carrito;
