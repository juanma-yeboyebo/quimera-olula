import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { Articulo } from "#/almacen/comun/componentes/Articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Caja } from "../../diseño.ts";
import { cajaVacia, metaCaja } from "../../dominio.ts";
import { getCaja, patchCaja, postLineaCaja } from "../../infraestructura.ts";
import { BorrarCaja } from "./BorrarCaja.tsx";
import "./DetalleCaja.css";

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

const titulo = (caja: Entidad) => caja.codigo_almacen as string;

export const DetalleCaja = ({
  cajaInicial = null,
  publicar = () => {},
}: {
  cajaInicial?: Caja | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const [valor, setValor] = useState("");
  const [cantidad, setCantidad] = useState("0");
  const { intentar } = useContext(ContextoError);

  const onChangeValor = (
    opcion: { valor: string; descripcion: string } | null
  ): void => {
    setValor(opcion?.valor ?? "");
  };

  const onChangeCantidad = (nuevoValor: string): void => {
    setCantidad(nuevoValor);
  };

  const crear = async () => {
    console.log("Crear transferencia de caja con:", { valor, cantidad });
    await intentar(() => postLineaCaja(modelo, valor, cantidad));
  };

  const caja = useModelo(metaCaja, cajaVacia);
  const { modelo, uiProps, init } = caja;

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
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <div className="DetalleCaja">
            <Tabs
              children={[
                <Tab key="general" label="general">
                  <div className="transferencia-caja">
                    <quimera-formulario>
                      <Articulo
                        label="Artículo"
                        valor={valor}
                        onChange={onChangeValor}
                        nombre="referencia_transferencia"
                      />
                      <QInput
                        label="Cantidad"
                        tipo="numero"
                        valor={cantidad}
                        onChange={onChangeCantidad}
                        nombre="cantidad_transferencia"
                      />
                    </quimera-formulario>
                    <div className="botones maestro-botones ">
                      <QBoton onClick={crear} deshabilitado={false}>
                        Guardar
                      </QBoton>
                    </div>
                  </div>
                </Tab>,
                <Tab key="datos" label="Datos">
                  <quimera-formulario>
                    <QInput label="Código" {...uiProps("id")} />
                    <Almacen
                      label="Almacen"
                      {...caja.uiProps("codigo_almacen", "codigo_almacen")}
                    />
                  </quimera-formulario>
                </Tab>,
              ]}
            ></Tabs>
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
