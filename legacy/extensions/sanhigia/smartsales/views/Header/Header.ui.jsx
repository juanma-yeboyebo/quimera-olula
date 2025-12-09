import { Can } from "@quimera/comps";
import Quimera, { A } from "quimera";

export default function Header({ useStyles }) {
  const classes = useStyles();

  return (
    <Quimera.Template id="Header">
      <Quimera.Reference id="extraLogo" type="append">
        <Can rule="Dashboard:visit">
          <A href="/ss/dashboard">
            <img
              width="200px"
              src="/img/smartsales-logo.png"
              alt="SmartSales logo"
              className={classes.logo}
              style={{
                marginLeft: "-20px",
              }}
            />
          </A>
        </Can>
      </Quimera.Reference>
    </Quimera.Template>
  );
}
