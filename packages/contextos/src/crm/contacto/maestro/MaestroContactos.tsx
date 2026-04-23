import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect, useState } from "react";
import { CrearContacto } from "../crear/CrearContacto.tsx";
import { DetalleContacto } from "../detalle/DetalleContacto.tsx";
import { Contacto } from "../diseño.ts";
import { metaTablaContacto } from "./maestro.ts";
import "./MaestroContactos.css";
import { getMaquina } from "./maquina.ts";

type Layout = "TABLA" | "TARJETA";

export const MaestroContactos = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    contactos: listaActivaEntidadesInicial<Contacto>(id, criteria),
  });

  useUrlParams(ctx.contactos.activo, ctx.contactos.criteria);

  useEffect(() => {
    emitir("recarga_de_contactos_solicitada", ctx.contactos.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const esMovil = useEsMovil();
  const [layout, setLayout] = useState<Layout>("TARJETA");

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  return (
    <div className="Contacto">
      <MaestroDetalle<Contacto>
        Maestro={
          <>
            <h2>Contactos</h2>
            {!esMovil && (
              <div className="maestro-botones">
                <QBoton
                  texto={
                    layout === "TARJETA"
                      ? "Cambiar a TABLA"
                      : "Cambiar a TARJETA"
                  }
                  onClick={cambiarLayout}
                />
              </div>
            )}

            <div className="maestro-botones">
              <QBoton onClick={() => emitir("creacion_de_contacto_solicitada")}>
                Nuevo
              </QBoton>
            </div>

            <Listado<Contacto>
              metaTabla={metaTablaContacto}
              criteria={ctx.contactos.criteria}
              modo={esMovil || layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaContacto}
              entidades={ctx.contactos.lista}
              totalEntidades={ctx.contactos.total}
              seleccionada={ctx.contactos.activo}
              onSeleccion={(payload) =>
                emitir("contacto_seleccionado", payload)
              }
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={
          <DetalleContacto id={ctx.contactos.activo} publicar={emitir} />
        }
        seleccionada={ctx.contactos.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearContacto publicar={emitir} />}
    </div>
  );
};

const TarjetaContacto = (contacto: Contacto) => {
  return (
    <QTarjetaGenerica
      avatar={<QAvatar nombre={contacto.nombre} />}
      arribaIzquierda={contacto.nombre}
      abajoIzquierda={contacto.email}
      abajoDerecha={contacto.telefono1}
    />
  );
};
