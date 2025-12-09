import { Button, Field, Grid, Icon, Paper, Typography } from "@quimera/comps";
import { clsx } from "@quimera/styles";
import Quimera, { getSchemas, PropValidation } from "quimera";

function AltaEmpresa({ useStyles }) {
  const classes = useStyles();
  const schema = getSchemas().nuevaEmpresa;

  return (
    <Quimera.Template id="AltaEmpresa">
      <Grid className={classes.root}>
        <Grid item xs={11} sm={8} md={4} lg={3} xl={2}>
          <Paper>
            <Grid container direction="column">
              <Grid item xs className={clsx(classes.gridItems, classes.header)}>
                <Typography className={classes.typography} variant="h6">
                  Alta de Empresa
                </Typography>
              </Grid>
              <Grid item xs className={classes.gridItems}>
                <Field.Schema
                  id="empresa.nombre"
                  schema={schema}
                  startAdornment={<Icon>location_city</Icon>}
                  autoFocus={true}
                  fullWidth
                />
              </Grid>
              <Grid item xs className={classes.gridItems}>
                <Field.Schema
                  id="empresa.email"
                  schema={schema}
                  startAdornment={<Icon>mail</Icon>}
                  fullWidth
                />
              </Grid>
              <Grid item xs className={classes.gridItems}>
                <Field.Schema
                  id="empresa.pass"
                  schema={schema}
                  startAdornment={<Icon>lockrounded</Icon>}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItems}>
                <Button
                  id="nuevaEmpresa"
                  text="CREAR CUENTA"
                  variant="text"
                  className={classes.nuevaEmpresaButton}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default AltaEmpresa;
