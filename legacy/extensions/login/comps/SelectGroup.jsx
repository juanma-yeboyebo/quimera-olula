import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function SelectGroup({ field, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("flgroups")
      .get()
      .select("idgroup,descripcion")
      .filter(["1", "eq", "1"])
      .success(response =>
        setOptions(
          response.data.map(group => {
            return { key: group.idgroup, label: group.descripcion, value: group.idgroup };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .page({ limit: 100 })
      .go();
  }, []);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return <Field.RadioButton label="Grupo" options={options} {...props} />;
}

export default SelectGroup;
