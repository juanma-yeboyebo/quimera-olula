import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import { useCallback, useEffect, useState } from "react";

function FormasPago({ id, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("formaspago")
      .get()
      .select("codpago,descripcion")
      .filter(["1", "eq", "1"])
      .page({ limit: 1000 })
      .success(response =>
        setOptions(
          response.data.map(tipo => {
            return { key: tipo.codpago, value: tipo.descripcion };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  // const getOptionLabel = option => option?.value ?? options?.filter(o => o.key === (option?.key ?? option))[0]?.value ?? option

  return (
    // <Field.Select getOptions={ getOptions } getOptionLabel={ getOptionLabel } options={ options } { ...props} noOptionsText='Buscar por forma de pago' />
    <Field.Select id={id} options={options} {...props} noOptionsText="Indica la forma de pago" />
  );
}

export default FormasPago;
