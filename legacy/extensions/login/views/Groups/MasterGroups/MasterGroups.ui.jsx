import { Box, QBox, QListItem } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";

function MasterGroups() {
  const [{ groups }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const botones = [
    {
      id: "nuevoGrupo",
      icon: "add_circle",
      text: "Nuevo Grupo",
    },
  ];

  return (
    <Quimera.Template id="MasterGroups">
      <Box width={anchoDetalle}>
        <QBox titulo="Grupos" botones={botones}>
          <List>
            {Object.values(groups.dict ?? {})
              ?.filter(group => group.id !== "nuevo")
              ?.map(group => (
                <QListItem
                  key={group.id}
                  onClick={() =>
                    dispatch({
                      type: "onGroupsClicked",
                      payload: { item: group },
                    })
                  }
                  selected={group.id === groups.current}
                  avatar={{
                    content: group.descripcion?.[0],
                  }}
                  tl={group.descripcion}
                  bl={group.id}
                />
              ))}
          </List>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterGroups;
