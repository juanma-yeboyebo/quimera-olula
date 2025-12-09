import { Box, Dialog } from "@quimera/comps";
import { LinearProgress } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function AlbaranesVenta({ useStyles }) {
  const [{ cargandoTabla, albaranSeleccionado, modalFirmaVisible }, dispatch] = useStateValue();
  // const _c = useStyles()
  // const classes = useStyles()
  const width = useWidth();

  useEffect(() => {
    dispatch({ type: "onInit" });
  }, [dispatch]);

  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Albaranes venta" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  // const [{ recargarPaginaAlbaranesVenta }, appDispatch] = useAppValue()

  // useEffect(() => {
  //   if (recargarPaginaAlbaranesVenta) {
  //     dispatch({ type: 'cargaAlbaranesVenta', payload: { filtro: filtroAlbaranesVenta } })
  //     appDispatch({ type: 'setRecargarPaginaAlbaranesVenta', payload: { value: false } })
  //   }
  // }, [recargarPaginaAlbaranesVenta])

  return (
    <Quimera.Template id="AlbaranesVenta">
      {cargandoTabla ? <LinearProgress /> : null}
      <Dialog
        open={modalFirmaVisible}
        fullWidth
        maxWidth="md"
        fullScreen={width === "xs" || width === "sm"}
      >
        <Quimera.View
          id="FirmaAlbaran"
          initAlbaran={albaranSeleccionado}
          callbackCerrado={payload => dispatch({ type: "onCerrarFirmaAlbaran", payload })}
        />
      </Dialog>
      <Box mx={1}>
        <Box id="cajaFiltro" mt={5}>
          <Quimera.SubView id="AlbaranesVenta/CabeceraFiltro" />
        </Box>
        <Box id="listado">
          <Quimera.SubView id="AlbaranesVenta/ListadoMobile" />
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default AlbaranesVenta;
