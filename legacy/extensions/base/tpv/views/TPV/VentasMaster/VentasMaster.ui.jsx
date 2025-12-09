import { Box, Button, Grid, QBox, QSection, Typography } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";

import { ListItemVenta } from "../../../comps";
import { TpvDb } from "../../../lib";

function VentasMaster() {
  const [{ ventas, cargarCatalogoVisible, estadoBotonCarga }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const ultimaFechaCatalogo = TpvDb.leerUltimaFechaCatalogo();

  const botones = [
    {
      id: "nuevaVenta",
      icon: "add_circle",
      text: "Nueva venta",
    },
    {
      id: "cargarCatalogo",
      icon: "refresh",
      text: "Cargar Catalogo",
    },
  ];

  return (
    <Quimera.Template id="VentasMaster">
      <Box width={anchoDetalle}>
        <QBox titulo="Ventas" botones={botones}>
          {cargarCatalogoVisible && (
            <QSection
              title="Cargar Catalogo"
              actionPrefix="cargarCatalogo"
              readOnly
              alwaysActive
              focusStyle="button"
              dynamicComp={() => (
                <Grid container>
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h5">
                        Última carga: {util.relativeTime(ultimaFechaCatalogo ?? "")}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      {estadoBotonCarga ? (
                        <Box>
                          <Button
                            id="cargandoArticulos"
                            text="CARGANDO ..."
                            color="secondary"
                            variant="contained"
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Button
                            id="cargarArticulos"
                            text="CARGAR"
                            color="primary"
                            variant="contained"
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            ></QSection>
          )}
          <List>
            {ventas.idList
              .map(item => item)
              .reverse()
              .map(venta => (
                <ListItemVenta
                  key={venta}
                  selected={venta === ventas.current}
                  divider
                  venta={ventas.dict[venta]}
                  onClick={() =>
                    dispatch({ type: "onVentasClicked", payload: { item: ventas.dict[venta] } })
                  }
                />
              ))}
          </List>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default VentasMaster;
