import { AppMenu, Box, Container } from "@quimera/comps";
import Quimera, { PropValidation, useAppValue, useWidth } from "quimera";

function Home() {
  const [{ menus }] = useAppValue();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const style = !mobile
    ? { position: "absolute", bottom: "10px", padding: "0px 24%" }
    : { position: "absolute", bottom: "10px" };

  return (
    <Quimera.Template id="Home">
      <Container maxWidth="md" className="container">
        <AppMenu structure={menus?.app} />
      </Container>
      <Box style={style}>
        <img alt="Project logo" src="/img/logos-next-generation.png" style={{ maxWidth: "100%" }} />
      </Box>
    </Quimera.Template>
  );
}

export default Home;
