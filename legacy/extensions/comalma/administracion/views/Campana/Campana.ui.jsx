import {
  Box,
  Button,
  Field,
  Grid,
  QBox,
  QBoxButton,
  QListModel,
  QModelBox,
  QSection,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { ListItemComercio } from "../../comps";

function Campana({ callbackChanged, idCampana, initCampana, useStyles }) {
  const [{ campana, status, vistaDetalle, comercios }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(campana.event, callbackChanged);
  }, [campana.event.serial]);

  useEffect(() => {
    !!initCampana &&
      dispatch({
        type: "onInitCampana",
        payload: {
          initCampana,
          callbackChanged,
        },
      });
    !initCampana &&
      !!idCampana &&
      dispatch({
        type: "onInitCampanaById",
        payload: {
          idCampana,
          callbackChanged,
        },
      });
  }, [initCampana, idCampana]);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().campanas;
  const editable = true;

  if ((!initCampana && !idCampana) || initCampana?._status === "deleted") {
    return null;
  }

  if (idCampana && !campana.data.idCampana) {
    return null;
  }

  return (
    <Quimera.Template id="Campana">
      {campana && (
        <QBox
          width={anchoDetalle}
          titulo={`${campana.data.nombre}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteCampana"
                title="Borrar campaña"
                icon="delete"
                disabled={!editable}
              />
            </>
          }
        >
          <Grid container>
            <QModelBox id="campana.buffer" disabled={!editable} schema={schema}>
              <Grid item /* justify='center' */ xs={12} sm={12} md={12}>
                <QSection
                  title="Nombre"
                  actionPrefix="campana.buffer/idCampana"
                  alwaysInactive={!editable}
                  dynamicComp={() => (
                    <Box width={1}>
                      <Field.Text
                        id="campana.buffer.nombre"
                        label=""
                        fullWidth
                        autoComplete="off"
                        onClick={event => event.target.select()}
                      />
                    </Box>
                  )}
                >
                  <Box display="flex">
                    <Typography variant="body1">{campana.buffer.nombre || "Sin Nombre"}</Typography>
                  </Box>
                </QSection>
              </Grid>

              <Grid item container xs={12} sm={12} md={12} justifyContent="space-between">
                <Box width={0.3}>
                  <QSection
                    title="Fecha Inicio"
                    actionPrefix="campana.buffer/idCampana"
                    alwaysInactive={!editable}
                    dynamicComp={() => (
                      <Box md={6}>
                        <Field.Date
                          id="campana.buffer.fechaInicio"
                          label=""
                          fullWidth
                          autoComplete="off"
                        />
                      </Box>
                    )}
                  >
                    <Box display="flex">
                      <Typography variant="body1">
                        {util.formatDate(campana.buffer.fechaInicio) || "Sin fecha inicio"}
                      </Typography>
                    </Box>
                  </QSection>
                </Box>
                <Box width={0.3}>
                  <QSection
                    title="Fecha Fin"
                    actionPrefix="campana.buffer/idCampana"
                    alwaysInactive={!editable}
                    dynamicComp={() => (
                      <Box>
                        <Field.Date
                          id="campana.buffer.fechaFin"
                          label=""
                          fullWidth
                          autoComplete="off"
                        />
                      </Box>
                    )}
                  >
                    <Box display="flex">
                      <Typography variant="body1">
                        {util.formatDate(campana.buffer.fechaFin) || "Sin fecha fin"}
                      </Typography>
                    </Box>
                  </QSection>
                </Box>
              </Grid>

              {/* <Grid item container xs={12} sm={12} md={12} justifyContent="space-between">
                <Box width={0.45}>
                  <QSection
                    title="Tope compras consumidor"
                    actionPrefix="campana.buffer/idCampana"
                    alwaysInactive={!editable}
                    dynamicComp={() => (
                      <Box md={2}>
                        <Field.Currency
                          id="campana.buffer.topeConsumidor"
                          label=""
                          fullWidth
                          autoComplete="off"
                          onClick={event => event.target.select()}
                        />
                      </Box>
                    )}
                  >
                    <Box display="flex" md={6}>
                      <Typography variant="body1">
                        {util.euros(campana.buffer.topeConsumidor || 0)}
                      </Typography>
                    </Box>
                  </QSection>
                </Box>
                <Box width={0.5}>
                  <QSection
                    title="Tope compras consumidor en comercio"
                    actionPrefix="campana.buffer/idCampana"
                    alwaysInactive={!editable}
                    dynamicComp={() => (
                      <Box>
                        <Field.Currency
                          id="campana.buffer.topeConsumidorComercio"
                          label=""
                          fullWidth
                          autoComplete="off"
                          onClick={event => event.target.select()}
                        />
                      </Box>
                    )}
                  >
                    <Box display="flex">
                      <Typography variant="body1">
                        {util.euros(campana.buffer.topeConsumidorComercio || 0)}
                      </Typography>
                    </Box>
                  </QSection>
                </Box>
              </Grid> */}
            </QModelBox>
          </Grid>
          <Box mt={6}>
            <Box width={1} display="flex" justifyContent="flex-end" mt={1}>
              <Button
                id="irAComerciosCampana"
                text={"Gestionar Establecimientos"}
                variant="outlined"
                color="primary"
                onClick={() => {
                  dispatch({
                    type: "irAComerciosCampana",
                    payload: { idCampana: campana.data.idCampana },
                  });
                }}
              // startIcon={<Icon>{editable ? "arrow_circle_down" : "arrow_circle_up"}</Icon>}
              />
            </Box>
            <QListModel
              data={comercios}
              title="Establecimientos"
              modelName="comercios"
              ItemComponent={ListItemComercio}
              itemProps={{
                variant: "section",
              }}
              disabled={false}
            />
          </Box>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default Campana;
