import { useState } from "react";
import { QBoton } from "../atomos/qboton.tsx";
import "./qtarjeta_generica.css";

type QTarjetaGenericaProps = {
  mostrarTodo?: boolean;
  avatar?: React.ReactNode;
  arribaIzquierda?: React.ReactNode;
  arribaDerecha?: React.ReactNode;
  abajoIzquierda?: React.ReactNode;
  abajoDerecha?: React.ReactNode;
  expansion?: React.ReactNode;
};

export const QTarjetaGenerica = ({
  mostrarTodo = false,
  avatar,
  arribaIzquierda = <div></div>,
  arribaDerecha = <div></div>,
  abajoIzquierda = <div></div>,
  abajoDerecha = <div></div>,
  expansion,
}: QTarjetaGenericaProps) => {
  const [expandida, setExpandida] = useState(mostrarTodo);

  return (
    <article className="qtarjeta-generica" data-expandida={expandida}>
      <section className="qtarjeta-generica-principal">
        {avatar && (
          <section className="qtarjeta-generica-avatar">{avatar}</section>
        )}

        <section
          className="qtarjeta-generica-grid"
          aria-label="Campos prioritarios"
        >
          {arribaIzquierda ?? <div></div>}
          {arribaDerecha ?? <div></div>}
          {abajoIzquierda ?? <div></div>}
          {abajoDerecha ?? <div></div>}
        </section>
      </section>

      {expansion && (
        <footer className="qtarjeta-generica-footer">
          <QBoton
            tamaño="pequeño"
            variante="texto"
            onClick={(evento) => {
              evento.stopPropagation();
              setExpandida((estado) => !estado);
            }}
          >
            {expandida ? "Ver menos" : "Ver más"}
          </QBoton>
        </footer>
      )}

      {expandida && expansion}
    </article>
  );
};
