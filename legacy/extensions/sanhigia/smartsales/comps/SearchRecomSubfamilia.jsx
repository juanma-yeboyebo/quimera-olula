import { Field } from "@quimera/comps";
import { getSchemas, useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useState } from "react";

function SearchRecomSubfamilia({ id, ...props }) {
  const [state] = useStateValue();

  const [options, setOptions] = useState([]);

  const subfamilia = util.getStateValue(id, state, null);

  const getOptions = useCallback((text, key) => {
    const schema = getSchemas().recomSubfamilia;

    API("ss_recomendaciones")
      .get("-static-", "get_subfamilias")
      .select("codsubfamilia,descripcion")
      .filter(
        key
          ? ["codsubfamilia", "eq", key]
          : {
              or: [
                ["descripcion", "like", text ?? ""],
                ["codsubfamilia", "like", text ?? ""],
              ],
            },
      )
      .success(response => {
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(_subfamilia => ({
              key: _subfamilia.codsubfamilia,
              value: `${_subfamilia.codsubfamilia} - ${_subfamilia.descripcion}`,
              option: _subfamilia,
            })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return (
    <Field.Select
      id={id}
      value={subfamilia}
      placeholder="Subfamilia"
      getOptions={getOptions}
      options={options}
      fullWidth
      {...props}
      async
    />
  );
}

export default SearchRecomSubfamilia;
