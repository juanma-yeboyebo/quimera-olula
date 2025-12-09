import { Box, Field, Icon, IconButton, Typography } from "@quimera/comps";
import { Draggable, Droppable } from "@quimera/thirdparty";
import Quimera, { useStateValue } from "quimera";
// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'

function EmailsDisponibles({ useStyles }) {
  const [{ estadoNuevoEmail, dirDisponible, nuevoEmail }, dispatch] = useStateValue();
  const classes = useStyles();

  const endAdornmentEmail = {
    invalido: <Icon style={{ color: "#ef5350" }}>dangerous</Icon>,
    valido: (
      <IconButton
        id="cerrar"
        size="small"
        className={classes.icon}
        onClick={() => dispatch({ type: "onAddNuevoEmailClicked" })}
      >
        <Icon>add_circle</Icon>
      </IconButton>
    ),
  };

  const compruebaFormatoEmail = event => {
    const value = event.target.value;
    const valido = !!value.match(/^(?!\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}$/);
    dispatch({ type: "setNuevoEmail", payload: { value, valido: valido ? "valido" : "invalido" } });
  };

  return (
    <Quimera.Template id="EmailsDisponibles">
      <Box mx={2}>
        <Box mb={2}>
          <Typography variant="h6" align="center">
            Direcciones disponibles:
          </Typography>
        </Box>
        <Box mb={2}>
          <Field.Text
            id="nuevoEmail"
            placeholder="Añade una dirección a la lista"
            fullWidth
            endAdornment={
              !!nuevoEmail && (
                <Box
                  height="25px"
                  width="25px"
                  display={"flex"}
                  justifyContent={"center"}
                  alignContent={"center"}
                >
                  {endAdornmentEmail[estadoNuevoEmail]}
                </Box>
              )
            }
            onKeyDown={event => {
              event.keyCode === 13 && event.preventDefault();
              dispatch({
                type: "handleTextFieldKey",
                payload: { keyCode: event.keyCode },
              });
            }}
            onChange={event => compruebaFormatoEmail(event)}
          />
        </Box>
        <Droppable droppableId="Disponible" key="disponibles" isDropDisabled={true}>
          {(provided, snapshot) => {
            return (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: snapshot.isDraggingOver ?? "white",
                  cursor: "not-allowed",
                }}
              >
                {dirDisponible.map((emailDir, index) => {
                  return (
                    <Draggable key={emailDir} draggableId={emailDir} index={index}>
                      {(provided, snapshot) => {
                        return (
                          <Box
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                          >
                            <Box mb={1} className={classes.tarjetaEmail}>
                              <Typography className={classes.chipDisponible}>{emailDir}</Typography>
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
      </Box>
    </Quimera.Template>
  );
}

export default EmailsDisponibles;
