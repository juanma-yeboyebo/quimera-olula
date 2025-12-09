import { Box, Field, QBox, QModelBox, QSection, Typography } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function Producto({ callbackChanged, initProducto, useStyles }) {
  const [{ producto }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(producto.event, callbackChanged);
  }, [producto.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitProducto",
      payload: {
        initProducto,
      },
    });
  }, [initProducto]);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().catalogo;
  const editable = true;

  if (!initProducto || initProducto?._status === "deleted") {
    return null;
  }

  return (
    <Quimera.Template id="Producto">
      {producto && (
        <QBox
          width={anchoDetalle}
          titulo={`${producto.data.descripcion}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="producto.buffer" disabled={!editable} schema={schema}>
            <Box>
              <QSection
                title="Producto"
                actionPrefix={"producto"}
                alwaysInactive={!editable}
                dynamicComp={() => (
                  <Field.Schema
                    id={`producto.buffer.descripcion`}
                    schema={schema}
                    label=""
                    fullWidth
                    autoFocus
                  />
                )}
                saveDisabled={() => !schema.isValid(producto)}
              >
                <Box display="flex" alignItems="center">
                  <Typography variant="h5">{producto.buffer.descripcion}</Typography>
                </Box>
              </QSection>
            </Box>
          </QModelBox>
          <img
            src="https://www.guiaverde.com/files/plant/15062011184609_abelia-grandiflora-x-francis-mason123133.jpg"
            // width='160'
            // alt={item.title}
            loading="lazy"
          />
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default Producto;
