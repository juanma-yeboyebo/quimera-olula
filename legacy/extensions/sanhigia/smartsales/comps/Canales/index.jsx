import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useEffect, useState } from "react";

function Canales({ ...props }) {
  const [options, setOptions] = useState([]);

  function getOptions() {
    API("ss_canales")
      .get()
      .select("codcanal,nombre")
      // .filter({ and: [["codcliente", "like", `${codcliente}`]] })
      .filter(["1", "eq", "1"])
      .page({ limit: 500 })
      .order("codcanal")
      .success(response => {
        setOptions(
          response.data.map(canal => {
            return {
              key: canal.codcanal,
              value: `${canal.nombre ? canal.nombre : ""}`,
            };
          }),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, []);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      // noOptionsText={noOptionsText}
      async
      {...props}
    />
  );
}

export default Canales;
