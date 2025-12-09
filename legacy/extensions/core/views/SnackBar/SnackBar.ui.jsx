import { Alert, Snackbar } from "@quimera/comps";
import Quimera, { useAppValue } from "quimera";
import React from "react";

function SnackBar() {
  const [{ mensaje, tipoMensaje }, appDispatch] = useAppValue();

  return (
    <Quimera.Template id="SnackBar">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={mensaje !== ""}
        onClose={(event, reason) =>
          appDispatch({ type: "onSnackbarAutoHide", payload: { event, reason } })
        }
        autoHideDuration={3000}
        style={{ zIndex: 9998 /* Para que si estamos en modal se muestre */ }}
      >
        {tipoMensaje ? (
          <Alert elevation={6} variant="filled" severity={tipoMensaje}>
            {mensaje}
          </Alert>
        ) : null}
      </Snackbar>
    </Quimera.Template>
  );
}

SnackBar.displayName = "SnackBar";
export default SnackBar;
