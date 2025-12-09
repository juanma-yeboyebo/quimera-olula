import { Box, Button, Icon } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function ListaDocumentos({ useStyles }) {
  const [{ carpetaActual, documentoSeleccionado }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="ListaDocumentos">
      <Box className={classes.breadCrumb} display="flex" />
      {carpetaActual.pathText.map((text, index, array) => {
        return (
          <React.Fragment>
            <Button
              id={carpetaActual.pathId[index].toString()}
              text={text}
              onClick={() =>
                dispatch({ type: "onMigaClicked", payload: { id: carpetaActual.pathId[index] } })
              }
            />
            {index < array.length - 1 ? ">" : ""}
          </React.Fragment>
        );
      })}
      {carpetaActual.children.map(hijo => (
        <Box
          className={
            hijo.id === documentoSeleccionado.idDocumentoSeleccion
              ? classes.elementSelected
              : classes.listElement
          }
          display="flex"
          alignItems="center"
          onClick={
            hijo.type === "doc"
              ? () => {
                dispatch({
                  type: "onDocumentoSeleccionado",
                  payload: {
                    nombreDocumentoSeleccionado: hijo.name,
                    idDocumentoSeleccion: hijo.id,
                  },
                });
              }
              : () => {
                dispatch({ type: "onCarpetaClicked", payload: { carpeta: hijo } });
              }
          }
        >
          {hijo.type === "dir" ? (
            <Icon className={classes.iconFolder}>folder</Icon>
          ) : (
            <Icon className={classes.iconDocument}>description</Icon>
          )}
          {hijo.name}
        </Box>
      ))}
    </Quimera.Template>
  );
}

export default ListaDocumentos;
