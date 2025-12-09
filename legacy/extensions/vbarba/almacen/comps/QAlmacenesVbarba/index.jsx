import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function QAlmacenesVbarba({ codFinca, noOptionsText = "Buscar almacen por nombre", seVende = false, codFamilia = null, ...props }) {
  const [options, setOptions] = useState([]);

  const getFiltroOptions = () => {
    const options = [];
    if (codFinca) {
      options.push(["codfinca", "eq", codFinca]);
    }

    return options.length > 0 ? options : null;
  };

  const getOptions = useCallback(
    (text, key) => {
      const filtroBase = key
        ? ["codalmacen", "eq", key]
        : {
          or: [
            ["codalmacen", "like", text],
            ["nombre", "like", text],
          ],
        };
      const filtroOptions = getFiltroOptions(codFinca);
      filtroOptions && filtroOptions.push(filtroBase);
      const filtro = filtroOptions
        ? {
          and: filtroOptions,
        }
        : filtroBase;
      if ((text !== null && text !== undefined) || (key !== null && key !== undefined)) {
        API("almacenes")
          .get()
          .select("codalmacen,nombre,codfinca")
          .filter(filtro)
          .page({ limit: 100 })
          .success(response =>
            setOptions(
              response.data.map(almacen => {
                const pvp = util.euros(almacen.precioRef);

                return {
                  key: almacen.codalmacen,
                  value: `${almacen.nombre} (${almacen.codalmacen})`,
                  option: almacen,
                };
              }),
            ),
          )
          .error(error => console.log("Error", error))
          .go();
      }
    },
    [codFinca],
  );

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, []);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText={noOptionsText}
      async
      {...props}
    />
  );
}

export default QAlmacenesVbarba;
