import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

import { useFilterValue, useStateValue, util } from "quimera";

function QArticuloFilter({ id, idFilter = false, seVende = false, codFamilia = null, noOptionsText = "Buscar artículo por nombre", filterField = false, ...props }) {
  const [options, setOptions] = useState([]);
  const [state] = useStateValue();
  const [{ filter, schema }, addFilter, removeFilter] = useFilterValue();

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
          .select("referencia,codbarras,descripcion")
          .filter(filtro)
          .success(response =>
            setOptions(
              response.data.map(articulo => {
                return {
                  key: articulo.referencia,
                  value: `${articulo.descripcion} (${articulo.codbarras && articulo.referencia !== articulo.codbarras
                    ? `${articulo.referencia} / ${articulo.codbarras}`
                    : `${articulo.referencia}`
                    })`,
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

  let refValue = null;
  if (filterField) {
    const filtroGuardado = util.getLastFilter(util.camelId(idFilter));
    refValue = filter?.[id]?.value || filtroGuardado?.[id]?.value;
  } else {
    refValue = util.getStateValue(id, state, null);

  }

  const handleChange = event => {
    if (event.target.value) {
      addFilter(id, {
        filter: ["referencia", "eq", event.target.value.key],
        value: event.target.value.key
      });
    } else {
      removeFilter(id);
    }
  };

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      value={refValue}
      onChange={handleChange}
      noOptionsText={noOptionsText}
      async
      {...props}
    />
  );
}

export default QArticuloFilter;
