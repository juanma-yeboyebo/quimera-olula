import React from "react";

import SelectField from "./SelectField";

function SelectBase({ selectprops = {}, ...props }) {
  return <SelectField {...props} />;
}

export default SelectBase;
