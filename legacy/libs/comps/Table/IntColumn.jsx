import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  const isNotNull = value !== null && value !== undefined;

  return isNotNull ? parseInt(value) : null;
}

/**
 * IntColumn
 */
function IntColumn(props) {
  return <TableColumn columnType="IntColumn" align="right" format={formatCellValue} {...props} />;
}

export default IntColumn;
