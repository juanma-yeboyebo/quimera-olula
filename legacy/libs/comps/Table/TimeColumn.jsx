import { util } from "quimera";
import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  return value ? util.formatDate(value) : "";
}

function TimeColumn(props) {
  return (
    <TableColumn
      columnType="TimeColumn"
      align="center"
      format={formatCellValue}
      width={100}
      flexGrow={0}
      {...props}
    />
  );
}

export default TimeColumn;
