import { makeStyles } from "@quimera/styles";
import { Box, InfiniteScroll } from "@quimera/thirdparty";
import { useAppValue, util } from "quimera";
import React from "react";

const useStyles = makeStyles(_theme => ({
  cursorPointer: {
    cursor: "pointer",
  },
  infinite: {
    overflow: "visible !important",
  },
}));

function Table({ id, data, idField = "id", orderColumn, children = [], next, hasMore = false, clickMode = "cell", bgcolorRowFunction, schema, loader, onChange, RowRenderer, page, rows, ...props }) {
  const [appValue] = useAppValue();
  const classes = useStyles();
  const visibleLoading = appValue.environment.inDevelopment();

  // console.log("mimensaje_data", data);

  return (
    <Box
      id="scrollableDiv"
      name={id}
      height="100%"
      overflowX="scroll"
      overflowY="hidden"
      {...props}
    >
      {RowRenderer ? (
        <RowRenderer key={"header"} schema={schema} isHeader={true} />
      ) : (
        <div
          key="header"
          style={{
            alignItems: "center",
            display: "flex",
            position: "sticky",
            top: "0",
            zIndex: "1",
            // backgroundColor: 'white'
          }}
          className={classes.header}
        >
          {children.map(column =>
            React.cloneElement(column, {
              key: column.props.id,
              isHeader: true,
              tableName: id,
              orderColumn,
              schema,
              value: null,
            }),
          )}
        </div>
      )}
      <InfiniteScroll
        dataLength={data.length}
        next={next}
        hasMore={hasMore}
        loader={visibleLoading && (loader || <h4>Loading...</h4>)}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b></b>
          </p>
        }
        className={classes.infinite}
      // scrollableTarget='scrollableDiv'
      // Quitar scrollableTarget='scrollableDiv' para que depende del scroll principal de la pantalla
      >
        <div id={`${id}Body`}>
          {RowRenderer
            ? data.map((row, idx) => (
              <RowRenderer
                key={row[idField]}
                schema={schema}
                rowData={row}
                index={page && rows ? page * rows + idx : idx}
              />
            ))
            : data.map((rowData, idx, arr) => (
              <Box
                alignItems="center"
                display="flex"
                alignContent="baseline"
                key={rowData[idField]}
                minHeight={40}
                bgcolor={bgcolorRowFunction ? bgcolorRowFunction(rowData) : null}
                // onClick={() => dispatch({ type: `on${util.camelId(id)}RowClicked`, payload: rowData })}
                className={bgcolorRowFunction ? classes.cursorPointer : null}
              >
                {children.map(column => {
                  return React.cloneElement(column, {
                    key: `${rowData[idField]}${util.camelId(column.props.id)}`,
                    tableName: id,
                    data: rowData,
                    clickMode,
                    schema,
                    index: idx,
                    array: arr,
                  });
                })}
              </Box>
            ))}
        </div>
      </InfiniteScroll>
    </Box>
  );
}

export default Table;
