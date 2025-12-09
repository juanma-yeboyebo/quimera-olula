import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function Agente({ id, estatico, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("agentes")
      .get()
      .set("todoslosagentes", props.todoslosagentes)
      .select("codagente,nombreap")
      .filter(["1", "eq", "1"])
      .success(response =>
        setOptions(
          response.data.map(agente => {
            return {
              key: agente.codagente,
              value: agente.nombreap,
              option: agente,
            };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .page({
        limit: 10000,
      })
      .go();
  }, []);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return estatico ? (
    <Estatico id={id} {...props} />
  ) : (
    <Field.Select
      id={id}
      options={options}
      {...props}
      noOptionsText="Indica el nombre del agente"
    />
  );
}

export default Agente;
