import { Articulo } from "#/almacen/comun/componentes/Articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback, useEffect, useState } from "react";
import { getTallasArticulo, TallaArticulo } from "../articulo.ts";
import { postLineaPorBarcode } from "../infraestructura.ts";
import "./CrearLinea.css";

export type CrearLineaProps = {
  ventaId: string;
  publicar: ProcesarEvento;
};

// En El Ganso el código de barras real de una línea depende de la talla
// (tabla atributosarticulos): tras elegir el artículo hace falta elegir
// también la talla, salvo que el artículo no tenga variantes (entonces se
// usa el código de barras del propio artículo).
export const CrearLinea = ({ ventaId, publicar }: CrearLineaProps) => {
  const [referencia, setReferencia] = useState<string | null>(null);
  const [descripcionArticulo, setDescripcionArticulo] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState("1");
  const [tallas, setTallas] = useState<TallaArticulo[]>([]);
  const [codbarrasSimple, setCodbarrasSimple] = useState<string | null>(null);
  const [tallaElegida, setTallaElegida] = useState("");

  useEffect(() => {
    setTallas([]);
    setCodbarrasSimple(null);
    setTallaElegida("");

    if (!referencia) return;

    getTallasArticulo(referencia).then((respuesta) => {
      setTallas(respuesta.tallas);
      setCodbarrasSimple(respuesta.codbarras);
    });
  }, [referencia]);

  const barcode = tallas.length
    ? tallas.find((t) => t.talla === tallaElegida)?.barcode
    : codbarrasSimple;

  const valido =
    !!referencia && Number(cantidad) > 0 && !!barcode && (tallas.length === 0 || !!tallaElegida);

  const crear_ = useCallback(async () => {
    await postLineaPorBarcode(ventaId, {
      barcode: barcode!,
      cantidad: Number(cantidad),
    });
    publicar("alta_linea_lista");
  }, [ventaId, barcode, cantidad, publicar]);

  const cancelar_ = useCallback(() => publicar("crear_linea_cancelado"), [publicar]);

  const [crear, cancelar] = useForm(crear_, cancelar_);

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_venta_tpv"
      titulo="Crear línea"
      onCerrar={cancelar}
      anchoEstable
      pantallaCompletaMovil={false}
    >
      <div className="CrearLinea">
        <quimera-formulario>
          <Articulo
            valor={referencia ?? ""}
            descripcion={descripcionArticulo ?? ""}
            nombre="referencia_nueva_linea_venta"
            onChange={(opcion) => {
              setReferencia(opcion?.valor ?? null);
              setDescripcionArticulo(opcion?.descripcion ?? null);
            }}
          />
          {tallas.length > 0 && (
            <QSelect
              label="Talla"
              nombre="talla_nueva_linea_venta"
              valor={tallaElegida}
              opciones={tallas.map((t) => ({ valor: t.talla, descripcion: t.talla }))}
              onChange={(opcion) => setTallaElegida(opcion?.valor ?? "")}
            />
          )}
          <QInput
            label="Cantidad"
            nombre="cantidad_nueva_linea_venta"
            valor={cantidad}
            onChange={setCantidad}
          />
        </quimera-formulario>
        <div className="botones">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
