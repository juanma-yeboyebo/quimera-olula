import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function QTela({ idModelo = null, codFamilia = null, noOptionsText = "Buscar tela por nombre", noObsoleto = true, ...props }) {
  const [options, setOptions] = useState([]);

  const getFiltroOptions = (codFamilia, idModelo) => {
    const options = [];
    if (codFamilia) {
      options.push(["codfamilia", "eq", codFamilia]);
    }
    if (idModelo) {
      options.push(["idmodelo", "eq", idModelo]);
    }
    if (noObsoleto) {
      options.push(["obsoleto", "eq", !noObsoleto]);
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
      const filtroOptions = getFiltroOptions(codFamilia, idModelo);
      filtroOptions && filtroOptions.push(filtroBase);
      const filtro = filtroOptions
        ? {
          and: filtroOptions,
        }
        : filtroBase;
      if (text !== null || key !== null) {
        API("articulos")
          .get("-static-", "get_telas")
          .select("referencia,descripcion")
          .filter(filtro)
          .success(response =>
            setOptions(
              response.data.map(articulo => {
                return {
                  key: articulo.referencia,
                  value: `${articulo.descripcion} (${articulo.referencia})`,
                  option: articulo,
                };
              }),
            ),
          )
          .error(error => console.log("Error", error))
          .go();
      }
    },
    [idModelo],
  );

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, [idModelo]);

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

export default QTela;
