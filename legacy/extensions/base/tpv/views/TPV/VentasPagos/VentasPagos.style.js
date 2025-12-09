export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      avatar: {
        backgroundColor: `${theme.palette.success.main}`,
        marginRight: "10px",
      },
      card: {
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
      },
      botonesPago: {
        color: "black",
        fontSize: "100px",
      },
      botonesMonedas: {
        padding: "0px",
      },
      botonesBilletes: {
        padding: "0px",
      },
    };
  };
};
