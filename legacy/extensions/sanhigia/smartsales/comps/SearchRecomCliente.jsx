import { Field } from "@quimera/comps";
import { getSchemas, useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useState } from "react";

function SearchRecomCliente({ id, ...props }) {
  const [state] = useStateValue();

  const [options, setOptions] = useState([]);

  const cliente = util.getStateValue(id, state, null);

  const getOptions = useCallback((text, key) => {
    const schema = getSchemas().recomCliente;

    API("ss_recomendaciones")
      .get("-static-", "get_clientes")
      .select("codcliente,nombre,email,telefono")
      .filter(
        key
          ? ["codcliente", "eq", key]
          : {
              or: [
                ["nombre", "like", text ?? ""],
                ["email", "like", text ?? ""],
                ["telefono1", "like", text ?? ""],
              ],
            },
      )
      .success(response => {
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(_cliente => ({
              key: _cliente.codCliente,
              value: `${_cliente.codCliente} - ${_cliente.nombre}`,
              option: _cliente,
            })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return (
    <Field.Select
      id={id}
      value={cliente}
      placeholder="Cliente"
      getOptions={getOptions}
      options={options}
      fullWidth
      {...props}
      async
    />
  );
}

export default SearchRecomCliente;
