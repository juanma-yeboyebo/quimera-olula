import "./homeStyle.css";

import { AppMenu, Container } from "@quimera/comps";
import Quimera, { PropValidation, useAppValue } from "quimera";

function Home() {
  const [{ menus }] = useAppValue();

  return (
    <Quimera.Template id="Home">
      <Container maxWidth="md" className="container">
        <AppMenu structure={menus?.app} />
      </Container>
    </Quimera.Template>
  );
}

export default Home;
