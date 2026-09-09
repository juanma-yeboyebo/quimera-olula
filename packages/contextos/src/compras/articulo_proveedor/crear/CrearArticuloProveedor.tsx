import { Proveedor } from "#/compras/comun/componentes/proveedor.tsx";
import { Divisa } from "#/comun/componentes/divisa.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { metaNuevoArticuloProveedor, nuevoArticuloProveedorVacio } from "../dominio.ts";
import { postArticuloProveedor } from "../infraestructura.ts";
import "./CrearArticuloProveedor.css";

export const CrearArticuloProveedor = ({
  articuloId,
  publicar,
}: {
  articuloId: string;
  publicar: EmitirEvento;
}) => {
  const inicial = useMemo(
    () => nuevoArticuloProveedorVacio(articuloId),
    [articuloId]
  );

  const { modelo, uiProps, valido } = useModelo(
    metaNuevoArticuloProveedor,
    inicial
  );

  const crear_ = useCallback(async () => {
    const id = await postArticuloProveedor(modelo);
    publicar("precio_creado", id);
  }, [modelo, publicar]);

  const cancelar_ = useCallback(
    () => publicar("alta_de_precio_cancelada"),
    [publicar]
  );

  const [crear, cancelar] = useForm(crear_, cancelar_);

  return (
    <QModal
      abierto={true}
      nombre="crear_articulo_proveedor"
      titulo="Nuevo proveedor del artículo"
      onCerrar={cancelar}
    >
      <div className="CrearArticuloProveedor">
        <quimera-formulario>
          <Proveedor {...uiProps("proveedorId", "proveedor")} />
          <QInput label="Coste" {...uiProps("coste")} />
          <Divisa {...uiProps("divisaId")} />
          <QInput label="% Dto." {...uiProps("dto")} />
          <QInput label="Ref. proveedor" {...uiProps("refProveedor")} />
          <QInput label="Plazo (días)" {...uiProps("plazo")} />
          <QInput label="Uds. embalaje" {...uiProps("uniEmbalaje")} />
          <QCheckbox
            label="Requiere embalajes"
            {...uiProps("requiereEmbalajes")}
          />
        </quimera-formulario>
      </div>
      <div className="botones maestro-botones">
        <QBoton onClick={crear} deshabilitado={!valido}>
          Crear
        </QBoton>
      </div>
    </QModal>
  );
};
