import { Cliente } from "@quimera-extension/base-ventas";
import { Box, Button, Container, Field } from "@quimera/comps";
import Quimera, { getSchemas, navigate, useStateValue, util } from "quimera";
import { ACL } from "quimera/lib";
import { useEffect } from "react";

import {
  ButtonContacto,
  FabButton,
  FieldTitle,
  FieldValue,
  ListEventos,
  ListTareas,
  ListTratos,
  MainBox,
  Note,
  SSQSection,
} from "../../comps";

function Contacto({ idContacto }) {
  const [
    {
      contacto,
      eventos,
      mostrarHistoricoTratos,
      mostrarHistoricoTareas,
      noEncontrado,
      notas,
      tratos,
      tareas,
    },
    dispatch,
  ] = useStateValue();

  const agente = util.getGlobalSetting("user_data")?.user?.agente?.toString();
  const isMKT =
    util.getUser()?.superuser ||
    util.getUser().group === "MKT" ||
    util.getUser().group === "Responsable de marketing";
  const tratosList = tratos.list
    .filter(trato => (!isMKT ? trato.codAgente === agente : true))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const tareasList = Object.values(tareas.dict ?? {})
    .filter(tarea => (!isMKT ? tarea.codAgente === agente : true))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map(tarea => tarea.idTarea);

  const schemaContacto = getSchemas()?.contacto;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idContacto,
      },
    });
  }, [idContacto]);

  if (noEncontrado) {
    return <Quimera.View id="RegNoEncontrado" />;
  }
  const tituloEventos =
    eventos?.list?.length > 0 ? `Eventos(${eventos?.list.length})` : "Sin participación en eventos";

  // const extraView = contacto.enlista ? (
  const disableUser = !contacto.enlista
    ? util.getUser()?.superuser ||
      util.getUser().group === "MKT" ||
      util.getUser().group === "Responsable de marketing"
      ? false
      : true
    : false;

  const puedoBorrar = () => !disableUser;

  console.log(disableUser);
  // console.log("mimensaje_contactoBuffer", contacto);

  const extraView = (
    <>
      {disableUser && <MainBox>El contacto no está asociado a tu lista</MainBox>}
      <MainBox>
        <SSQSection
          actionPrefix="telefono"
          dynamicComp={() => (
            <Field.Schema
              id="contactoBuffer.telefono"
              schema={schemaContacto}
              fullWidth
              disabled={disableUser}
            />
          )}
        >
          <Box w={1} display="flex" justifyContent="space-between">
            <FieldTitle>Teléfono:</FieldTitle>
            <FieldValue>{contacto?.telefono}</FieldValue>
          </Box>
        </SSQSection>
      </MainBox>
      <MainBox>
        <SSQSection
          actionPrefix="detalles"
          dynamicComp={desactivar => (
            <>
              <FieldTitle onClick={() => desactivar()}>+Detalles de contacto</FieldTitle>
              <Field.Schema
                id="contactoBuffer.direccion"
                schema={schemaContacto}
                fullWidth
                disabled={disableUser}
              />
              <Field.Schema
                id="contactoBuffer.codPostal"
                schema={schemaContacto}
                fullWidth
                disabled={disableUser}
              />
              <Cliente
                id="contactoBuffer.cliente"
                label="Cliente"
                fullWidth
                async
                disabled={disableUser}
              />
            </>
          )}
        >
          <FieldTitle>+Detalles de contacto</FieldTitle>
        </SSQSection>
      </MainBox>

      {ACL.can("contactos:revisar_contacto") && (
        <MainBox>
          <Field.CheckBox
            id="contactoBuffer.datosRevisados"
            label="Contacto revisado"
            checked={contacto.datosRevisados}
          />
        </MainBox>
      )}

      {puedoBorrar() && (
        <Box style={{ display: "flex", justifyContent: "center" }} my={2}>
          <Button
            id="borrarContacto"
            variant="outlined"
            color="primary"
            text="Borrar contacto"
            onClick={() =>
              dispatch({
                type: "onBorrarContactoClicked",
                payload: { codContacto: contacto.codContacto },
              })
            }
          />
        </Box>
      )}

      <MainBox>
        <FieldTitle>{tituloEventos}</FieldTitle>
        <ListEventos eventos={eventos} />
      </MainBox>
      <MainBox
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "stretch",
        }}
      >
        <ButtonContacto
          icon="phone_enabled"
          klass="error"
          disabled={!contacto?.telefono}
          onClick={() => (window.location.href = `tel://+34${contacto?.telefono}`)}
        />
        <ButtonContacto
          icon="mail"
          klass="success"
          disabled={!contacto?.email}
          onClick={() => (window.location.href = `mailto:${contacto?.email}`)}
        />
        <ButtonContacto
          icon="whatsapp"
          klass="success_alt"
          disabled={!contacto?.telefono}
          onClick={() => window.open(`https://wa.me/34${contacto?.telefono}`, "_blank")}
        />
      </MainBox>
      {!disableUser && (
        <>
          <MainBox>
            <FieldTitle>Tratos</FieldTitle>
            <Field.CheckBox
              id="mostrarHistoricoTratos"
              label="Mostrar histórico"
              checked={mostrarHistoricoTratos}
            />

            <ListTratos
              tratos={{
                ...tratos,
                list: tratosList,
              }}
            />
          </MainBox>
          <MainBox>
            <FieldTitle>Tareas</FieldTitle>
            <Field.CheckBox
              id="mostrarHistoricoTareas"
              label="Mostrar histórico"
              checked={mostrarHistoricoTareas}
            />

            <ListTareas
              tareas={{
                ...tareas,
                idList: tareasList,
                dict: tareasList
                  .map(key => tareas?.dict[key])
                  .reduce(
                    (accum, tarea) => ({
                      ...accum,
                      [tarea.idTarea]: tarea,
                    }),
                    {},
                  ),
              }}
            />
          </MainBox>
        </>
      )}
      <MainBox>
        <FieldTitle>Nota:</FieldTitle>
        <Field.Text
          id="nuevaNota"
          onEnter={() => dispatch({ type: "onNuevaNotaEnter" })}
          fullWidth
          disabled={disableUser}
          multiline
        />
      </MainBox>
      {[...notas?.list]?.reverse().map(nota => (
        <Note key={nota.texto} text={nota.texto} date={util.formatDate(nota.fecha)} />
      ))}
    </>
  );

  return (
    <Quimera.Template id="Contacto">
      <Container maxWidth="xs">
        <FabButton
          icon="add"
          text="Trato"
          onClick={() => navigate(`/ss/contacto/${idContacto}/trato/nuevo`)}
        />
        <MainBox title={contacto?.nombre ? contacto?.nombre : "SIN NOMBRE"} before={true}>
          <SSQSection
            actionPrefix="cabecera"
            dynamicComp={() => (
              <>
                <Field.Schema id="contactoBuffer.nombre" schema={schemaContacto} fullWidth />
                <Field.Schema
                  id="contactoBuffer.email"
                  schema={schemaContacto}
                  fullWidth
                  disabled
                />
              </>
            )}
          >
            <Box w={1} display="flex" justifyContent="space-between">
              <FieldTitle>Email:</FieldTitle>
              <FieldValue>{contacto?.email}</FieldValue>
            </Box>
          </SSQSection>
        </MainBox>
        {extraView}
      </Container>
    </Quimera.Template>
  );
}

export default Contacto;
