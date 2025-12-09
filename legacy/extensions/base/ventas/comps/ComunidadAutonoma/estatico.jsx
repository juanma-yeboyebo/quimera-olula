import { Typography } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

function Estatico({ id, field, value, ...props }) {
  const [state] = useStateValue();
  const [comunidad, setComunidad] = useState("");

  useEffect(() => {
    const stateField = field || id;
    const stateValue = value || value === "" ? value : util.getStateValue(stateField, state, value);
    API("comunidadesautonomas")
      .get()
      .select("id,nombre,codcomunidad")
      .filter(["id", "eq", stateValue])
      .success(response => setComunidad(response.data[0]?.nombre))
      .error(error => console.log("Error", error))
      .go();
  }, [id, field, value, state]);

  return <Typography variant="h5">{comunidad}</Typography>;
}

export default Estatico;
