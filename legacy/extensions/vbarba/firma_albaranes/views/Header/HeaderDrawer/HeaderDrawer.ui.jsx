import { Divider, Drawer, Icon, IconButton } from "@quimera/comps";
import { List, ListItem, ListItemIcon, ListItemText } from "@quimera/thirdparty";
import Quimera, { A, useStateValue } from "quimera";

function HeaderDrawer() {
  const [, dispatch] = useStateValue();

  const cerrar = () => {
    dispatch({ type: "onAbrirDrawerClicked", payload: { data: { abierto: false } } });
  };

  return (
    <Quimera.Template id="HeaderDrawer">
      <Drawer role="presentation" variant="permanent">
        <div>
          <IconButton onClick={cerrar}>
            <Icon>chevron_left</Icon>
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key="producir">
            <ListItemIcon>
              <Icon>dashboard</Icon>
            </ListItemIcon>
            <ListItemText primary="PRODUCIR" />
          </ListItem>
          <A href="/tareas" onClick={cerrar}>
            <ListItem button key="tareas">
              <ListItemIcon>
                <Icon></Icon>
              </ListItemIcon>
              <ListItemText primary="Tareas" />
            </ListItem>
          </A>
          <A href="/notificaciones" onClick={cerrar}>
            <ListItem button key="bandeja">
              <ListItemIcon>
                <Icon></Icon>
              </ListItemIcon>
              <ListItemText primary="Bandeja de entrada" />
            </ListItem>
          </A>
          <Divider />
          <ListItem button key="planear">
            <ListItemIcon>
              <Icon>person</Icon>
            </ListItemIcon>
            <ListItemText primary="PLANEAR" />
          </ListItem>
          <ListItem button key="proyectos">
            <ListItemIcon>
              <Icon></Icon>
            </ListItemIcon>
            <ListItemText primary="Proyectos" />
          </ListItem>
          <ListItem button key="calendario">
            <ListItemIcon>
              <Icon></Icon>
            </ListItemIcon>
            <ListItemText primary="Calendario" />
          </ListItem>
          <Divider />
          <ListItem button key="analizar">
            <ListItemIcon>
              <Icon>person</Icon>
            </ListItemIcon>
            <ListItemText primary="ANALIZAR" />
          </ListItem>
          <ListItem button key="time_tracking">
            <ListItemIcon>
              <Icon></Icon>
            </ListItemIcon>
            <ListItemText primary="Time Tracking" />
          </ListItem>
          <ListItem button key="informe_individual">
            <ListItemIcon>
              <Icon></Icon>
            </ListItemIcon>
            <ListItemText primary="Informe individual" />
          </ListItem>
        </List>
      </Drawer>
    </Quimera.Template>
  );
}

export default HeaderDrawer;
