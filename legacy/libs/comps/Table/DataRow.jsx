import React from "react";

function DataRow({ children, style }) {
  return (
    <div
      style={{
        ...style,
        alignItems: "center",
        display: "flex",
        alignContent: "baseline",
        height: "40px",
      }}
      // key={index}
      // bgcolor={bgcolorRowFunction ? bgcolorRowFunction(rowData) : null}
      // onClick={() => dispatch({ type: `on${util.camelId(id)}RowClicked`, payload: rowData })}
      // className={bgcolorRowFunction ? classes.cursorPointer : null}
    >
      {children}
      {/* {children.map((column) => {
        return React.cloneElement(column, {
          key: `${rowData[idField]}${util.camelId(column.props.id)}`,
          tableName: id,
          data: rowData,
          clickMode: clickMode,
          schema: schema,
          index,
          array,
        })
      })} */}
    </div>
  );
}

export default DataRow;
