import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function TratosPresupuesto({ idTrato, codCliente, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback(
    (text, key) => {
      const filtroBase = key
        ? ["idtrato", "eq", key]
        : {
          or: [
            ["idtrato", "like", text ?? ""],
            ["titulo", "like", text ?? ""],
          ],
        };

      API("ss_tratos")
        .get("-static-", "get_tratos_presupuesto_agente")
        .select("idtrato,titulo,nombre,fecha")
        .set("codcliente", codCliente)
        .filter(filtroBase)
        .success(response =>
          setOptions(
            response.data.map(trato => ({
              key: trato.idtrato,
              value: trato.titulo,
              option: trato,
            })),
          ),
        )
        .error(error => console.log("Error", error))
        .go();
    },
    [idTrato, codCliente],
  );

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, [idTrato, codCliente]);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Buscar trato..."
      {...props}
      async
    />
  );
}

export default TratosPresupuesto;
