import { Field } from "@quimera/comps";
import React, { useState } from "react";

function Familia({ ...props }) {
  const [options, setOptions] = useState([]);

  const initialData = {
    estados: [
      { key: "ELECMON", value: "MONT. ELEC" },
      { key: "TRANS.", value: "TRANSPORTE" },
    ],
  };

  return <Field.Select label="Familia" options={initialData.estados} fullWidth {...props} />;
}

export default Familia;
