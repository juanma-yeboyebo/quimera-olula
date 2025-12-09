import { QArticulo } from "@quimera-extension/base-almacen";
import { Box, Collapse, Field, Grid, Icon, IconButton, QSection, Typography } from "@quimera/comps";
import Quimera, { getSchemas, useStateValue, util } from "quimera";
import { useEffect } from "react";

function LineaPedidoCliNueva({ callbackGuardada, idPedido, useStyles }) {
  const [{ inline, linea }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = getSchemas().lineasPedidosCli;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idParentLinea: idPedido,
      },
    });
  }, [idPedido]);

  useEffect(() => {
    util.publishEvent(linea.event, callbackGuardada);
  }, [linea.event.serial]);

  return (
    <Quimera.Template id="LineaPedidoCliNueva">
      {inline && (
        <Box>
          <Box width={1} display="flex" alignItems="flex-end">
            <QArticulo
              id="linea.buffer/referencia"
              label="Artículo"
              boxStyle={classes.referencia}
              seVende
              fullWidth
              autoFocus
            />
            <Field.Schema id="linea.buffer/cantidad" schema={schema} boxStyle={classes.cantidad} />
            <Box>
              <IconButton id="saveLinea" size="small" disabled={!schema.isValid(linea.buffer)}>
                <Icon fontSize="large">save_alt</Icon>
              </IconButton>
            </Box>
            <IconButton id="expandir" size="small">
              <Icon color="secondary" fontSize="large">
                expand
              </Icon>
            </IconButton>
          </Box>
          <Quimera.Block id="afterDescripcion" />
        </Box>
      )}
      <Collapse in={!inline} mountOnEnter>
        <QSection
          title={`Nueva línea ${linea.descripcion ?? ""}`}
          actionPrefix="lineaExpandida"
          alwaysActive
          dynamicComp={() => (
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <QArticulo
                  id="linea.buffer/referencia"
                  label="Artículo"
                  boxStyle={classes.referencia}
                  seVende
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Field.Schema id="linea.buffer/cantidad" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Field.Schema id="linea.buffer/descripcion" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Quimera.Block id="afterDescripcion" />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/codImpuesto" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/iva" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/recargo" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/irpf" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/pvpUnitario" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/pvpSinDto" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/dtoLineal" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema id="linea.buffer/dtoPor" schema={schema} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Box width={1} display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="overline">Total</Typography>
                  <Typography variant="h5">{util.euros(linea.buffer.pvpTotal)}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
          saveDisabled={() => !schema.isValid(linea.buffer)}
        ></QSection>
      </Collapse>
    </Quimera.Template>
  );
}

export default LineaPedidoCliNueva;
