import { Box, QBox, QListItem } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";

function MasterTiposTrato() {
  const [{ tipostrato }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const botones = [
    {
      id: "nuevoTipoTrato",
      icon: "add_circle",
      text: "Nuevo tipo de trato",
    },
  ];

  return (
    <Quimera.Template id="MasterTiposTrato">
      <Box width={anchoDetalle}>
        <QBox titulo="Tipos de trato" botones={botones}>
          <List>
            {Object.values(tipostrato.dict)
              .filter(tipoTrato => tipoTrato.id !== "nuevo")
              .map(tipoTrato => (
                <QListItem
                  key={tipoTrato.id}
                  onClick={() =>
                    dispatch({
                      type: "onTipostratoClicked",
                      payload: { item: tipoTrato },
                    })
                  }
                  selected={tipoTrato.id === tipostrato.current}
                  avatar={{
                    content: tipoTrato.tipo[0],
                  }}
                  tl={tipoTrato.tipo}
                // bl={`Tipo de trato #${tipoTrato.id}`}
                />
              ))}
          </List>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterTiposTrato;
