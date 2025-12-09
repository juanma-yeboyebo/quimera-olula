import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import schemas from "./schemas";

function Agente({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const schema = schemas.agentes;
    const texto = text ?? "";

    API("agentes")
      .get()
      .select("codagente,nombreap")
      .filter(key ? ["codagente", "eq", key] : ["nombreap", "like", texto])
      .order("nombreap ASC")
      .page({ limit: 100 })
      .success(response => {
        setOptions(
          response.data
            .map(a => schema.load(a))
            .map(agente => ({ key: agente.codAgente, value: agente.nombreap, option: agente })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, []);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Indica el nombre del agente"
      {...props}
      async
    />
  );
}

export default Agente;
