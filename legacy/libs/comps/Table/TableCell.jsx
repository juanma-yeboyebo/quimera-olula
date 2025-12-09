import { makeStyles } from "@quimera/styles";
import { Tooltip } from "@quimera/thirdparty";
import { A } from "quimera";
import React from "react";

const useStyles = makeStyles(_theme => ({
  hoverText: {
    "&:hover": {
      fontWeight: 1000,
      cursor: "pointer",
    },
  },
}));

// ForwardRef es necesario para que el tooltip pueda escuchar en los elementos interiores del componente
const TableCell = React.forwardRef(function TableCell(tableCellProps, ref) {
  const classes = useStyles();
  const {
    children,
    columnType,
    isHeader,
    href,
    tooltip,
    style,
    flexBasis,
    width,
    minWidth,
    flexGrow,
    ...props
  } = tableCellProps;

  const myBox = (
    <div
      style={{
        padding: "0 4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        borderBottom: isHeader ? "2px solid darkgrey" : "inherit",
        backgroundColor: isHeader ? "#fff" : "inherit",
        flexBasis: flexBasis || width ? `${flexBasis ?? width}px` : "50px",
        // width: width ? `${width}px` : "inherit",
        minWidth: minWidth ? `${minWidth}px` : "inherit",
        flexShrink: 0,
        flexGrow: flexGrow ?? "inherit",
        ...(style ?? {}),
      }}
      className={href && classes.hoverText}
      {...props}
      ref={ref}
    >
      {href ? (
        <A href={href} style={{ textDecoration: "none", color: "inherit" }}>
          {children}
        </A>
      ) : (
        children
      )}
    </div>
  );

  return tooltip ? <Tooltip title={tooltip}>{myBox}</Tooltip> : myBox;
});

export default TableCell;
