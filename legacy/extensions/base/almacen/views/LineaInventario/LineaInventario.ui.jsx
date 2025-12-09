import {
  Box,
  Button,
  Collapse,
  Field,
  Grid,
  Icon,
  LinearProgress,
  QSection,
  QTitleBox,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

function LineaInventario({ callbackGuardada, disabled, lineaInicial, useStyles }) {
  const [{ linea, sections }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = getSchemas().lineasInventario;
  const { buffer } = linea;

  useEffect(() => {
    util.publishEvent(linea.event, callbackGuardada);
  }, [linea.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitLinea",
      payload: {
        initLinea: lineaInicial,
      },
    });
  }, [lineaInicial]);

  return (
    <Quimera.Template id="LineaInventario">
      {linea.buffer?._status === "deleting" && (
        <Box width={1}>
          <Typography variant="body2">Borrando línea...</Typography>
          <LinearProgress />
        </Box>
      )}
      <Collapse in={linea.buffer?._status !== "deleting"}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="right" mt={1}>
              {!disabled && (
                <Button
                  id="deleteLinea"
                  text="Borrar"
                  variant="outlined"
                  color="primary"
                  startIcon={<Icon>delete</Icon>}
                  onClick={() =>
                    dispatch({ type: "onDeleteLineaClicked", payload: { item: linea.buffer } })
                  }
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <QTitleBox titulo={`Producto ${buffer.referencia}`}>
              <Typography variant="h6">{buffer.desArticulo}</Typography>
            </QTitleBox>
          </Grid>

          <Grid item xs={12}>
            <QSection
              actionPrefix="linea/cantidad"
              alwaysInactive={disabled}
              dynamicComp={() => (
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Field.Schema id="linea.buffer/cantidad" schema={schema} fullWidth autoFocus />
                  </Grid>
                </Grid>
              )}
              saveDisabled={() => !schema.isValid(buffer)}
            >
              <Typography variant="h6" align="right">{`Cantidad ${util.formatter(
                buffer.cantidad,
                2,
              )}`}</Typography>
            </QSection>
          </Grid>
        </Grid>
      </Collapse>
    </Quimera.Template>
  );
}

export default LineaInventario;
