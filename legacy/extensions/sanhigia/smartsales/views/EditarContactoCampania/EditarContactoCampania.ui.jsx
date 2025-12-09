import { Box, Container, Field } from "@quimera/comps";
import { Cliente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { FieldTitle, FieldValue, MainBox, Note, SSQSection } from "../../comps";

function EditarContactoCampania({
  idContacto,
  idContactoCampania,
  callbackCerrado,
  refreshCallback,
}) {
  const [{ contacto, noEncontrado, notas, contactosPorCampania }, dispatch] = useStateValue();

  const agente = util.getGlobalSetting("user_data")?.user?.agente?.toString();

  const schemaContacto = getSchemas()?.contacto;
  const schemaContactoCampania = getSchemas()?.contactosPorCampania;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idContacto,
        callbackCerrado,
        idContactoCampania,
        refreshCallback,
      },
    });
  }, [idContacto, callbackCerrado, idContactoCampania, refreshCallback]);

  if (noEncontrado) {
    return <Quimera.View id="RegNoEncontrado" />;
  }
  // console.log(contactosPorCampania);

  const extraView = true ? (
    <>
      <MainBox>
        <SSQSection
          actionPrefix="cabecera"
          dynamicComp={() => (
            <>
              <Field.Schema id="contactoBuffer.nombre" schema={schemaContacto} fullWidth />
              <Field.Schema id="contactoBuffer.email" schema={schemaContacto} fullWidth disabled />
            </>
          )}
        >
          <Box w={1} display="flex" justifyContent="space-between">
            <FieldTitle>Email:</FieldTitle>
            <FieldValue>{contacto?.email}</FieldValue>
          </Box>
        </SSQSection>
      </MainBox>
      <MainBox>
        <SSQSection
          actionPrefix="telefono"
          dynamicComp={() => (
            <Field.Schema id="contactoBuffer.telefono" schema={schemaContacto} fullWidth />
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
          alwaysActive={true}
          dynamicComp={desactivar => (
            <>
              <FieldTitle onClick={() => desactivar()}>Detalles de contacto</FieldTitle>
              <Field.Schema id="contactoBuffer.direccion" schema={schemaContacto} fullWidth />
              <Field.Schema id="contactoBuffer.ciudad" schema={schemaContacto} fullWidth />
              <Field.Schema id="contactoBuffer.codPostal" schema={schemaContacto} fullWidth />
              <Cliente id="contactoBuffer.cliente" label="Cliente" fullWidth async />
            </>
          )}
        >
          <FieldTitle>Detalles de contacto</FieldTitle>
        </SSQSection>
      </MainBox>
      <MainBox>
        <SSQSection
          save={{
            display: "none",
          }}
          actionPrefix="Notas"
          dynamicComp={desactivar => (
            <>
              {[...notas?.list]?.reverse().map(nota => (
                <Note key={nota.texto} text={nota.texto} date={util.formatDate(nota.fecha)} />
              ))}
            </>
          )}
        >
          <FieldTitle>+Ver Notas</FieldTitle>
        </SSQSection>
      </MainBox>
    </>
  ) : (
    <MainBox>El contacto no está asociado a tu lista</MainBox>
  );

  return (
    <Quimera.Template id="EditarContactoCampania">
      <Container maxWidth="xs">
        {/* <FabButton
          icon="add"
          text="Trato"
          onClick={() => navigate(`/ss/contacto/${idContacto}/trato/nuevo`)}
        /> */}
        <MainBox
          title={contacto?.nombre || "algo"}
          before={true}
          callbackCerrado={
            callbackCerrado
              ? payload => dispatch({ type: "onEditarContactoGuardado", payload })
              : null
          }
        />
        {extraView}
      </Container>
    </Quimera.Template>
  );
}

export default EditarContactoCampania;
