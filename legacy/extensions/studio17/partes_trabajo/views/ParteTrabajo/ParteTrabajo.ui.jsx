import {
  Box,
  Grid,
  QBox,
  QBoxButton,
  QListModel,
  QModelBox,
  QSection,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import { s17LineaParte } from "../../comps";

// import { QArticulo } from '@quimera-extension/base-almacen'

function ParteTrabajo({ callbackChanged, callbackGuardado, codParte, initParte, useStyles }) {
  const [{ lineas, parte, vistaDetalle }, dispatch] = useStateValue();
  const width = useWidth();
  const classes = useStyles();

  useEffect(() => {
    util.publishEvent(parte.event, callbackChanged);
  }, [parte.event.serial]);

  useEffect(() => {
    !!initParte &&
      dispatch({
        type: "onInitParte",
        payload: {
          initParte,
        },
      });
    !initParte &&
      !!codParte &&
      dispatch({
        type: "onInitParteById",
        payload: {
          filterParte: ["codparte", "eq", codParte],
        },
      });
  }, [initParte, codParte]);

  // Necesario para que no salte el useEffect de onInit en cada render de LineaPedidoCliNueva
  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const callbackFirmarParte = useCallback(
    payload => dispatch({ type: "onFirmarParteClicked", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().partesTrabajo;
  const editable = parte.data.estadoParte === "Borrador";

  const horas = parte.data.horas ? util.horasToHorasMins(parte.data.horas) : "00:00";
  const horasParte = parte.data.horasparte
    ? util.segundosToHorasMins(util.horasMinsSegsASegundos(parte.data.horasparte))
    : "00:00";

  if ((!initParte && !codParte) || initParte?._status === "deleted") {
    return null;
  }

  if (codParte && !parte.data.codParte) {
    return null;
  }

  return (
    <Quimera.Template id="ParteTrabajo">
      {parte && (
        <QBox
          width={anchoDetalle}
          titulo={
            <Box width={1} display="flex" justifyContent="space-between">
              <Box>{`Parte ${parte.data.codParte}${!editable ? `(${parte.data.estadoParte})` : ""
                }`}</Box>
            </Box>
          }
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteParte"
                title="Borrar parte"
                icon="delete"
                onClick={() =>
                  dispatch({ type: "onDeleteParteClicked", payload: { item: parte.codParte } })
                }
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          {vistaDetalle === "principal" ? (
            <Box>
              <QModelBox id="parte.buffer" disabled={!editable} schema={schema}>
                <Box width={1} display="flex" justifyContent="flex-end">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <QSection title={`Trabajador (${parte.data.trabajador})`} alwaysInactive>
                        <Typography variant="h5" className={classes.textoUnaLinea}>
                          {parte.data.nombreTrabajador}
                        </Typography>
                      </QSection>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <QSection title={`Fecha`} alwaysInactive>
                        <Typography variant="h5">{util.formatDate(parte.data.fecha)}</Typography>
                      </QSection>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <QSection title={`Horas`} alwaysInactive>
                        <Box display="flex">
                          <Typography
                            variant="h5"
                            className={horas === horasParte ? classes.success : classes.error}
                          >
                            {`${horas}`}
                          </Typography>
                          {parte.data.horasparte && (
                            <Typography variant="h5" className={classes.horasParte}>
                              {`/${horasParte}`}
                            </Typography>
                          )}
                        </Box>
                      </QSection>
                    </Grid>
                  </Grid>
                </Box>
                <Quimera.View
                  id="LineaParteNueva"
                  codParte={parte.data.codParte}
                  data={parte.data}
                  inline
                  callbackGuardada={callbackNuevaLinea}
                  callbackFirmarParte={callbackFirmarParte}
                  editable={editable}
                />
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={s17LineaParte}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={!editable}
                />
              </QModelBox>
            </Box>
          ) : (
            <Box width={1}>
              <Box width={1}></Box>
            </Box>
          )}
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default ParteTrabajo;
