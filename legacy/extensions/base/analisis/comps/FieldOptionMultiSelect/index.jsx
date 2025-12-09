import { Box, Icon, IconButton, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { DragDropContext, Draggable, Droppable } from "@quimera/thirdparty";
import { useStateValue } from "quimera";

// import { useCallback, useEffect, useState } from "react";

const useStyles = makeStyles(theme => ({
  droppableContext: {
    "&:hover": {
      cursor: "not-allowed",
      // cursor: 'no-drop',
    },
  },
  tarjetaColumna: {
    borderRadius: 8,
    padding: 5,
    minWidth: "200px",
    minHeight: "100%",
  },
  tarjetaItem: {
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "flex-start",
    "border": "1px solid lightgrey",
    "borderRadius": 8,
    "padding": 5,
    "backgroundColor": "white",
    "&:hover": {
      border: "1px solid grey",
    },
  },
  nombreItem: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    minWidth: "0",
  },
}));

function FieldOptionMultiSelect({ id, schema, items, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const schemaObj = schema?._get?.();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldName = id.replace(/\//g, ".").split(".").pop();
  const fieldSchema = fieldsObj?.[fieldName];
  const options = fieldSchema?._paramSet?._options;
  if (!options) {
    return <>Componente no válido</>;
  }

  const onHandleDragEnd = result => {
    const option = options.find(option => option.key === result.draggableId);
    dispatch({
      type: `onHandleDragEnd`,
      payload: { result, option, fieldName: `${fieldName}Aux` },
    });
  };

  return (
    <Box display="flex" style={{ gap: "20px" }}>
      <DragDropContext
        onDragEnd={result => onHandleDragEnd(result)}
        onDragStart={result => dispatch({ type: "handleDragStart", payload: { result } })}
      >
        <Droppable droppableId="opciones" isDropDisabled key="opciones">
          {(provided, snapshot) => {
            return (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classes.tarjetaColumna}
              >
                <Box mb={2}>
                  <Typography variant="h6">Disponibles:</Typography>
                </Box>
                {(options ?? [])
                  .filter(option => !items.includes(option))
                  .map((option, index) => {
                    return (
                      <Draggable key={option.key} draggableId={option.key} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <Box
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                            >
                              <Box
                                key={option?.key ?? option}
                                mb={1}
                                className={classes.tarjetaItem}
                              >
                                <Typography variant="body1" className={classes.nombreItem}>
                                  {option?.value}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </Box>
            );
          }}
        </Droppable>
        <Droppable droppableId="items" key="items" isDropDisabled={false}>
          {(provided, snapshot) => {
            return (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classes.tarjetaColumna}
                style={{ background: snapshot.isDraggingOver ? "lightgrey" : "white" }}
              >
                <Box mb={2}>
                  <Typography variant="h6">A mostar:</Typography>
                </Box>
                {(items ?? []).map((item, index) => {
                  return (
                    <Draggable key={item.key} draggableId={item.key} index={index}>
                      {(provided, snapshot) => {
                        return (
                          <Box
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                          >
                            <Box key={item?.key ?? item} mb={1} className={classes.tarjetaItem}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  dispatch({
                                    type: "onBorrarItemClicked",
                                    payload: { index, fieldName: `${fieldName}Aux` },
                                  })
                                }
                              >
                                <Icon>close</Icon>
                              </IconButton>
                              <Typography variant="body1" className={classes.nombreItem}>
                                {item?.value}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Box>
            );
          }}
        </Droppable>
        {/* <Box display="flex" flexDirection="column" width={0.4}>
          {(options ?? [])
            .filter(option => !items.includes(option))
            .map(item => (
              <Box
                key={item?.key ?? item}
                display="flex"
                alignItems="center"
                style={{
                  marginTop: "15px",
                }}
                onClick={() =>
                  dispatch({
                    type: `on${fieldName}MultiSelectClicked`,
                    payload: { option: item },
                  })
                }
              >
                <Typography
                  variant="body1"
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    minWidth: "0",
                  }}
                >
                  {item?.value}
                </Typography>
              </Box>
            ))}
        </Box> */}
        {/* <Box display="flex" flexDirection="column" width={0.5}>
          {(items ?? []).map((item, idx) => (
            <Box
              key={item?.key ?? item}
              display="flex"
              alignItems="center"
              style={{
                marginTop: "15px",
              }}
              onClick={() =>
                dispatch({
                  type: `on${fieldName}MultiSelectDeleted`,
                  payload: { option: item, index: idx },
                })
              }
            >
              <Typography
                variant="body1"
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  minWidth: "0",
                }}
              >
                {item?.value}
              </Typography>
            </Box>
          ))}
        </Box> */}
      </DragDropContext>
    </Box>
  );
}

export default FieldOptionMultiSelect;
