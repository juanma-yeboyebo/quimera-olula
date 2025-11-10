import { Grupo } from "#/auth/comun/componentes/grupo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle, QDate, QModal } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Usuario } from "../../diseño";
import { metaUsuario, usuarioVacio } from "../../dominio";
import {
  generarTokenUsuario,
  getTokenUsuario,
  getUsuario,
  patchUsuario,
} from "../../infraestructura";
import { BorrarUsuario } from "./BorrarUsuario";
import "./DetalleUsuario.css";

type Estado = "editando" | "borrando" | "generar_token" | "consultar_token";
type Contexto = Record<string, Usuario>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "editando",
    contexto: {},
  },
  estados: {
    editando: {
      borrar: "borrando",
      generar_token: "generar_token",
      consultar_token: "consultar_token",
      usuario_guardado: ({ publicar }) => publicar("usuario_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "editando",
      usuario_borrado: ({ publicar }) => publicar("usuario_borrado"),
    },
    generar_token: {
      cancelar: "editando",
    },
    consultar_token: {
      cancelar: "editando",
    },
  },
};

const titulo = (usuario: Entidad) => usuario.id as string;

export const DetalleUsuario = ({
  usuarioInicial = null,
  emitir = () => {},
}: {
  usuarioInicial?: Usuario | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const usuarioId = usuarioInicial?.id ?? params.id;
  const { intentar } = useContext(ContextoError);

  const usuario = useModelo(metaUsuario, usuarioVacio);
  const { modelo, uiProps, init, modificado, valido } = usuario;

  const [emitirUsuario, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: emitir,
  });

  const [expiracion, setExpiracion] = useState("");
  const [tokenGenerado, setTokenGenerado] = useState<string | null>(null);

  // Expresión regular ISO: YYYY-MM-DD, opcionalmente T[HH:MM[:SS]]Z
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?Z)?$/;

  const validarExpiracion = (valor: string) => {
    if (!valor) return "";
    return isoRegex.test(valor)
      ? ""
      : "Formato inválido. Debe ser YYYY-MM-DDTHH:MMZ o YYYY-MM-DDTHH:MM:SSZ";
  };

  const onExpiracionChange = (valor: string) => {
    setExpiracion(valor);
  };

  const onGenerar = async () => {
    if (validarExpiracion(expiracion)) return;
    const token = await intentar(() =>
      generarTokenUsuario(modelo.id, expiracion)
    );
    setTokenGenerado(token);
    setExpiracion("");
  };

  const guardar = async () => {
    await intentar(() => patchUsuario(modelo.id, modelo));
    const usuario_guardado = await getUsuario(modelo.id);
    init(usuario_guardado);
    emitir("usuario_cambiado", usuario_guardado);
  };

  const abrirGenerarToken = () => {
    setTokenGenerado(null);
    emitirUsuario("generar_token");
  };

  const abrirConsultaToken = async () => {
    emitirUsuario("consultar_token");
    const token = await getTokenUsuario(modelo.id);
    setTokenGenerado(token);
  };

  // const acciones = [
  //   {
  //     texto: "Generar Token",
  //     onClick: () => abrirGenerarToken,
  //     deshabilitado: false,
  //   },
  //   {
  //     texto: "Consultar Token Refresco",
  //     onClick: abrirConsultaToken,
  //     deshabilitado: false,
  //   },
  //   {
  //     texto: "Borrar",
  //     onClick: () => emitirUsuario("borrar"),
  //     deshabilitado: false,
  //   },
  // ];

  return (
    <Detalle
      id={usuarioId}
      obtenerTitulo={titulo}
      setEntidad={(m) => init(m)}
      entidad={modelo}
      cargar={getUsuario}
      cerrarDetalle={() => emitir("seleccion_cancelada")}
    >
      {!!usuarioId && (
        <div className="DetalleUsuario">
          <div className="maestro-botones ">
            <QBoton onClick={abrirGenerarToken}>Generar Token</QBoton>
            <QBoton onClick={abrirConsultaToken}>Token Refresco</QBoton>
            <QBoton onClick={() => emitirUsuario("borrar")}>Borrar</QBoton>
            {/* <QuimeraAcciones acciones={acciones} vertical /> */}
          </div>

          <quimera-formulario>
            <QInput label="Nombre" {...uiProps("nombre")} />
            <QInput label="Email" {...uiProps("email")} />
            <Grupo {...uiProps("grupo_id")} />
          </quimera-formulario>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarUsuario
            emitir={emitirUsuario}
            activo={estado === "borrando"}
            usuario={modelo}
          />
          <QModal
            nombre="generarToken"
            abierto={estado === "generar_token"}
            onCerrar={() => {
              emitirUsuario("cancelar");
              setExpiracion("");
              setTokenGenerado(null);
            }}
          >
            <h2>Generar token refresco</h2>
            <QDate
              nombre="expiracion"
              label="Expiración"
              valor={expiracion}
              onChange={onExpiracionChange}
            />
            <div className="botones">
              <QBoton
                onClick={onGenerar}
                deshabilitado={!!validarExpiracion(expiracion)}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => {
                  emitirUsuario("cancelar");
                  setExpiracion("");
                  setTokenGenerado(null);
                }}
              >
                Cancelar
              </QBoton>
            </div>
            {tokenGenerado && (
              <div className="token-generado">
                <label htmlFor="token-generado">Token refresco generado</label>
                <textarea
                  id="token-generado"
                  className="token-textarea"
                  name="token"
                  value={tokenGenerado}
                  readOnly
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
              </div>
            )}
          </QModal>
          <QModal
            nombre="generarToken"
            abierto={estado === "consultar_token"}
            onCerrar={() => {
              emitirUsuario("cancelar");
              setExpiracion("");
              setTokenGenerado(null);
            }}
          >
            <h2>Token refresco</h2>
            {tokenGenerado && (
              <div className="token-generado">
                <textarea
                  id="token-generado"
                  className="token-textarea"
                  name="token"
                  value={tokenGenerado}
                  readOnly
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
              </div>
            )}
          </QModal>
        </div>
      )}
    </Detalle>
  );
};
