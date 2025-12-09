import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function ContactosMD({ codContacto }) {
  const [{ contactos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdContactosProp",
      payload: { id: codContacto ? codContacto : "" },
    });
  }, [dispatch, codContacto]);

  const callbackContactoChanged = useCallback(
    payload => dispatch({ type: "onContactosItemChanged", payload }),
    [dispatch],
  );

  // console.log("????????????", codCurso, cursos?.current);

  return (
    <Quimera.Template id="ContactosMD">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="ContactosMD/MasterContactosMD" codContacto={codContacto} />
        }
        DetailComponent={
          <Quimera.View
            id="ContactoMD"
            initContacto={contactos.dict[contactos.current]}
            callbackChanged={callbackContactoChanged}
          />
        }
        current={contactos.current}
      />
    </Quimera.Template>
  );
}

export default ContactosMD;
