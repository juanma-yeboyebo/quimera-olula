import { Button } from "@quimera/comps";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@quimera/thirdparty";
// import { QFinca } from "@quimera-extension/base-almacen";
import { SelectorValores } from "@quimera-extension/base-almacen";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

function PuestoFirma({ desdeStocks, titulo, callbackCerrar, useStyles }) {
  const [{ puesto, puestosFirma }, dispatch] = useStateValue();
  const classes = useStyles();
  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: titulo ? titulo : "Puesto de firma" },
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
    <Quimera.Template id="PuestoFirma">
      <Dialog
        open={true}
        keepMounted
        onClose={() => dispatch({ type: "onCerrarPuestoFirmaConfirm", payload: {} })}
        classes={{ paper: classes.paper20Auto }}
      >
        <DialogTitle>Puesto de firma</DialogTitle>
        <DialogContent>
          {/* <QFinca id="codfinca" disableClearable boxStyle={classes.referencia} fullWidth /> */}
          <SelectorValores
            id="puesto"
            valores={puestosFirma}
            value={puesto}
            arrayKeyValue
            fullWidth
          ></SelectorValores>
        </DialogContent>
        <DialogActions>
          <Button
            id="puestoFirmaConfirm"
            text="Confirmar"
            color="primary"
            variant="contained"
            disabled={!puesto}
          />
        </DialogActions>
      </Dialog>
    </Quimera.Template>
  );
}

export default PuestoFirma;
