import { Typography } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

function Estatico({ id, field, value, ...props }) {
  const [state, dispatch] = useStateValue();
  const [nombre, setNombre] = useState("");
  const variant = props.variant ?? "h5";

  useEffect(() => {
    const stateField = field || id;
    const stateValue = value || value === "" ? value : util.getStateValue(stateField, state, value);

    API("clientes")
      // .get("-static-", "getAgenteByPk")
      .get()
      .set("todoslosagentes", props.todoslosagentes)
      .select("codcliente,nombre,cifnif")
      .filter(["codcliente", "eq", stateValue])
      .success(response => setNombre(response.data[0]?.nombre))
      .error(error => console.log("Error", error))
      .go();
  }, [id, field, value, state]);

  return <Typography variant={variant}>{nombre ? nombre : "Sin cliente asociado"}</Typography>;
}

export default Estatico;
