import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import schemas from "./schemas";

function Cliente({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const schema = schemas.clientes;
    const texto = text ?? "";

    API("clientes")
      .get()
      .select("codcliente,nombre,cifnif")
      .filter(key ? ["codcliente", "eq", key] : ["nombre", "like", texto])
      .order("nombre ASC")
      .page({ limit: 100 })
      .success(response => {
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(cliente => ({ key: cliente.codCliente, value: cliente.nombre, option: cliente })),
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
      noOptionsText="Indica el nombre del cliente"
      {...props}
      async
    />
  );
}

export default Cliente;
