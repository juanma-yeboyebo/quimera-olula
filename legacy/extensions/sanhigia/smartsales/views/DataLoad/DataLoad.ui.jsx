import { Box, Button, Field, QBox, QListItem, Typography } from "@quimera/comps";
import { useTheme } from "@quimera/styles";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function DataLoad() {
  const [{ errors }, dispatch] = useStateValue();
  const theme = useTheme();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const anchoDetalle = mobile ? 1 : 0.5;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        dispatch,
      },
    });
  }, [dispatch]);

  return (
    <Quimera.Template id="DataLoad">
      <Box
        mx={desktop ? 0.5 : 0}
        width={0.9}
        display="flex"
        flexDirection={mobile ? "column" : "row"}
      >
        <QBox titulo="Carga de datos" width={anchoDetalle}>
          <Box display="flex" flexDirection="column" style={{ gap: "1em" }}>
            <Field.File id="csvFile" label="Fichero" />
            <Field.CheckBox id="hasHeader" label="Tiene cabecera" />
            <Field.Text id="delimiter" label="Separador" />
            <Button id="uploadFile" variant="contained" color="primary" text="Subir fichero" />
          </Box>
        </QBox>
        <QBox titulo="Errores" width={anchoDetalle}>
          {!!errors?.length && (
            <List>
              {errors
                ?.sort((a, b) => a.row > b.row)
                .map(error => (
                  <QListItem
                    key={`${error.row}:${error.col}`}
                    avatar={{
                      content: error.row,
                      color: theme.palette.error.dark,
                    }}
                    tl={`El campo ${error.field} ${error.reason}`}
                    bl={`Valor '${error.value}'`}
                    tr={`Fila ${error.row} - Columna ${error.col}`}
                  />
                ))}
            </List>
          )}
          {!errors?.length && <Typography variant="h6">No se han registrado errores</Typography>}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default DataLoad;
