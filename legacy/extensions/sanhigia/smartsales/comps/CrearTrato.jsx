import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Field,
  Icon,
  LinearProgress,
  Typography,
} from "@quimera/comps";
import { getSchemas, navigate, useWidth } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

import { Contacto, TipoTrato } from ".";

export default function CrearTrato({ open, cerrar, tituloInicial }) {
  const estados = {
    pidiendoDatos: 1,
    creandoTrato: 2,
    errorCreacion: 3,
  };
  const [estado, setEstado] = useState(estados.pidiendoDatos);
  const [titulo, setTitulo] = useState(null);
  const [tipoTrato, setTipoTrato] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [valor, setValor] = useState(null);
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  useEffect(() => {
    setTitulo(tituloInicial);
  }, [tituloInicial]);

  const puedoCrear = estado == estados.pidiendoDatos && contacto && valor && tipoTrato;

  const handleClick_crear = e => {
    const schema = getSchemas().trato;
    API(schema.name)
      .post(
        schema.dump({
          titulo,
          valor,
          contacto,
          idTipotrato: tipoTrato,
        }),
      )
      .success(response => irATrato(response.pk))
      .error(() => setEstado(estados.errorCreacion))
      .go();
    setEstado(estados.creandoTrato);
  };

  const irATrato = idTrato => {
    navigate(`/ss/trato/${idTrato}`);
  };

  return (
    <Dialog open={open} fullScreen={mobile} fullWidth maxWidth="sm">
      <DialogTitle>Crear trato</DialogTitle>
      {(estado == estados.pidiendoDatos || estado == estados.creandoTrato) && (
        <Box mx={3}>
          <Field.Text
            id="titulo"
            value={titulo}
            onChange={event => {
              setTitulo(event.target.value);
            }}
            fullWidth
            label="Título del trato"
          />
          <TipoTrato
            id="tipotrato"
            value={tipoTrato}
            onChange={event => {
              setTipoTrato(event.target.value?.key ?? null);
            }}
            fullWidth
            label="Tipo de trato"
          />
          <Contacto
            id="contacto"
            value={contacto}
            onChange={event => setContacto(event.target.value?.key ?? null)}
            fullWidth
            label="Contacto"
          />
          <Field.Currency
            id="valor"
            value={valor}
            currency="€"
            onChange={event => {
              setValor(event.floatValue);
            }}
            fullWidth
            label="Importe"
          />
          {estado == estados.creandoTrato && <LinearProgress />}
        </Box>
      )}
      {estado == estados.errorCreacion && (
        <Box mx={3}>
          <Typography variant="body1">Ha habido un error en la creación del trato</Typography>
        </Box>
      )}
      <Box mx={3} mb={1} display="flex" justifyContent="space-between" mt={1}>
        <Button id="cerrar" onClick={cerrar} variant="text" startIcon={<Icon>close</Icon>}>
          Cerrar
        </Button>
        <Button
          id="crear"
          onClick={handleClick_crear}
          variant="text"
          color="primary"
          disabled={!puedoCrear}
          startIcon={<Icon>save_alt</Icon>}
        >
          CREAR TRATO
        </Button>
      </Box>
    </Dialog>
  );
}
