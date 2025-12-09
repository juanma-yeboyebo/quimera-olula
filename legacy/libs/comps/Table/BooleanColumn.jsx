import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  return value?.toString() ?? "";
}

/**
 * TextColumn
 */
function BooleanColumn(props) {
  return (
    <TableColumn columnType="BooleanColumn" align="center" format={formatCellValue} {...props} />
  );
}

export default BooleanColumn;
