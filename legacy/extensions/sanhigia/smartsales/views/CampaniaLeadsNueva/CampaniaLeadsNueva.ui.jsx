import { Box, Field, Grid, Icon, IconButton, QBox, Typography, Wizard } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { QProductoOfertar } from "../../comps";

const canalesMkt = [
  { key: "Meta", value: "Meta (Facebook)" },
  { key: "AC", value: "Active Campaign" },
];

function CampaniaLeadsNueva({ callbackChanged, initCampaniaLeads }) {
  const [{ campaniaLeads }, dispatch] = useStateValue();
  const schema = getSchemas().campania;

  useEffect(() => {
    dispatch({
      type: "onInitCampaniaLeads",
      payload: {
        initCampaniaLeads: schema.load({}),
      },
    });
  }, [dispatch, schema, initCampaniaLeads]);

  return (
    <Quimera.Template id="CampaniaNueva">
      <Box display="flex" justifyContent="center">
        <QBox
          titulo="Nueva Campaña"
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <Wizard
            parentRef="campaniaLeads.buffer"
            schema={schema}
            action={{
              id: "crearCampaniaLeads",
              label: "Crear campaña",
            }}
            steps={[
              {
                title: "Datos generales",
                completed: campaniaLeads.buffer.nombre,
                dynamicComp: (
                  <>
                    <Field.Schema
                      id={`campaniaLeads.buffer.nombre`}
                      schema={schema}
                      label="Nombre"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>badge</Icon>}
                    />
                  </>
                ),
                staticComp: (
                  <Box display="flex" flexDirection="column">
                    <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                      <Icon>badge</Icon>
                      <Typography variant="h6">{campaniaLeads.buffer.nombre}</Typography>
                    </Box>
                  </Box>
                ),
              },
              {
                title: "Productos a ofertar",
                dynamicComp: (
                  <>
                    <QProductoOfertar
                      id="productoOfertar"
                      label="Productos a ofertar"
                      fullWidth
                      autoFocus
                      onClick={event => event.target.select()}
                    />
                    {(campaniaLeads.buffer.productosOfertar ?? []).map((producto, idx) => (
                      <Box key={producto?.referencia} display={"flex"} alignItems={"center"}>
                        <Box>
                          <IconButton
                            id="deleteChildProductosOfertar"
                            size="small"
                            onClick={() =>
                              dispatch({
                                type: "onDeleteChildProductosOfertarClicked",
                                payload: { index: idx },
                              })
                            }
                          >
                            <Icon>close</Icon>
                          </IconButton>
                        </Box>
                        <Grid container width={1} display={"flex"} alignItems={"center"}>
                          <Grid item xs={7}>
                            <span>{producto?.descripcion}</span>
                          </Grid>
                          <Grid
                            container
                            item
                            xs={5}
                            display={"flex"}
                            flexDirection="row"
                            alignItems={"center"}
                          >
                            <Grid item xs={5} style={{ paddingLeft: "10px" }}>
                              <Field.Int
                                id="productoOfertarList/cantidad"
                                index={idx}
                                label="Cantidad"
                                value={producto?.cantidad}
                                onClick={event => event.target.select()}
                              />
                            </Grid>
                            <Grid item xs={2} />
                            <Grid item xs={5}>
                              <Field.Currency
                                id="productoOfertarList/pvp"
                                index={idx}
                                label="Precio"
                                value={producto?.pvp}
                                onClick={event => event.target.select()}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </>
                ),
                staticComp: (
                  <>
                    {(campaniaLeads.buffer.productosOfertar ?? []).map(producto => (
                      <Box
                        key={producto?.referencia}
                        display="flex"
                        alignItems="center"
                        style={{
                          gap: "0.5rem",
                        }}
                      >
                        <Icon>label</Icon>
                        <Typography
                          variant="h6"
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            minWidth: "0",
                          }}
                        >
                          {producto?.cantidad} x {producto?.descripcion} -{" "}
                          {util.euros(producto?.pvp)}
                        </Typography>
                      </Box>
                    ))}
                  </>
                ),
                completed:
                  ["marketingDigital"].includes(campaniaLeads.buffer.tipo) ||
                  campaniaLeads.buffer.productosOfertar?.length,
              },
            ]}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default CampaniaLeadsNueva;
