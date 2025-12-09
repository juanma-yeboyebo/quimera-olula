import { Field } from "@quimera/comps";
import { getSchemas, util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useEffect, useState } from "react";

function SearchRecomDireccion({ codCliente, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(codCliente => {
    if (!codCliente) {
      return setOptions([]);
    }

    const schema = getSchemas().dirClientes;
    function setDirecciones(direcciones) {
      setOptions(
        direcciones
          .map(d => schema.load(d))
          .map(dir => {
            return {
              key: dir.codDir,
              value: util.buildAddress(dir, true),
              option: dir,
            };
          }),
      );
    }
    API("dirclientes")
      .get()
      .select(schema.fields)
      .filter(["codcliente", "eq", codCliente])
      .success(response => setDirecciones(response.data))
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    getOptions(codCliente);
  }, [codCliente, getOptions]);

  return (
    <Field.Select
      placeholder="Dirección del cliente"
      fullWidth
      options={options}
      getOptions={getOptions}
      noOptionsText="No hay direcciones"
      {...props}
    />
  );
}

export default SearchRecomDireccion;
