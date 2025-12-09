import { Box, Field, Paper, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useOnlineStatus, useStateValue } from "quimera";
import { useEffect } from "react";

function SeleccionPV({ useStyles }) {
  const [{ puntoVentaActual, puntosVenta }, dispatch] = useStateValue();
  const isOnline = useOnlineStatus();
  const classes = useStyles();

  useEffect(() => {
    isOnline &&
      dispatch({
        type: "getPuntosVenta",
      });
  }, [isOnline, dispatch]);

  return (
    <Quimera.Template id="SeleccionPV">
      <Box className={classes.centralBox}>
        <Paper className={classes.innerBox}>
          <div className={classes.titulo}>
            <Typography variant="h6">Seleccione el punto de venta actual</Typography>
          </div>
          <div className={classes.contenido}>
            <div>
              <Typography align="center">Código: {puntoVentaActual}</Typography>
              <Field.Select
                id="puntoVentaActual"
                options={puntosVenta.list.map(pv => ({
                  key: pv.puntoVenta,
                  value: pv.descripcion,
                  option: {
                    ...pv,
                    codigo: pv.puntoVenta,
                  },
                }))}
                disableClearable
                fullWidth
              />
            </div>
          </div>
        </Paper>
      </Box>
    </Quimera.Template>
  );
}

export default SeleccionPV;
