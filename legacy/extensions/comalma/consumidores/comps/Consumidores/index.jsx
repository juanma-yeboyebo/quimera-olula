import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function Consumidores({ idConsumidor, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback(
    (text, key) => {
      let filtro = {}
      if (idConsumidor) {
        filtro = {
          and: [["idConsumidor", "eq", idConsumidor]],
        };
      }

      API("ca_consumidores")
        .get()
        .select("nombre,apellidos")
        .filter(filtro)
        // .filter(["codubicacion", "eq", key])
        .success(response => {
          setOptions(
            response.data.map(consumidor => {
              return {
                key: consumidor.idconsumidor,
                value: consumidor.nombre,
                option: consumidor,
              };
            }),
          );
        })
        .error(error => console.log("Error", error))
        .go();

    },
    [idConsumidor],
  );

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, [idConsumidor]);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Busca por nombre o DNI"
      {...props}
      async
    />
  );
}

export default Consumidores;
