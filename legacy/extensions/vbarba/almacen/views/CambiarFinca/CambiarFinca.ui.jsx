import { Button } from "@quimera/comps";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@quimera/thirdparty";
// import { QFinca } from "@quimera-extension/base-almacen";
import { SelectorValores } from "@quimera-extension/base-almacen";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

function CambiarFinca({ desdeStocks, titulo, callbackCerrar, useStyles }) {
  const [{ modalCambiarFinca, codfinca, misFincas }, dispatch] = useStateValue();
  const classes = useStyles();
  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: titulo ? titulo : "Cambiar finca" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { callbackCerrar },
    });
  }, [dispatch]);

  return (
    <Quimera.Template id="CambiarFinca">
      <Dialog
        open={true}
        keepMounted
        onClose={() => dispatch({ type: "onCerrarCambiarFincaConfirm", payload: {} })}
        classes={{ paper: classes.paper20Auto }}
      >
        <DialogTitle>Cambiar finca</DialogTitle>
        <DialogContent>
          {/* <QFinca id="codfinca" disableClearable boxStyle={classes.referencia} fullWidth /> */}
          <SelectorValores
            id="codfinca"
            valores={misFincas}
            value={codfinca}
            arrayKeyValue
            fullWidth
          ></SelectorValores>
        </DialogContent>
        <DialogActions>
          <Button
            id="cambiarFincaConfirm"
            text="Confirmar"
            color="primary"
            variant="contained"
            disabled={!codfinca}
          />
        </DialogActions>
      </Dialog>
    </Quimera.Template>
  );
}

export default CambiarFinca;
