import { useOnlineStatus } from "quimera/hooks";
import { API } from "quimera/lib";
import { useEffect } from "react";

import { TpvDb } from "../lib";

const SYNC_INTERVAL = 60_000;
const SYNC_LIMIT = 3;

function TpvSync({ onSyncVentas }) {
  const isOnline = useOnlineStatus();

  const setVentasSincro = ventasNoSincro => {
    const filter = venta => Object.keys(ventasNoSincro).includes(venta.key);

    return TpvDb.setVentasSincronizadas(filter);
  };

  const onSyncVentasSucceeded = ventasNoSincro => {
    ventasNoSincro = setVentasSincro(ventasNoSincro);
    onSyncVentas && onSyncVentas(ventasNoSincro);
  };

  const syncVentas = () => {
    const ventasNoSincro = TpvDb.getVentasNoSincro(SYNC_LIMIT);

    Object.keys(ventasNoSincro).length &&
      API("tpv_ventasoffline")
        .post(ventasNoSincro)
        .success(() => onSyncVentasSucceeded(ventasNoSincro))
        .error(() => console.error("Fallo en TPV/syncVentas"))
        .go();
  };

  useEffect(() => {
    const ventasTimer = setInterval(isOnline && syncVentas, SYNC_INTERVAL);

    return () => clearInterval(ventasTimer);
  }, [syncVentas, isOnline]);

  return <></>;
}

export default TpvSync;
