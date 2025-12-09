import { Box, Field, Grid, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, util } from "quimera";

function ordenar(a, b) {
  if (parseFloat(a.replace("_", ".")) > parseFloat(b.replace("_", "."))) {
    return 1;
  }
  if (parseFloat(a.replace("_", ".")) < parseFloat(b.replace("_", "."))) {
    return -1;
  }

  return 0;
}

function ArqueosCaja({ useStyles }) {
  const [{ arqueosBuffer, monedasBuffer, billetesBuffer }, dispatch] = useStateValue();

  const classes = useStyles();

  return (
    <Quimera.Template id="ArqueosCaja">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Grid container spacing={0}>
            {billetesBuffer &&
              Object.keys(billetesBuffer).map(item => (
                <Grid item xs={3} key={item}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {/* <Typography>Billete {item}€ &nbsp;</Typography> */}
                    <Typography>
                      <img src={`/img/${item}.jpg`} alt={util.euros(item)} width="100" />
                    </Typography>
                    <Field.Int
                      id={`billetesBuffer/${item}`}
                      className={classes.field}
                      disabled={!arqueosBuffer.abierta}
                      naked
                    />
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={0}>
            {monedasBuffer &&
              Object.keys(monedasBuffer)
                .sort(ordenar)
                .map(item => (
                  <Grid item xs={3} key={item}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* <Typography>Moneda {item} { item >= 1  ? '€' : 'cent'} &nbsp;</Typography> */}
                      <Typography>
                        <img src={`/img/${item}.png`} alt={item >= 1 ? "€" : "cent"} width="50" />
                      </Typography>
                      <Field.Int
                        id={`monedasBuffer/${item}`}
                        className={classes.field}
                        disabled={!arqueosBuffer.abierta}
                      />
                    </Box>
                  </Grid>
                ))}
          </Grid>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default ArqueosCaja;
