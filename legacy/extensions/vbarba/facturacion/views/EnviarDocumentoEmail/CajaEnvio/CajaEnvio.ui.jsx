import { Box, Grid, Icon, IconButton, Typography } from "@quimera/comps";
import { Draggable, Droppable } from "@quimera/thirdparty";
import Quimera, { useStateValue } from "quimera";
// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'

function CajaEnvio({ tipoEnvio, useStyles }) {
  const [{ dirTO, dirCC, dirBCC }, dispatch] = useStateValue();
  const classes = useStyles();

  function dameVaribale(tipoEnvio) {
    switch (tipoEnvio) {
      case "TO":
        return dirTO;
      case "CC":
        return dirCC;
      case "BCC":
        return dirBCC;
    }
  }

  return (
    <Quimera.Template id="CajaEnvio">
      <Box mx={2}>
        <Box mb={2}>
          <Typography variant="h6" align="center">
            {tipoEnvio}
          </Typography>
        </Box>
        <Droppable droppableId={tipoEnvio} key={tipoEnvio} isDropDisabled={false}>
          {(provided, snapshot) => {
            return (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                minHeight={"50px"}
                style={{
                  background: snapshot.isDraggingOver ? "lightblue" : "white",
                  // cursor: "not-allowed",
                }}
              >
                {dameVaribale(tipoEnvio).map((emailDir, index) => {
                  return (
                    <Draggable key={emailDir} draggableId={emailDir} index={index}>
                      {(provided, snapshot) => {
                        return (
                          <Box
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                          >
                            <Grid container className={classes.tarjetaEmail}>
                              <Grid item xs={1}>
                                <IconButton
                                  size="small"
                                  className={classes.iconoCerrar}
                                  onClick={() =>
                                    dispatch({
                                      type: "onQuitarRemitenteClicked",
                                      payload: { emailDir, index, tipoEnvio },
                                    })
                                  }
                                >
                                  <Icon>close</Icon>
                                </IconButton>
                              </Grid>
                              <Grid item xs={11}>
                                <Typography className={classes.chipTo}>{emailDir}</Typography>
                              </Grid>
                            </Grid>
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

export default CajaEnvio;
