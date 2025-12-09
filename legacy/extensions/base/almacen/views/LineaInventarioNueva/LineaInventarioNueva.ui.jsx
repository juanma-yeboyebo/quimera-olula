import { Box, Collapse, Field, Grid, Icon, IconButton, QSection } from "@quimera/comps";
import { QArticulo } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useRef } from "react";

function LineaInventarioNueva({ callbackGuardada, codInventario, useStyles }) {
  const [{ inline, linea, focusArticulo }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = getSchemas().lineasInventario;
  const inputProducto = useRef(null);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idParentLinea: codInventario,
      },
    });
  }, [codInventario]);

  useEffect(() => {
    util.publishEvent(linea.event, callbackGuardada);
  }, [linea.event.serial]);

  useEffect(() => {
    inputProducto?.current && inputProducto.current.focus();
  }, [focusArticulo]);

  return (
    <Quimera.Template id="LineaInventarioNueva">
      {inline && (
        <Box width={1} display="flex" alignItems="flex-end">
          <QArticulo
            id="linea.buffer/referencia"
            label="Artículo"
            boxStyle={classes.referencia}
            fullWidth
            autoFocus
            inputRef={inputProducto}
          />
          <Field.Schema id="linea.buffer/cantidad" schema={schema} boxStyle={classes.cantidad} />
          <IconButton id="saveLinea" size="small" disabled={!schema.isValid(linea.buffer)}>
            <Icon color={schema.isValid(linea.buffer) ? "primary" : "disabled"} fontSize="large">
              save_alt
            </Icon>
          </IconButton>
        </Box>
      )}
      <Collapse in={!inline} mountOnEnter>
        <QSection
          title={`Nueva línea ${linea.desArticulo ?? ""}`}
          actionPrefix="lineaExpandida"
          alwaysActive
          dynamicComp={() => (
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <QArticulo
                  id="linea.buffer/referencia"
                  label="Artículo"
                  boxStyle={classes.referencia}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Field.Schema
                  id="linea.buffer/cantidad"
                  schema={schema}
                  fullWidth
                  inputProps={{ inputMode: "numeric" }}
                />
              </Grid>
            </Grid>
          )}
          saveDisabled={() => !schema.isValid(linea.buffer)}
        ></QSection>
      </Collapse>
    </Quimera.Template>
  );
}

export default LineaInventarioNueva;
