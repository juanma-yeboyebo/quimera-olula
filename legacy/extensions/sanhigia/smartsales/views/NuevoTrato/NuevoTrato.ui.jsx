import {
  Box,
  Button,
  Container,
  Dialog,
  Field,
  Icon,
  IconButton,
  Typography,
} from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { CircularProgress } from "@quimera/thirdparty";
import { Familia } from "@quimera-extension/base-almacen";
import { Cliente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { ConfirmButton, Contacto, MainBox, TipoTrato } from "../../comps";

const useStyles = makeStyles(theme => ({
  button: {
    color: "white",
    backgroundColor: "#505050",
    width: "100%",
    height: "3.7rem",
    margin: "5px",
    borderRadius: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  circulo: {
    color: "white",
  },
}));

function NuevoTrato({
  codCliente,
  idContacto,
  idCampania,
  idTipoTrato,
  valorTrato,
  callbackCerrado,
}) {
  const [{ guardandoTrato, modalCrearContactoVisible, notasColaboracion, trato }, dispatch] =
    useStateValue();
  const classes = useStyles();
  const schemaTrato = getSchemas().trato;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        codCliente,
        idContacto,
        idCampania,
        callbackCerrado,
        idTipoTrato,
        valorTrato,
      },
    });
  }, [callbackCerrado, codCliente, idContacto, idCampania, idTipoTrato, valorTrato]);

  const algunaNotaVacia = () => {
    for (const nota of notasColaboracion) {
      if (!nota.contenido || nota.contenido === "") {
        return true;
      }
    }
  };

  const fechaYHoraValidas = () => {
    const ahora = new Date();
    const ayer = ahora.setDate(ahora.getDate() - 1);
    const fhAux = new Date(`${trato.fecha}T${trato.horaAlta}`);
    const fechaHoraTrato = fhAux.setDate(fhAux.getDate());
    if (fechaHoraTrato < ayer) {
      return false;
    }

    return true;
  };

  const puedoConfirmar = () =>
    fechaYHoraValidas()
      ? util.getUser().tratocolaboracion === trato.idTipotrato
        ? schemaTrato.isValid(trato) && !algunaNotaVacia()
        : schemaTrato.isValid(trato)
      : false;

  const todoslosclientes =
    util.getUser()?.superuser ||
      util.getUser().group === "MKT" ||
      util.getUser().group === "Responsable de marketing"
      ? true
      : false;

  return (
    <Quimera.Template id="NuevoTrato">
      <Container maxWidth="xs">
        <MainBox
          title="Crear trato"
          before={true}
          callbackCerrado={
            callbackCerrado ? payload => dispatch({ type: "onNuevoTratoGuardado", payload }) : null
          }
        >
          <Field.Schema id="trato.titulo" schema={schemaTrato} fullWidth />
          <Field.Schema id="trato.valor" schema={schemaTrato} fullWidth />
        </MainBox>
        <MainBox>
          <Field.Schema id="trato.fecha" schema={schemaTrato} fullWidth />
          <Field.Schema id="trato.horaAlta" label="Hora" schema={schemaTrato} fullWidth />
        </MainBox>
        <MainBox display="flex" flexDirection="column" alignItems="flex-end">
          <Cliente
            id="trato.cliente"
            label={`Cliente`}
            fullWidth
            async
            autoFocus
            todoslosagentes={todoslosclientes}
          />
          <Contacto
            id="trato.contacto"
            label="Contacto"
            codCliente={trato.cliente}
            fullWidth
            async
          />
          <Button
            id="crearNuevoContacto"
            text="Crear nuevo contacto"
            variant="text"
            color="primary"
          />
        </MainBox>
        <MainBox>
          <TipoTrato id="trato.idTipotrato" label="Tipo" schema={schemaTrato} fullWidth async />
        </MainBox>
        {util.getUser().tratocolaboracion === trato.idTipotrato && (
          <MainBox>
            <Typography variant="h6">Notas obligatorias</Typography>
            {notasColaboracion.map((nota, idx) => (
              <>
                <Typography variant="caption">{nota.titulo}</Typography>
                <Field.TextArea
                  key={idx}
                  id={`notaColaboracion${idx}`}
                  fullWidth
                  multiline
                  value={nota.contenido}
                  onChange={e =>
                    dispatch({
                      type: "onNotaColaboracionChanged",
                      payload: { index: idx, value: e.target.value },
                    })
                  }
                />
              </>
            ))}
          </MainBox>
        )}
        <MainBox>
          <Familia
            id="trato.codFamilia"
            label="Añade familias de producto"
            fullWidth
            filtroFamilias={
              trato?.familias?.length > 0
                ? ["codfamilia", "not_in", trato?.familias?.map(f => f.codfamilia)]
                : null
            }
          />
          <Box my={1}>
            {(trato?.familias ?? []).map(
              (familia, idx) =>
                !!familia && (
                  <Box key={familia?.codfamilia} display={"flex"} alignItems={"center"}>
                    <Box>
                      <IconButton
                        id="deleteChildFamiliaProducto"
                        size="small"
                        onClick={() =>
                          dispatch({
                            type: "onDeleteFamiliaProductoClicked",
                            payload: { indice: idx },
                          })
                        }
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          minWidth: "0",
                        }}
                      >
                        <span>{familia?.descripcion}</span>
                      </Typography>
                    </Box>
                  </Box>
                ),
            )}
          </Box>
        </MainBox>
        {guardandoTrato ? (
          <Box className={classes.button}>
            <CircularProgress className={classes.circulo} />
          </Box>
        ) : (
          <ConfirmButton id="confirmar" disabled={!puedoConfirmar()} />
        )}
      </Container>

      <Dialog open={modalCrearContactoVisible} fullWidth maxWidth="xs">
        <Quimera.View
          id="NuevoContacto"
          codCliente={trato.cliente}
          callbackCerrado={payload => dispatch({ type: "onCerrarCrearContacto", payload })}
        />
      </Dialog>
    </Quimera.Template>
  );
}

export default NuevoTrato;
