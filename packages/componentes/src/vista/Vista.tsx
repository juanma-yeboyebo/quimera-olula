import { PropsWithChildren, useCallback, useState } from "react";
// import { Contexto, ContextoSet } from "@olula/lib/contexto.ts";
import { ContextoError, Intentar, QError } from "@olula/lib/contexto.ts";
import { Outlet } from "react-router";

// import { Entidad } from "@olula/lib/diseño.ts";
import { QModal } from "../moleculas/qmodal.tsx";
import { Plantilla } from "../plantilla/Plantilla.tsx";
import { Slot } from "../slot/Slot.tsx";

export const Vista = ({ children }: PropsWithChildren<object>) => {
  const slots = { hijos: children };

  const [error, setError] = useState<QError | null>(null);

  const intentar: Intentar = useCallback(
    async (f, onError) => {
      try {
        const result = await f();
        return result;
      } catch (error) {
        const apiError = error as QError;
        const errorJS = error as Error;
        console.log("apiError", apiError);
        setError({
          nombre: apiError.nombre ?? "Error",
          descripcion: apiError.descripcion ?? errorJS.message,
        });
        if (onError) {
          onError(error);
        }
        throw error;
      }
    },
    [setError]
  );

  const contenido = children ?? <Outlet />;

  return (
    <ContextoError.Provider value={{ error, setError, intentar }}>
      <Slot nombre="contenido" {...slots}>
        <Plantilla>{contenido}</Plantilla>
      </Slot>

      <QModal
        nombre="error"
        abierto={error !== null}
        onCerrar={() => setError(null)}
        titulo={error?.nombre}
      >
        <p>{error?.descripcion}</p>
      </QModal>
    </ContextoError.Provider>
  );
};

// export const SubVista = <T extends Entidad>({
//   children,
// }: PropsWithChildren<object>) => {
//   // const slots = { hijos: children };

//   const [entidades, setEntidades] = useState<T[]>([]);
//   const [seleccionada, setSeleccionada] = useState<T | null>(null);

//   return (
//     <Contexto.Provider
//       value={{
//         entidades,
//         setEntidades: setEntidades as ContextoSet<Entidad[]>,
//         seleccionada,
//         setSeleccionada: setSeleccionada as ContextoSet<Entidad | null>,
//       }}
//     >
//       {children}
//     </Contexto.Provider>
//   );
// };
