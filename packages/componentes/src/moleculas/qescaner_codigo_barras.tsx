import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from "../atomos/qicono.tsx";
import "./qescaner_codigo_barras.css";

export type QEscanerCodigoBarrasProps = {
  onDetectar: (valor: string) => void;
  onError?: (error: unknown) => void;
};

// El padre decide cuándo se muestra/oculta (montando o desmontando este
// componente), igual que el resto de modales/paneles del repo — así la
// cámara se libera sola al desmontar, sin necesitar un prop "abierto".
export const QEscanerCodigoBarras = ({
  onDetectar,
  onError,
}: QEscanerCodigoBarrasProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlesRef = useRef<IScannerControls | null>(null);
  const onDetectarRef = useRef(onDetectar);
  const onErrorRef = useRef(onError);
  const [camara, setCamara] = useState<"environment" | "user">("environment");
  const [flashActivo, setFlashActivo] = useState(false);

  useEffect(() => {
    onDetectarRef.current = onDetectar;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let cancelado = false;
    setFlashActivo(false);

    const lector = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanSuccess: 1000,
    });

    lector
      .decodeFromConstraints(
        { video: { facingMode: camara } },
        videoRef.current!,
        (resultado) => {
          if (resultado) {
            onDetectarRef.current(resultado.getText());
          }
        }
      )
      .then((controles) => {
        if (cancelado) {
          controles.stop();
          return;
        }
        controlesRef.current = controles;
      })
      .catch((error) => {
        onErrorRef.current?.(error);
      });

    return () => {
      cancelado = true;
      controlesRef.current?.stop();
      controlesRef.current = null;
    };
  }, [camara]);

  const alternarFlash = async () => {
    const controles = controlesRef.current;
    if (!controles?.switchTorch) return;

    try {
      await controles.switchTorch(!flashActivo);
      setFlashActivo(!flashActivo);
    } catch (error) {
      // El flash no está soportado en este dispositivo/navegador — se
      // avisa por si el consumidor quiere mostrar algo, pero no rompe el
      // resto del escáner.
      onErrorRef.current?.(error);
    }
  };

  const cambiarCamara = () => {
    setCamara((actual) => (actual === "environment" ? "user" : "environment"));
  };

  return (
    <div className="QEscanerCodigoBarras">
      <video
        ref={videoRef}
        className="QEscanerCodigoBarras-video"
        muted
        playsInline
      />
      <div className="botones maestro-botones QEscanerCodigoBarras-botones">
        <QBoton variante="borde" tamaño="pequeño" onClick={alternarFlash}>
          <QIcono nombre={flashActivo ? "flash" : "flash_off"} tamaño="sm" />
        </QBoton>
        <QBoton variante="borde" tamaño="pequeño" onClick={cambiarCamara}>
          <QIcono nombre="camara_girar" tamaño="sm" />
        </QBoton>
      </div>
    </div>
  );
};
