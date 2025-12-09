import { Box, Field, Grid, Icon, IconButton, QBox, Typography } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { Direccion, ListItemLineaFactura, Totales } from "../../../comps";

function FacturaDetalle({ useStyles }) {
  const [{ facturas, lineas }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="FacturaDetalle">
      {facturas.dict[facturas.current] && (
        <QBox
          width={anchoDetalle}
          titulo={`Factura ${facturas.dict[facturas.current].codigo}`}
          botonesCabecera={
            <>
              <IconButton id="atras" color="white">
                <Icon className={classes.backIcon}>arrow_back</Icon>
              </IconButton>
            </>
          }
        >
          <Box px={1} my={1}>
            <Box width={1} border={0} borderColor="gray" height={"calc(100%)"}>
              <Box>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Field.Date
                      id={`facturas.dict.${facturas.current}.fecha`}
                      fullWidth
                      label="Fecha"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.cabecera}>
                    <Typography variant="h5">Dirección de Facturación</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Direccion documento={facturas.dict[facturas.current]} />
                  </Grid>

                  <Grid item xs={12} className={classes.cabecera}>
                    <Typography variant="h5">Líneas</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <List>
                      {lineas.idList?.map(idLinea => (
                        <ListItemLineaFactura key={idLinea} divider linea={lineas.dict[idLinea]} />
                      ))}
                    </List>
                  </Grid>

                  <Grid item xs={12} className={classes.cabecera}>
                    <Typography variant="h5">Totales</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Totales
                      totales={[
                        { name: "Neto", value: facturas.dict[facturas.current].neto },
                        { name: "Total IVA", value: facturas.dict[facturas.current].totalIva },
                        { name: "Total", value: facturas.dict[facturas.current].total },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default FacturaDetalle;
