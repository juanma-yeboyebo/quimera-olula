import { PropsWithChildren, useEffect, useId, useRef } from "react";
import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from "../atomos/qicono.tsx";
import "./qmodal.css";

type QModalProps = {
  nombre: string;
  titulo?: string;
  abierto?: boolean;
  onCerrar?: () => void;
  pantallaCompletaMovil?: boolean;
};

export const QModal = ({
  nombre,
  titulo,
  abierto = false,
  onCerrar = () => {},
  pantallaCompletaMovil = true,
  children,
}: PropsWithChildren<QModalProps>) => {
  const refModal = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const cerradoPorEstadoRef = useRef(false);
  const attrs: Record<string, string> = { nombre };

  if (pantallaCompletaMovil) {
    attrs["data-pantalla-completa-movil"] = "";
  }

  if (titulo) {
    attrs["data-con-titulo"] = "";
  }

  useEffect(() => {
    const modal = refModal.current;
    if (!modal) return;

    if (!abierto) {
      cerradoPorEstadoRef.current = true;
      modal.close();
      return;
    }

    cerradoPorEstadoRef.current = false;
    modal.showModal();
  }, [abierto]);

  useEffect(() => {
    const modal = refModal.current;
    if (!modal) return;

    const manejarClose = () => {
      if (cerradoPorEstadoRef.current) {
        cerradoPorEstadoRef.current = false;
        return;
      }
      onCerrar?.();
    };

    const manejarClick = (e: MouseEvent, modal: HTMLDialogElement) => {
      if (!modal) return;

      if (e.target === modal) {
        return modal.close();
      }
    };

    modal.addEventListener("close", manejarClose);
    modal.addEventListener("click", (e) => manejarClick(e, modal));

    return () => {
      modal.removeEventListener("close", manejarClose);
      modal.removeEventListener("click", (e) => manejarClick(e, modal));
    };
  }, [onCerrar]);

  return (
    <quimera-modal {...attrs}>
      <dialog ref={refModal} aria-labelledby={titulo ? titleId : undefined}>
        <header>
          {titulo && <h2 id={titleId}>{titulo}</h2>}
          <form method="dialog">
            <QBoton
              tamaño="mediano"
              variante="texto"
              tipo="submit"
              props={{ "aria-label": "Cerrar modal", title: "Cerrar" }}
            >
              <QIcono nombre="cerrar" tamaño="sm" />
            </QBoton>
          </form>
        </header>
        <main>{children}</main>
      </dialog>
    </quimera-modal>
  );
};
