import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback, useEffect, useState } from "react";
import { getArticuloPorBarcode } from "../articulo.ts";
import { LineaVentaTpv } from "../diseño.ts";
import { patchCantidadLinea, postLineaPorBarcode } from "../infraestructura.ts";
import "./AnadirBolsas.scss";

export type AnadirBolsasProps = {
  ventaId: string;
  lineas: LineaVentaTpv[];
  publicar: ProcesarEvento;
};

// Artículos reales de bolsa de El Ganso (familia 0000ATEMP0000XX, talla
// única "TU") — no existe "bolsa grande" dada de alta como artículo, solo
// estas 3 (confirmado contra la ventana real de Eneboo). La Mediana es la
// que se usa por defecto (empieza en 1, el resto a 0), igual que en Eneboo.
const TIPOS_BOLSA = [
  { referencia: "0000ATEMP000082", barcode: "8445005499770", etiqueta: "Bolsa Pequeña" },
  { referencia: "0000ATEMP000083", barcode: "8445005499794", etiqueta: "Bolsa Mediana" },
  { referencia: "0000ATEMP000081", barcode: "8445005499763", etiqueta: "Porta Trajes" },
];

const CANTIDADES_POR_DEFECTO: Record<string, string> = {
  "0000ATEMP000082": "0",
  "0000ATEMP000083": "1",
  "0000ATEMP000081": "0",
};

export const AnadirBolsas = ({ ventaId, lineas, publicar }: AnadirBolsasProps) => {
  const [cantidades, setCantidades] = useState<Record<string, string>>(
    CANTIDADES_POR_DEFECTO
  );
  const [precios, setPrecios] = useState<Record<string, number>>({});

  useEffect(() => {
    TIPOS_BOLSA.forEach((tipo) => {
      getArticuloPorBarcode(tipo.barcode).then((articulo) =>
        setPrecios((prev) => ({ ...prev, [tipo.referencia]: articulo.pvp }))
      );
    });
  }, []);

  const valido = TIPOS_BOLSA.some(
    (tipo) => Number(cantidades[tipo.referencia] ?? 0) > 0
  );

  // Igual que al escanear un código de barras: si ya hay una línea de esa
  // bolsa en la venta, se suma cantidad en vez de crear otra línea.
  const anadir_ = useCallback(async () => {
    for (const tipo of TIPOS_BOLSA) {
      const cantidad = Number(cantidades[tipo.referencia] ?? 0);
      if (cantidad <= 0) continue;

      const lineaExistente = lineas.find((linea) => linea.barcode === tipo.barcode);
      if (lineaExistente) {
        await patchCantidadLinea(ventaId, lineaExistente, lineaExistente.cantidad + cantidad);
      } else {
        await postLineaPorBarcode(ventaId, {
          barcode: tipo.barcode,
          cantidad,
        });
      }
    }
    publicar("alta_linea_lista");
  }, [ventaId, lineas, cantidades, publicar]);

  const cancelar_ = useCallback(() => publicar("bolsas_cancelado"), [publicar]);

  const [anadir, cancelar] = useForm(anadir_, cancelar_);

  return (
    <QModal
      abierto={true}
      nombre="anadir_bolsas_venta_tpv"
      titulo="Bolsas"
      onCerrar={cancelar}
      anchoEstable
      pantallaCompletaMovil={false}
    >
      <div className="AnadirBolsas">
        <quimera-formulario>
          {TIPOS_BOLSA.map((tipo) => (
            <QInput
              key={tipo.referencia}
              label={
                tipo.referencia in precios
                  ? `${tipo.etiqueta} - ${formatearMoneda(precios[tipo.referencia], "EUR")}`
                  : tipo.etiqueta
              }
              nombre={`cantidad_bolsa_${tipo.referencia}`}
              tipo="numero"
              valor={cantidades[tipo.referencia] ?? "0"}
              onChange={(valor) =>
                setCantidades((prev) => ({ ...prev, [tipo.referencia]: String(valor ?? "") }))
              }
            />
          ))}
        </quimera-formulario>
        <div className="botones">
          <QBoton onClick={anadir} deshabilitado={!valido}>
            Añadir
          </QBoton>
          <QBoton onClick={cancelar} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
