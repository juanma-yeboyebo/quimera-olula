import { AppMenu, Container } from "@quimera/comps";
import Quimera, { PropValidation, useAppValue } from "quimera";
import React, { useEffect } from "react";
import "./HomeAreaClientes.style.scss";

function HomeAreaClientes({ useStyles }) {
  // const [{}, dispatch] = useStateValue();
  // const _c = useStyles()

  // useEffect(() => {
  //   dispatch({
  //     type: "init",
  //   });
  // }, [dispatch]);
  const [{ menus }] = useAppValue();
  const areaClientes = { "areaClientes": menus.app.areaClientes };

  return (
    <Quimera.Template id="home">
      <Container maxWidth="md" className="container">
        <AppMenu structure={areaClientes} />
      </Container>
      {/* <br />
      <br />
      <Container maxWidth="md" className="container HomeAreaClientes">
        <Grid container className="HomeAreaClientesItems">
          <Grid item xs={8} sm={3} md={3} className="gridElement AreaClientesItem">
            <Box mx={1}>
              <Button
                className="AreaClientesItemButton"
                variant=""
                color=""
                startIcon={<Icon>person_outline</Icon>}
                size="large"
                href="/areaclientes/pedidos"
                fullWidth
              >
                Pedidos
              </Button>
            </Box>
          </Grid>

          <Grid item xs={8} sm={3} md={3} className="gridElement AreaClientesItem">
            <Box mx={1}>
              <Button
                className="AreaClientesItemButton"
                variant=""
                color=""
                startIcon={<Icon>person_outline</Icon>}
                size="large"
                href="/areaclientes/facturas"
                fullWidth
              >
                Facturas
              </Button>
            </Box>
          </Grid>

          <Grid item xs={8} sm={3} md={3} className="gridElement AreaClientesItem">
            <Box mx={1}>
              <Button
                className="AreaClientesItemButton"
                variant=""
                color=""
                startIcon={<Icon>person_outline</Icon>}
                size="large"
                href="/areaclientes/albaranes"
                fullWidth
              >
                Albaranes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <br /> */}
    </Quimera.Template>
  );
}

export default HomeAreaClientes;
