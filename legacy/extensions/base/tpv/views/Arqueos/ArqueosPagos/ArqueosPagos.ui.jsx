import { Box, Grid, Typography } from "@quimera/comps";
import { Avatar, List, ListItem, ListItemText } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, util } from "quimera";

function ArqueosPagos({ useStyles }) {
  const [{ pagos }, dispatch] = useStateValue();

  const classes = useStyles();

  const tiposPago = {
    estados: [
      { key: "CONT", value: "CONTADO" },
      { key: "TARJ", value: "TARJETA" },
    ],
  };

  return (
    <Quimera.Template id="ArqueosPagos">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          {pagos.idList.length > 0 ? (
            <List>
              {pagos.idList.map(pago => (
                <ListItem key={pago} className={classes.card} disableGutters>
                  <Avatar className={classes.avatar}>{pago}</Avatar>
                  <ListItemText
                    primary={
                      <Box width={1} display="flex" justifyContent="space-between">
                        <Box display="inline">
                          <Box display="inline">
                            {Object.entries(tiposPago.estados).map(valor => {
                              if (valor[1].key === pagos.dict[pago].codpago) {
                                return valor[1].value;
                              }
                            })}
                          </Box>
                        </Box>
                        <Box mr={1} display="inline">
                          {util.euros(pagos.dict[pago].importe)}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box
                        width={1}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {util.formatDate(pagos.dict[pago].fecha)}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No se ha realizado ningun pago</Typography>
          )}
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default ArqueosPagos;
