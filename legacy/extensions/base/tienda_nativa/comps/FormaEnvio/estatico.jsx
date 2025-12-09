import { Typography } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

function Estatico({ id, field, value, variant, ...props }) {
  const [state, dispatch] = useStateValue();
  const [descripcion, setDescripcion] = useState("");
  const tyVariant = variant || "h5";
  useEffect(() => {
    const stateField = field || id;
    const stateValue = value || value === "" ? value : util.getStateValue(stateField, state, value);

    API("to_formasenvio")
      .get()
      .select("codenvio,descripcion")
      .filter(["codenvio", "eq", stateValue])
      .success(response => setDescripcion(response.data[0]?.descripcion))
      .error(error => console.log("Error", error))
      .go();
  }, [id, field, value, state]);

  return <Typography variant={tyVariant}>{descripcion}</Typography>;
}

export default Estatico;
