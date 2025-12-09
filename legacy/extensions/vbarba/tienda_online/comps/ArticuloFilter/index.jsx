import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";
import { util, useFilterValue, useStateValue } from "quimera";

function dameOptions(response) {
  const arrMap = [];
  response.data.map(art => {
    art.referencias.map(articulo => {
      const pvp = util.euros(articulo.pvp)
      arrMap.push({
        key: articulo.referencia,
        value: `${pvp} ${articulo.nombre} (${articulo.referencia})`,
        // option: articulo,
      });
    })
  });
  return arrMap;
}

function ArticuloFilter({ id, seVende = false, codFamilia = null, noOptionsText = "Buscar artículo por nombre", ...props }) {
  const [options, setOptions] = useState([]);
  const [{ lectura }, dispatch] = useStateValue();
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
            ["a.descripcion", "like", text],
            ["a.referencia", "like", text],
            ["a.codbarras", "like", text],
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
        API("to_articulos")
          .get()
          .select("referencia,codbarras,descripcion,precioRef")
          .filter(filtro)
          .success(response =>
            setOptions(
              dameOptions(response)

            ),
          )
          .error(error => console.log("Error", error))
          .go();
      }
    },
    [seVende],
  );

  const refValue = filter?.[id]?.value;

  const handleChange = event => {
    const value = event.target.value;
    console.log(event.keyCode);
    if (event.keyCode === 13) {

      const filtro = {
        or: [
          ["nombre", "like", value],
          ["referencia", "like", value],
          ["codbarras", "like", value],
        ],
      };
      console.log("onfiltrochanged____", lectura);
      addFilter("nombre", {
        filter: ["nombre", "like", lectura],
        value: lectura
      });
    } else {
      if (event.target.value) {
        addFilter(id, {
          filter: ["referencia", "eq", event.target.value.key],
          value: event.target.value.key
        });
      } else {
        removeFilter(id);
      }
    }

  };

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText={noOptionsText}
      onChange={handleChange}
      value={refValue}
      async
      {...props}
    />
  );
}

export default ArticuloFilter;
