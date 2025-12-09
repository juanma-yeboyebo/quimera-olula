import { Field } from "@quimera/comps";
import {
  Button as ButtonMUI,
  Collapse,
  Dialog as DialogMUI,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@quimera/thirdparty";
import Quimera, { PropValidation, useAppValue, useStateValue } from "quimera";
import React from "react";

const TransitionConfirm = React.forwardRef(function Transition(props, ref) {
  return <Collapse ref={ref} timeout={1} {...props} />;
});

function Dialog() {
  const [{ confirmValue }] = useStateValue();
  const [appState, appDispatch] = useAppValue();

  return (
    <Quimera.Template id="Dialog">
      <DialogMUI
        open={appState.objetoConfirm !== null}
        TransitionComponent={TransitionConfirm}
        keepMounted
        onClose={() => appDispatch({ type: "onCerrarConfirm", payload: { por: "onclose" } })}
        style={{ zIndex: 9998 }}
      >
        <DialogTitle>{appState?.objetoConfirm?.titulo ?? ""}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {appState?.objetoConfirm?.cuerpo ?? ""}{" "}
            {appState?.objetoConfirm?.type === "text" ? <Field.Text id="confirmValue" /> : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonMUI
            onClick={() => appDispatch({ type: "onCerrarConfirm", payload: { por: "boton" } })}
            color="secondary"
            variant="text"
          >
            {appState?.objetoConfirm?.textoNo ?? "Cancelar"}
          </ButtonMUI>
          <ButtonMUI
            onClick={() =>
              appDispatch({ type: "onConfirmarConfirm", payload: { value: confirmValue } })
            }
            color="primary"
            variant="text"
          >
            {appState?.objetoConfirm?.textoSi ?? "Aceptar"}
          </ButtonMUI>
        </DialogActions>
      </DialogMUI>
    </Quimera.Template>
  );
}

export default Dialog;
