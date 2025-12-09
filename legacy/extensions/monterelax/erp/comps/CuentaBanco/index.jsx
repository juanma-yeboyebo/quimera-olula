import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function CuentaBanco({ id, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("cuentas")
      .get()
      .select("codcuenta,descripcion,saldo")
      .filter(["1", "eq", "1"])
      .page({ limit: 1000 })
      .success(response =>
        setOptions(
          response.data.map(cuenta => {
            return { key: cuenta.codcuenta, value: cuenta.descripcion, option: cuenta };
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
    // <Field.Select getOptions={ getOptions } getOptionLabel={ getOptionLabel } options={ options } { ...props} noOptionsText='Buscar por cuenta bancaria' />
    <Field.Select id={id} options={options} {...props} noOptionsText="Indica la cuenta bancaria" />
  );
}

export default CuentaBanco;
