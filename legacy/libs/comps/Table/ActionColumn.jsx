import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  return value;
}

/**
 * ActionColumn
 */
function ActionColumn({ width = 36, ...props }) {
  return (
    <TableColumn
      columnType="ActionColumn"
      align="center"
      px={0}
      format={formatCellValue}
      width={width}
      flexGrow={0}
      {...props}
    />
  );
}

export default ActionColumn;
