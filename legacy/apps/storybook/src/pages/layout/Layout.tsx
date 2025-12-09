import { Link, Outlet } from "react-router-dom";
import { Container } from "@quimera/atomic-comps/style/container/Container";

export const Layout = () => {
  return (
    <Container>
      <Link to="/">Inicio</Link>
      <Outlet />
      <Link to="/">Volver</Link>
    </Container>
  );
};
