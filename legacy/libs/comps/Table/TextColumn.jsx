import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  return value;
}

/**
 * TextColumn
 */
function TextColumn(props) {
  return <TableColumn columnType="TextColumn" align="left" format={formatCellValue} {...props} />;
}

export default TextColumn;
