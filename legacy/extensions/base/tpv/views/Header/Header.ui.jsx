import { Avatar, Badge, Icon } from "@quimera/comps";
import Quimera, { PropValidation, useOnlineStatus } from "quimera";
import { useEffect, useState } from "react";

import { TpvDb } from "../../lib";

function Header() {
  const getVentasNoSincro = () => Object.keys(TpvDb.getVentasNoSincro() ?? {}).length;

  const [ventasNoSincro, setVentasNoSincro] = useState(getVentasNoSincro);
  const isOnline = useOnlineStatus();
  const errorLimit = 5;

  useEffect(() => {
    const timer = setInterval(() => setVentasNoSincro(getVentasNoSincro()), 2_000);

    return () => clearInterval(timer);
  }, [setVentasNoSincro, getVentasNoSincro]);

  return (
    <Quimera.Template id="Header">
      <Quimera.Reference id="extraAppBar" type="append">
        {!!ventasNoSincro && (
          <Badge
            invisible={!ventasNoSincro}
            color="primary"
            overlap="circle"
            badgeContent={ventasNoSincro}
            style={{
              marginRight: "10px",
              top: "0%",
              right: "0%",
            }}
          >
            <Avatar
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "transparent",
              }}
            >
              {!!isOnline && ventasNoSincro && ventasNoSincro < errorLimit && <Icon>sync</Icon>}
              {!!isOnline && ventasNoSincro >= errorLimit && <Icon>sync_problem</Icon>}
              {!isOnline && <Icon>sync_disabled</Icon>}
            </Avatar>
          </Badge>
        )}
      </Quimera.Reference>
    </Quimera.Template>
  );
}

export default Header;
