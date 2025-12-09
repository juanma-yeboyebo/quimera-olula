import { Field } from "@quimera/comps";
import { useStateValue } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

import schemas from "./schemas";

function Cliente({ filtros = [], ...props }) {
  const [options, setOptions] = useState([]);
  const [_, dispatch] = useStateValue();

  const onKeyDown = event => {
    if (event.key === "Tab" || event.key === 9) {
      console.log(options);
      if (options.length === 1) {
        dispatch({
          type: "onAlbaranBufferChanged",
          payload: {
            field: "codCliente",
            value: options[0].key,
            option: options[0].option,
          },
        });
      }
    }
  };

  const getOptions = useCallback((text, key) => {
    const schema = schemas.clientes;
    // const filtroBase = key ? [["codcliente", "eq", key]] : [["nombre", "like", text ?? ""]];

    // function construyeFiltro(filtroBasico, filtrosProp) {
    //   const clausulaBaja = filtrosProp?.incluir_baja ? [] : [["debaja", "eq", false]];

    //   return {
    //     and: [...filtroBasico, ...clausulaBaja],
    //   };
    // }

    API("clientes")
      .get()
      .select("codcliente,nombre,cifnif")
      .filter(
        key
          ? ["codcliente", "eq", key]
          : {
            or: [
              ["nombre", "like", text ?? ""],
              ["cifnif", "like", text ?? ""],
            ],
          },
      )
      .success(response => {
        console.log(response.data);
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(cliente => ({ key: cliente.codCliente, value: cliente.nombre, option: cliente })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);
  console.log(options);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Indica el nombre del cliente"
      onKeyDown={onKeyDown}
      {...props}
      async
    />
  );
}

export default Cliente;
