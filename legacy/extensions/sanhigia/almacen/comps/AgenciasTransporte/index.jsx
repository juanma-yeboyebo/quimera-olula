import { SelectorValores } from "@quimera-extension/base-almacen";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function AgenciasTransporte({ codUbicacion = "", ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback((text, key) => {
    API("sh_agenciastrans")
      .get()
      .select("codagencia,descripcion")
      .filter(key ? ["codagencia", "eq", key] : ["codagencia", "like", text])
      // .filter(["codubicacion", "eq", key])
      .success(response => {
        setOptions(
          response.data.map(agencia => ({
            key: agencia.codagencia,
            value: `${agencia.codagencia} ${agencia.codagencia !== agencia.descripcion ? `(${agencia.descripcion})` : ""
              }`,
            option: agencia,
          })),
          // response.data.map(agencia => (agencia.descripcion)),
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
    <SelectorValores
      id={props.id}
      stateField={props.id}
      label="Agencia transportes"
      valores={options}
      value={props.codAgencia}
      variant={"outlined"}
      fullWidth
      arrayKeyValue
      desactivar={true}
      {...props}
    ></SelectorValores>
    // <Field.Select
    //   getOptions={getOptions}
    //   options={options}
    //   noOptionsText="Indica el código de la agencia"
    //   {...props}
    //   async
    // />
  );
}

export default AgenciasTransporte;
