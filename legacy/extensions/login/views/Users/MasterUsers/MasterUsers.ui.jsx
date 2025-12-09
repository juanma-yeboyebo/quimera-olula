import { Box, QBox, QListItem } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";

function MasterUsers() {
  const [{ users }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const botones = [
    {
      id: "nuevoUsuario",
      icon: "add_circle",
      text: "Nuevo Usuario",
    },
  ];

  return (
    <Quimera.Template id="MasterUsers">
      <Box width={anchoDetalle}>
        <QBox titulo="Usuarios" botones={botones}>
          <List>
            {Object.values(users.dict)
              .filter(user => user.id !== "nuevo")
              .map(user => (
                <QListItem
                  key={user.id}
                  onClick={() =>
                    dispatch({
                      type: "onUsersClicked",
                      payload: { item: user },
                    })
                  }
                  selected={user.id === users.current}
                  avatar={{
                    content: user.nombre[0],
                  }}
                  tl={user.nombre}
                  bl={user.id}
                />
              ))}
          </List>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterUsers;
