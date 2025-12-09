import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function Consumidores({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const texto = text ?? "";

    const filtroBase = key
      ? ["idConsumidor", "eq", key]
      : {
        or: [
          ["nombre", "like", texto],
          ["apellidos", "like", texto],
          ["cifnif", "like", texto],
        ],
      };

    API("ca_consumidores")
      .get()
      .select("idconsumidor,nombre,apellidos,email,telefono,cifnif")
      .filter(filtroBase)
      .order("nombre ASC")
      .page({ limit: 100 })
      .success(response => {
        setOptions(
          response.data.map(consumidor => ({
            key: consumidor.idconsumidor,
            value: `${consumidor.nombre ?? ""} ${consumidor.apellidos ?? ""} ${consumidor.cifnif ? ` - ${consumidor.cifnif}` : ""
              }`,
            option: consumidor,
          })),
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
      noOptionsText="Indica nombre, apellidos o dni del cliente"
      {...props}
      async
    />
  );
}

export default Consumidores;
