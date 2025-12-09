import { Box, Button, QListItem, Typography } from "@quimera/comps";
import { util } from "quimera";
import { useState } from "react";

import { ButtonContacto, CrearTrato } from ".";

const RecomBlockSubfamilia = item => (
  <QListItem
    key={item.codsubfamilia}
    title={item.descripcion}
    bl={item.descripcion}
    tl={item.codsubfamilia}
    tr={item.score ? `${(item.score * 100).toFixed(2)}%` : ""}
  />
);

const RecomBlockCliente = item => (
  <Box key={item.coditem + item.codDir} title={item.nombre} style={{ paddingBottom: "10px" }}>
    <Box
      width={1}
      display="flex"
      justifyContent="space-between"
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        gap: "1em",
      }}
    >
      <Box
        display="inline"
        style={{
          overflowX: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        <Typography
          component="span"
          variant="body1"
          color="textPrimary"
          style={{ fontWeight: 700, textOverflow: "ellipsis" }}
        >
          {item.nombre}
        </Typography>
      </Box>
      <Typography
        component="span"
        variant="body1"
        color="textPrimary"
        style={{ fontWeight: 700, textOverflow: "ellipsis" }}
      >
        {item.score ? `${(item.score * 100).toFixed(2)}%` : ""}
      </Typography>
    </Box>
    <p style={{ whiteSpace: "pre-line", margin: "5px 0 10px" }}>
      {util.buildAddress(item).join("\n").trim()}
    </p>
    <Box
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <ButtonContacto
        iconProps={{
          style: { width: "25px", height: "25px" },
          fontSize: "small",
        }}
        icon="phone_enabled"
        klass="error"
        disabled={!item?.telefono}
        onClick={() => (window.location.href = `tel://+34${item?.telefono}`)}
      />
      <ButtonContacto
        iconProps={{
          style: { width: "25px", height: "25px" },
          fontSize: "small",
        }}
        icon="mail"
        klass="success"
        disabled={!item?.email}
        onClick={() => (window.location.href = `mailto:${item?.email}`)}
      />
      <ButtonContacto
        iconProps={{
          style: { width: "25px", height: "25px" },
          fontSize: "small",
        }}
        icon="whatsapp"
        klass="success_alt"
        disabled={!item?.telefono}
        onClick={() => window.open(`https://wa.me/34${item?.telefono}`, "_blank")}
      />
    </Box>
  </Box>
);

const RecomBlockChild = item => {
  const [creandoTrato, setCreandoTrato] = useState(false);

  return (
    <Box key={`${item.parentref}_${item.codsubfamilia}_${item.idx}`}>
      <QListItem
        style={{ padding: "0 10px" }}
        title={item.articulo}
        tl={item.articulo}
        br={
          <Button
            id="crearTrato"
            variant="outlined"
            color="primary"
            disabled={false}
            onClick={e => setCreandoTrato(true)}
            style={{
              fontSize: "0.9em",
              padding: "0 5px",
              // display: 'flex',
              // alignItems: 'center',
            }}
          >
            CREAR TRATO
          </Button>
        }
        bl={item.parentref}
        tr={item.score ? `${(item.score * 100).toFixed(2)}%` : ""}
      >
        {creandoTrato && "HOLA"}
      </QListItem>
      {creandoTrato && (
        <CrearTrato
          tituloInicial={item.articulo}
          open={creandoTrato}
          cerrar={() => setCreandoTrato(false)}
        />
      )}
    </Box>
  );
};

const DetailsBlock = (parent, children, title) => {
  return (
    <details
      style={{
        paddingTop: "0",
        marginTop: "0",
        paddingBottom: "0",
        marginBottom: "0",
        borderBottom: "1px solid grey",
      }}
    >
      <summary style={{ listStyle: "none" }}>{parent}</summary>
      {children?.length ? (
        <>
          {title}
          {children}
        </>
      ) : (
        <p>Recomendación de {title.toLowerCase()} no disponible</p>
      )}
    </details>
  );
};

const RecomBlockMixed = item => {
  const subfamiliaBlock = sf => ({
    ...DetailsBlock(
      RecomBlockSubfamilia({ ...sf, score: null }),
      sf.products
        ?.sort((a, b) => b.score - a.score)
        .map((p, idx) => RecomBlockChild({ ...p, idx })),
      "Productos",
    ),
    key: sf.codsubfamilia,
  });

  const subfamilias = item.subfamilias
    // ?.sort((a, b) => b.score - a.score)
    ?.map(sf => subfamiliaBlock(sf));

  return DetailsBlock(RecomBlockCliente(item), subfamilias, "Subfamilias");
};

const blocks = {
  details: DetailsBlock,
  subfamilia: RecomBlockSubfamilia,
  cliente: RecomBlockCliente,
  child: RecomBlockChild,
  mixed: RecomBlockMixed,
};

export default function RecomBlock({ item, variant, productos }) {
  const parent = (blocks[variant] ?? (() => null))(item);
  const products = productos
    ?.sort((a, b) => b.score - a.score)
    ?.map((child, idx) => blocks.child({ ...child, idx }));

  return products ? blocks.details(parent, products, "Productos") : parent;
}
