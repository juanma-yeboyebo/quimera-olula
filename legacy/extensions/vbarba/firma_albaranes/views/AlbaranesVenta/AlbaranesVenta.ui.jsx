import { Box, Dialog, DialogContent, DialogTitle } from "@quimera/comps";
import { LinearProgress } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function AlbaranesVenta({ useStyles }) {
  const [
    { cargandoTabla, albaranSeleccionado, modalFirmaVisible, modalVistaEnviarAlbaran },
    dispatch,
  ] = useStateValue();
  // const _c = useStyles()
  // const classes = useStyles()
  const width = useWidth();
  const opcionesDocProp = {
    main: { tipo: "albaranescli_no_valorado", textoBoton: "Enviar" },
  };

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

  // console.log("mimensaje_albaranSeleccionado", albaranSeleccionado);

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
          callbackEnviaEmailProp={payload => dispatch({ type: "onCallbackEnviaEmail", payload })}
        />
      </Dialog>
      <Dialog
        open={modalVistaEnviarAlbaran}
        fullWidth
        maxWidth="md"
        fullScreen={width === "xs" || width === "sm"}
      >
        <DialogTitle id="form-dialog-title">
          <Box display={"flex"} justifyContent={"center"}>
            <Box className={"tituloModal"}>Envía el albarán por email</Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Quimera.View
            id="EnviarDocumentoEmail"
            opcionesDocProp={opcionesDocProp}
            idDocProp={albaranSeleccionado?.idAlbaran}
            codClienteProp={albaranSeleccionado?.codCliente}
            callbackCerradoProp={payload =>
              dispatch({ type: "onCancelEnviarEmailClicked", payload })
            }
            callbackEnviadoProp={payload => dispatch({ type: "onEmailEnviado", payload })}
          />
        </DialogContent>
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
