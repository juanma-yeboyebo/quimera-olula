import { Field } from "@quimera/comps";
import { useCallback, useEffect, useState } from "react";

import { TpvDb } from "../lib";

const MAX_OPTIONS = 10;

function TpvArticulo({ ...props }) {
  const [options, setOptions] = useState([]);
  const catalogo = TpvDb.getCatalogo();

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = useCallback((text, key) => {
    let matchedOptions = Object.values(catalogo ? catalogo.articulos : {});

    if (!!text && text !== "") {
      matchedOptions = matchedOptions.filter(articulo =>
        key
          ? articulo.referencia === key
          : articulo.referencia.toUpperCase() === text?.toUpperCase() ||
            articulo.descripcion.toUpperCase().includes(text?.toUpperCase()),
      );
    }

    const completeOptions = matchedOptions.slice(0, MAX_OPTIONS).map(articulo => ({
      key: articulo.referencia,
      value: `${articulo.referencia} - ${articulo.descripcion}`,
      option: articulo,
    }));

    setOptions(completeOptions);
  }, []);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return <Field.Select getOptions={getOptions} options={options} async {...props} />;
}

export default TpvArticulo;
