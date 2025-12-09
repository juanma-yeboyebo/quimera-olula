import React from "react";

import { Field } from "../";
import TableColumn from "./TableColumn";

/**
 * SelectionColumn
 */
function SelectionColumn({ id, index, ...props }) {
  return (
    <TableColumn
      columnType="SelectionColumn"
      id={id}
      header=""
      index={index}
      width={25}
      align="center"
      value={line => (
        <Field.CheckBox id={"selection"} checked={id in line && line[id]} index={index} />
      )}
      {...props}
    />
  );
}

export default SelectionColumn;
