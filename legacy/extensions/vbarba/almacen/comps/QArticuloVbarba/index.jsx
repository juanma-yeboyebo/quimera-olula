import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

function QArticuloVbarba({ seVende = false, codFamilia = null, noOptionsText = "Buscar artículo por nombre", ...props }) {
  const [options, setOptions] = useState([]);

  const getFiltroOptions = (seVende, codFamilia) => {
    const options = [];
    if (seVende) {
      options.push(["sevende", "eq", true]);
    }
    if (codFamilia) {
      options.push(["codfamilia", "eq", codFamilia]);
    }

    return options.length > 0 ? options : null;
  };

  const getOptions = useCallback(
    (text, key) => {
      const filtroBase = key
        ? ["referencia", "eq", key]
        : {
          or: [
            ["descripcion", "like", text],
            ["referencia", "like", text],
            ["codbarras", "like", text],
          ],
        };
      const filtroOptions = getFiltroOptions(seVende, codFamilia);
      filtroOptions && filtroOptions.push(filtroBase);
      const filtro = filtroOptions
        ? {
          and: filtroOptions,
        }
        : filtroBase;
      if (text !== null || key !== null) {
        API("articulos")
          .get()
          .select("referencia,codbarras,descripcion,precioRef")
          .filter(filtro)
          .page({ limit: 100 })
          .success(response =>
            setOptions(
              response.data.map(articulo => {
                const pvp = util.euros(articulo.precioRef);

                return {
                  key: articulo.referencia,
                  value: `${pvp} ${articulo.descripcion} (${articulo.referencia}) / (${articulo.codbarras})`,
                  option: articulo,
                };
              }),
            ),
          )
          .error(error => console.log("Error", error))
          .go();
      }
    },
    [seVende],
  );

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

export default QArticuloVbarba;
