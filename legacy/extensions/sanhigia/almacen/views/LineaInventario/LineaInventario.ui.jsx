import { Field, Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

function LineaInventario({
  callbackGuardada,
  callbackCambiada,
  callbackCerrarLinea,
  disabled,
  lineaInicial,
  useStyles,
}) {
  const [{ cambio, linea, tipoCambio, onSuccess }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = getSchemas().lineasInventario;
  const { buffer } = linea;
  const disabledCant = buffer.sh_estado === "Cerrada" ? true : false;
  // const disabledCant = false;

  useEffect(() => {
    // util.publishEvent(linea.event, callbackGuardada);
    util.publishEvent(linea.event, callbackCambiada);
  }, [linea.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitLinea",
      payload: {
        initLinea: lineaInicial,
      },
    });
  }, [lineaInicial]);

  const handleCerrarLinea = e => {
    dispatch({
      type: "onLineaSectionCancelled",
      payload: {
        section: "cantidad",
      },
    });
    callbackCerrarLinea();
  };

  return (
    <Quimera.Template id="LineaInventario">
      <Grid>
        <QSection
          title=" "
          actionPrefix="linea/cantidad"
          alwaysActive
          cancel={{
            callback: handleCerrarLinea,
          }}
          dynamicComp={() => (
            <Grid container direction="column" spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item xs={6}>
                <Field.Schema
                  label="Cantidad Inicial"
                  id="linea.buffer/cantidadIni"
                  schema={schema}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <Field.Schema
                  label="Cantidad Final"
                  id="linea.buffer/cantidad"
                  schema={schema}
                  fullWidth
                  autoFocus
                  onFocus={event => event.target.select()}
                  disabled={disabledCant}
                />
              </Grid>
            </Grid>
          )}
          saveDisabled={() => !schema.isValid(buffer)}
        ></QSection>
      </Grid>
    </Quimera.Template>
  );
}

export default LineaInventario;
