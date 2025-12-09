import { Typography } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

function Estatico({ id, field, value, variant = "h5", ...props }) {
  const [state, dispatch] = useStateValue();
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const stateField = field || id;
    const stateValue = value || value === "" ? value : util.getStateValue(stateField, state, value);
    API("subfamilias")
      .get()
      .select("codsubfamilia,descripcion")
      .filter(["codsubfamilia", "eq", stateValue])
      .success(response => setNombre(response.data[0]?.descripcion))
      .error(error => console.log("Error", error))
      .go();
  }, [id, field, value, state]);

  return <Typography variant={variant}>{nombre}</Typography>;
}

export default Estatico;
