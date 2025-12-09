import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Caja } from "../../diseño.ts";
import { cajaVacia, metaCaja } from "../../dominio.ts";
import { getCaja, patchCaja } from "../../infraestructura.ts";
import { BorrarCaja } from "./BorrarCaja.tsx";
import "./DetalleCaja.css";
import { MovimientoCajaLista } from "./Movimientos.tsx";

type Estado = "Editando" | "Borrando";
type Contexto = Record<string, unknown>;
const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Editando",
    contexto: {},
  },
  estados: {
    Editando: {
      borrar: "Borrando",
      caja_guardada: ({ publicar }) => publicar("caja_guardada"),
      cancelar_seleccion: ({ publicar }) => publicar("seleccion_cancelada"),
    },
    Borrando: {
      borrado_cancelado: "Editando",
      caja_borrada: ({ publicar }) => publicar("caja_borrada"),
    },
  },
};

const titulo = (caja: Entidad) => ("Caja " + caja.id) as string;

export const DetalleCaja = ({
  cajaInicial = null,
  publicar = () => {},
}: {
  cajaInicial?: Caja | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();

  const { intentar } = useContext(ContextoError);

  const caja = useModelo(metaCaja, cajaVacia);
  const { modelo, init } = caja;

  const guardar = async () => {
    await intentar(() => patchCaja(modelo.id, modelo));
    recargarCabecera();
    emitir("caja_guardada");
  };

  const cancelar = () => {
    init();
  };

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

  const recargarCabecera = async () => {
    const nuevaCaja = await intentar(() => getCaja(modelo.id));
    init(nuevaCaja);
    publicar("caja_cambiada", nuevaCaja);
  };

  const cajaId = cajaInicial?.id ?? params.id;

  return (
    <Detalle
      id={cajaId}
      obtenerTitulo={titulo}
      setEntidad={(accionInicial) => init(accionInicial)}
      entidad={modelo}
      cargar={getCaja}
      cerrarDetalle={() => publicar("seleccion_cancelada")}
    >
      {!!cajaId && (
        <>
          {/* <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div> */}
          <div className="DetalleCaja">
            <div className="transferencia-caja">
              <MovimientoCajaLista
                idCaja={cajaId}
                publicar={emitir}
                modelo={modelo}
              />
            </div>
          </div>
          {caja.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!caja.valido}>
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={cancelar}
                deshabilitado={!caja.modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarCaja
            publicar={emitir}
            activo={estado === "Borrando"}
            caja={modelo}
          />
        </>
      )}
    </Detalle>
  );
};
