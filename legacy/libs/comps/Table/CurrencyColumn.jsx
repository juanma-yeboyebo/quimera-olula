import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  return Number(value ?? 0).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * CurrencyColumn
 */
function CurrencyColumn(props) {
  return (
    <TableColumn columnType="CurrencyColumn" align="right" format={formatCellValue} {...props} />
  );
}

export default CurrencyColumn;
