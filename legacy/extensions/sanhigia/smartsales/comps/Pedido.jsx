import { Field, Typography } from "@quimera/comps";
import { getSchemas, useFilterValue, useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useEffect, useState } from "react";

function Pedido({ id, codCliente, codAgente, estatico, filterField = false, refrescar = false, StaticComp, ...props }) {
  const [state] = useStateValue();
  const filterValueObj = useFilterValue();
  const filterState = filterValueObj?.[0];
  const addFilter = filterValueObj?.[1];
  const removeFilter = filterValueObj?.[2];
  const filter = filterState?.filter;

  const [nombre, setNombre] = useState("");
  const [options, setOptions] = useState([]);

  const schemaName = util.lastStateField(id).split(".").pop();

  const idpedido = filterField ? filter?.[schemaName]?.value : util.getStateValue(id, state, null);

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
    API("pedidoscli")
      .get()
      .select("idpedido,codigo,nombrecliente,fecha")
      .filter(["codagente", "eq", codAgente])
      .order("fecha DESC")
      .success(response => setNombre(response.data[0]?.nombre))
      .error(error => console.log("Error", error))
      .go();
  }, [idpedido, refrescar]);

  if (estatico) {
    if (StaticComp) {
      return <StaticComp>{nombre}</StaticComp>;
    }

    return <Typography>{nombre}</Typography>;
  }

  const getFiltroOptions = (key, codAgente, codCliente) => {
    const options = [];
    if (key) {
      options.push(["idpedido", "eq", key]);
    }
    if (codAgente) {
      options.push(["codagente", "eq", codAgente]);
    }
    if (codCliente) {
      options.push(["codcliente", "eq", codCliente]);
    }

    return options.length > 0 ? options : null;
  };

  const getOptions = useCallback(
    (text, key) => {
      const schema = getSchemas().pedidos;

      const filtroSearch = {
        or: [
          ["codigo", "like_ua", text ?? ""],
          ["nombrecliente", "like_ua", text ?? ""],
        ],
      };
      // const keyFilter = key ? ["idpedido", "eq", key] : [];
      // const searchFilter = !key ? filtroSearch : [];
      // const agenteFilter = codAgente ? ["codagente", "eq", codAgente] : [];
      // const clienteFilter = codCliente ? ["codcliente", "eq", codCliente] : [];

      // const apiFilter = [keyFilter, agenteFilter, clienteFilter]
      //   .filter(f => f.length)
      //   .reduce(
      //     (accum, item) => ({
      //       ...accum,
      //       and: [...accum.and, item],
      //     }),
      //     { and: [] },
      //   );

      const filtroBase = !key ? filtroSearch : [];
      const filtroOptions = getFiltroOptions(key, codAgente, codCliente);
      filtroOptions && filtroOptions.push(filtroBase);
      const apiFilter = filtroOptions
        ? {
          and: filtroOptions,
        }
        : filtroBase;

      API("pedidoscli")
        .get()
        .select("idpedido,codigo,nombrecliente,fecha")
        .filter(apiFilter)
        .page({ limit: 50 })
        .order("fecha DESC")
        .success(response => {
          setOptions(
            response.data
              .map(c => schema.load(c))
              .map(_pedido => ({
                key: _pedido.idPedido,
                value: `${_pedido.codigo} (${util.formatDate(_pedido.fecha)})/${_pedido.nombreCliente
                  }`,
                option: _pedido,
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
      value={idpedido}
      onChange={onChange}
      getOptions={getOptions}
      options={options}
      {...props}
      async
    />
  );
}

export default Pedido;
