import React from "react";

import TableColumn from "./TableColumn";

/**
 * DecimalColumn
 */
function DecimalColumn({ decimals = 2, ...props }) {
  function formatCellValue(value) {
    return !!value || value === 0
      ? Number(value).toLocaleString("de-DE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : null;
  }

  return (
    <TableColumn columnType="DecimalColumn" align="right" format={formatCellValue} {...props} />
  );
}

export default DecimalColumn;
