import { Field, Typography } from "@quimera/comps";
import { getSchemas, useFilterValue, useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useEffect, useState } from "react";

function Contacto({ id, codCliente, estatico, filterField = false, refrescar = false, StaticComp, ...props }) {
  const [state] = useStateValue();
  const filterValueObj = useFilterValue();
  const filterState = filterValueObj?.[0];
  const addFilter = filterValueObj?.[1];
  const removeFilter = filterValueObj?.[2];
  const filter = filterState?.filter;

  const [nombre, setNombre] = useState("");
  const [options, setOptions] = useState([]);

  const schemaName = util.lastStateField(id).split(".").pop();

  const contacto = filterField ? filter?.[schemaName]?.value : util.getStateValue(id, state, null);

  const handleFilter = event => {
    const valueKey = event.target?.value?.key;
    valueKey
      ? addFilter(id, {
        filter: [schemaName, "eq", valueKey],
        value: valueKey,
      })
      : removeFilter(id);
  };

  const onChange = filterField ? handleFilter : null;

  useEffect(() => {
    API("contactos")
      .get()
      .select("codcontacto,nombre")
      .filter(["codcontacto", "eq", contacto])
      .success(response => setNombre(response.data[0]?.nombre))
      .error(error => console.log("Error", error))
      .go();
  }, [contacto, refrescar]);

  if (estatico) {
    if (StaticComp) {
      return <StaticComp>{nombre}</StaticComp>;
    }

    return <Typography>{nombre}</Typography>;
  }

  const getOptions = useCallback(
    (text, key) => {
      const schema = getSchemas().contacto;

      const keyFilter = key ? ["codcontacto", "eq", key] : [];
      const searchFilter = !key ? ["nombre", "like_ua", text ?? ""] : [];
      const clienteFilter = codCliente ? ["codcliente", "eq", codCliente] : [];

      const apiFilter = [keyFilter, searchFilter, clienteFilter]
        .filter(f => f.length)
        .reduce(
          (accum, item) => ({
            ...accum,
            and: [...accum.and, item],
          }),
          { and: [] },
        );

      API("contactos")
        .get()
        .select("codcontacto,nombre")
        .filter(apiFilter)
        .success(response => {
          setOptions(
            response.data
              .map(c => schema.load(c))
              .map(_contacto => ({
                key: _contacto.codContacto,
                value: _contacto.nombre,
                option: _contacto,
              })),
          );
        })
        .error(error => console.log("Error", error))
        .go();
    },
    [codCliente],
  );

  return (
    <Field.Select
      id={id}
      value={contacto}
      onChange={onChange}
      getOptions={getOptions}
      options={options}
      {...props}
      async
    />
  );
}

export default Contacto;
