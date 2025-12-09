import { Box, Container, Field, Typography } from "@quimera/comps";
import Quimera, { navigate, useStateValue, util } from "quimera";
import { useEffect } from "react";

function TareasTerminal({ idTareaProp, useStyles }) {
  const [{ tarea, modoBuscar }, dispatch] = useStateValue();
  const classes = useStyles();

  if (!util.getUser().estrabajador) {
    return (
      <Container maxWidth="md" className={classes.container}>
        <Box mt={2} flexGrow={1}>
          <Typography variant="h4">Este usuario no está asociado a ningún trabajador</Typography>
        </Box>
      </Container>
    );
  }

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { idTareaProp },
    });
  }, [idTareaProp, dispatch]);

  const onKeyPressed = event => {
    if (event.key === "Enter" && event.target.value !== "") {
      if (event.target.value === idTareaProp) {
        dispatch({ type: "onInit", payload: { idTareaProp } });
      } else {
        navigate(`/tareas/tareasterminal/${event.target.value.toUpperCase()}`);
      }
    }
  };

  const contentModo = modoBuscar && (
    <Box mt={4} display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Typography variant="h5" align="center">
        Leer código de tarea
      </Typography>
      <Box width={"200px"}>
        <Field.Text
          id="inputTarea"
          inputProps={{ maxLength: 30, style: { fontSize: "1.8em" } }}
          fullWidth
          onClick={event => event.target.select()}
          onKeyPress={event => onKeyPressed(event)}
          autoFocus
        />
      </Box>
    </Box>
  );

  return (
    <Quimera.Template id="TareasTerminal">
      <Container maxWidth="md" className={classes.container}>
        <Box mt={2} flexGrow={1}>
          {contentModo}
        </Box>
        {tarea && !modoBuscar && <Quimera.SubView id="TareasTerminal/Tarea" />}
      </Container>
    </Quimera.Template>
  );
}

export default TareasTerminal;
