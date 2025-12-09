import { Box, Icon, QSection, Typography } from "@quimera/comps";
import { Agente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue } from "quimera";

function DetalleUsers() {
  const [{ users }] = useStateValue();

  return (
    <Quimera.Template id="DetalleUsers">
      <Quimera.Reference id="extraDataUser" type="append">
        <QSection
          title="Supervisor"
          actionPrefix="supervisor"
          dynamicComp={() => <Agente id="usersBuffer.supervisor" fullWidth autoFocus />}
        >
          <Box display="flex" alignItems="center" m={1}>
            <Icon color="action" fontSize="default" style={{ marginRight: "5px" }}>
              supervisor_account
            </Icon>
            {users.dict[users.current]?.supervisor ? (
              <Agente id={`users.dict.${users.current}.supervisor`} estatico />
            ) : (
              <Typography variant="h5">Sin supervisor asignado</Typography>
            )}
          </Box>
        </QSection>
      </Quimera.Reference>
    </Quimera.Template>
  );
}

export default DetalleUsers;
