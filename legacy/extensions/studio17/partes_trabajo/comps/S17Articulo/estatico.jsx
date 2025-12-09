import { Typography } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

function Estatico({ id, field, value, ...props }) {
  const [state, dispatch] = useStateValue();
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const stateField = field || id;
    const stateValue = value || value === "" ? value : util.getStateValue(stateField, state, value);
    API("articulos")
      .get()
      .select("referencia,descripcion")
      .filter(["referencia", "eq", stateValue])
      .success(response => setDescripcion(response.data[0]?.descripcion))
      .error(error => console.log("Error", error))
      .go();
  }, [id, field, value, state]);

  return <Typography variant="h5">{descripcion}</Typography>;
}

export default Estatico;
