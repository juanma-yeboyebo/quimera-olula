import { SelectorValores } from "@quimera-extension/base-almacen";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function TarifasAgencias({ codAgencia, codUbicacion = "", ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback(
    (text, key) => {
      const filtro = {
        and: [
          ["codagencia", "eq", codAgencia],
          ["obsoleta", "eq", "false"],
        ],
      };
      if (codAgencia) {
        API("sh_productosagtrans")
          .get()
          .select("codproductoagt,descripcion")
          .filter(filtro)
          // .filter(["codubicacion", "eq", key])
          .success(response => {
            setOptions(
              response.data.map(producto => {
                return {
                  key: producto.codproductoagt,
                  value: producto.descripcion,
                  option: producto,
                };
              }),
            );
          })
          .error(error => console.log("Error", error))
          .go();
      } else {
        setOptions([]);
      }
    },
    [codAgencia],
  );

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, [codAgencia]);

  return (
    <SelectorValores
      id={props.id}
      stateField={props.id}
      label="Tarifa"
      valores={options}
      value={props.codProductoAgt}
      arrayKeyValue
      variant={"outlined"}
      fullWidth
      desactivar={false}
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

export default TarifasAgencias;
