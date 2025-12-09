import { util } from "quimera";
import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  /* if (value == null) {
    return ''
  }
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
  const fecha = new Date(Date.parse(value))
  return fecha.toLocaleDateString('es-ES', options) */
  return value ? util.formatDate(value) : "";
}

/**
 * DateColumn
 */
function DateColumn(props) {
  return (
    <TableColumn
      columnType="DateColumn"
      align="center"
      format={formatCellValue}
      width={100}
      flexGrow={0}
      {...props}
    />
  );
}

export default DateColumn;
