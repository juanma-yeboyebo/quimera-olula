import { Button, Dialog, Icon } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useEffect } from "react";

import PresupuestosCliNuevoNoRegistrado from "../subviews/PresupuestosCliNuevoNoRegistrado/PresupuestosCliNuevoNoRegistrado.ui";

function PresupuestoCliNuevo({
  callbackGuardado,
  idTratoProp,
  codAgenteProp,
  codAgenteMktProp,
  useStyles,
  ...props
}) {
  const [
    { modalNuevoTratoVisible, presupuesto, presupuestoNoRegistrado, isRegistrado, tratosAgente },
    dispatch,
  ] = useStateValue();

  //const schema = isRegistrado ? getSchemas().presupuestoCliNuevo : getSchemas().presupuestoCliNuevoNoRegistrado;

  //console.log('mimensaje_schema', schema);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackPresupuestoChanged: callbackGuardado,
        idTratoProp,
        codAgenteProp,
        codAgenteMktProp,
        ...props,
      },
    });
  }, [callbackGuardado]);

  // useEffect(() => {
  //   util.publishEvent(presupuesto.event, callbackGuardado);
  // }, [presupuesto.event.serial]);

  //console.log('mimensaje_presupuesto', presupuesto);
  // console.log("mimensaje_isRegistrado", isRegistrado);

  const miForm = isRegistrado ? (
    <Quimera.SubView
      id="PresupuestosCliNuevo/PresupuestosCliNuevoRegistrado"
      callback={callbackGuardado}
      presupuesto={presupuesto}
      tratosAgente={tratosAgente}
    />
  ) : (
    <PresupuestosCliNuevoNoRegistrado
      callback={callbackGuardado}
      presupuesto={presupuestoNoRegistrado}
      tratosAgente={tratosAgente}
    />
  );

  // console.log("mimensaje_isRegistradoForm", miForm);

  return (
    <Quimera.Template id="PresupuestoCliNuevo">
      <Button
        id="setRegistrado"
        variant="text"
        color={isRegistrado ? "primary" : "secondary"}
        text={isRegistrado ? "Cliente registrado" : "Cliente no registrado"}
        startIcon={<Icon>{isRegistrado ? "lockrounded" : "lock_open"}</Icon>}
        onClick={() => {
          dispatch({
            type: "setRegistrado",
          });
        }}
      />
      {miForm}

      <Dialog
        open={modalNuevoTratoVisible}
        fullWidth
        maxWidth="xs"
      // fullScreen={width === "xs" || width === "sm"}
      >
        <Quimera.View
          id="NuevoTrato"
          callbackCerrado={payload => dispatch({ type: "onCerrarCrearTrato", payload })}
          codCliente={presupuesto.buffer.codCliente}
        />
      </Dialog>
    </Quimera.Template>
  );
}

export default PresupuestoCliNuevo;
