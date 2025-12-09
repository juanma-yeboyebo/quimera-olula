import { Box, Grid, Icon, QBox, Typography } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import { Totales } from "@quimera-extension/base-area_clientes";
import { QSection } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";

import { ListItemLineaMisPedidos } from "../../../comps";

function MisPedidosDetalle({ useStyles }) {
  const [{ pedidos, lineas }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  return (
    <Quimera.Template id="Detalle">
      {pedidos.dict[pedidos.current] && (
        <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
          <QBox
            titulo={
              pedidos.dict[pedidos.current].referencia
                ? `Ref. ${pedidos.dict[pedidos.current].referencia}`
                : `Pedido ${pedidos.dict[pedidos.current].codigo}`
            }
            botonesCabecera={[{ id: "atras", icon: "arrow_back", disabled: false }]}
          >
            <Box px={0} my={1}>
              <Box width={1} border={0} borderColor="gray" height={"calc(100%)"}>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="inline">
                        <QSection title="Fecha de Pedido" actionPrefix="pedido" alwaysInactive>
                          <Box display="flex" alignItems="center">
                            <Icon color="action" fontSize="default" className={classes.leftIcon}>
                              event
                            </Icon>
                            <Typography variant="h5">
                              {util.formatDate(pedidos.dict[pedidos.current].fecha)}
                            </Typography>
                          </Box>
                        </QSection>

                        <QSection title="Fecha de Salida" actionPrefix="pedido" alwaysInactive>
                          <Box display="flex" alignItems="center">
                            <Icon color="action" fontSize="default" className={classes.leftIcon}>
                              event
                            </Icon>
                            <Typography variant="h5">
                              {util.formatDate(pedidos.dict[pedidos.current].fechaSalidaReal)}
                            </Typography>
                          </Box>
                        </QSection>
                      </Box>
                      <Box>
                        <QSection title="Estado del Pedido" actionPrefix="pedido" alwaysInactive>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h5">
                              {pedidos.dict[pedidos.current].estado}
                            </Typography>
                          </Box>
                        </QSection>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <QSection actionPrefix="totales" alwaysInactive>
                        <Totales
                          totales={[
                            { name: "Neto", value: pedidos.dict[pedidos.current].neto },
                            { name: "Total IVA", value: pedidos.dict[pedidos.current].totalIva },
                            { name: "Total", value: pedidos.dict[pedidos.current].total },
                          ]}
                        />
                      </QSection>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="overline">Líneas</Typography>
                      <List>
                        {lineas.idList?.map(idLinea => (
                          <ListItemLineaMisPedidos
                            key={idLinea}
                            divider
                            linea={lineas.dict[idLinea]}
                            funPrimaryRight={linea => `${linea.medida} cm`}
                          />
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </QBox>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default MisPedidosDetalle;
