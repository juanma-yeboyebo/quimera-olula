import { Box, Field, QBox, QBoxButton, QModelBox, QSection, Typography } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function Categoria({ callbackChanged, idCategoria, initCategoria, useStyles }) {
  const [{ categoria }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(categoria.event, callbackGuardada);
  }, [categoria.event.serial]);

  useEffect(() => {
    !!initCategoria &&
      dispatch({
        type: "onInitCategoria",
        payload: {
          initCategoria,
        },
      });
    !initCategoria &&
      !!idCategoria &&
      dispatch({
        type: "onInitCategoriaById",
        payload: {
          idCategoria,
        },
      });
  }, [initCategoria, idCategoria]);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().categorias;
  const editable = true;

  if ((!initCategoria && !idCategoria) || initCategoria?._status === "deleted") {
    return null;
  }

  if (idCategoria && !categoria.data.idCategoria) {
    return null;
  }

  return (
    <Quimera.Template id="Categoria">
      {categoria && (
        <QBox
          width={anchoDetalle}
          titulo={`${categoria.data.nombre}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteCategoria"
                title="Borrar categoria"
                icon="delete"
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="categoria.buffer" disabled={!editable} schema={schema}>
            <Box>
              <QSection
                title="Categoria"
                actionPrefix={"categoria"}
                alwaysInactive={!editable}
                dynamicComp={() => (
                  <Field.Schema
                    id={`categoria.buffer.nombre`}
                    schema={schema}
                    label=""
                    fullWidth
                    autoFocus
                  />
                )}
                saveDisabled={() => !schema.isValid(categoria)}
              >
                <Box display="flex" alignItems="center">
                  <Typography variant="h5">{categoria.buffer.nombre}</Typography>
                </Box>
              </QSection>
            </Box>
          </QModelBox>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default Categoria;
