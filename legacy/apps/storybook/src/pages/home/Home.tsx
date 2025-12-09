import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <section>
      <h1>YeboYebo Design System</h1>
      <h3>Estilo</h3>
      <ul>
        <li>
          <Link to="/palette">Paleta de colores</Link>
        </li>
      </ul>
      <h3>Átomos</h3>
      <ul>
        <li>
          <Link to="/buttons">Botones</Link>
        </li>
        <li>
          <Link to="/labels">Etiquetas</Link>
        </li>
      </ul>
    </section>
  );
};
