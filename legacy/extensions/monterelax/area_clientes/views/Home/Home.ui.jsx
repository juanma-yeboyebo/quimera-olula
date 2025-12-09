import "./homeStyle.css";

import { AppMenu, Box, Container } from "@quimera/comps";
import Quimera, { PropValidation, useAppValue, util } from "quimera";

function Home() {
  const [{ menus }] = useAppValue();
  const baseImageSrc = util.getEnvironment().getUrlImages();

  return (
    <Quimera.Template id="Home">
      <Box className="contenedorFondo">
        <img
          src={`${baseImageSrc}/fondo.jpg`}
          alt="Fondo pantalla welcome"
          loading="lazy"
          className="imagenFondo"
        />

        <Container maxWidth="md" className="container containerSuperpuesto">
          <Box className="capaFondo">
            <AppMenu structure={menus?.app} />
          </Box>
        </Container>
      </Box>
    </Quimera.Template>
  );
}

export default Home;
