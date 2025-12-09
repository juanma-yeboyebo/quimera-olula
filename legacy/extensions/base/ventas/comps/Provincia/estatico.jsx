import { Typography } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

function Estatico({ id, field, value, ...props }) {
  const [state, dispatch] = useStateValue();
  const [provincia, setProvincia] = useState("");

  useEffect(() => {
    const stateField = field || id;
    const stateValue = value || value === "" ? value : util.getStateValue(stateField, state, value);
    API("provincias")
      .get()
      .select("idprovincia,provincia")
      .filter(["idprovincia", "eq", stateValue])
      .success(response => setProvincia(response.data[0]?.provincia))
      .error(error => console.log("Error", error))
      .go();
  }, [id, field, value, state]);

  return <Typography variant="h5">{provincia}</Typography>;
}

export default Estatico;
