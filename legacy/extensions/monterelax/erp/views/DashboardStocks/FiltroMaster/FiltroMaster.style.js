export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        color: "black",
      },
      appBar: {
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(1, 1),
        border: "0px",
        boxShadow: "none",
      },
      yellowBox: {
        backgroundColor: theme.palette.warning.main,
        width: "25px",
        borderRadius: "4px",
      },
      greenBox: {
        backgroundColor: theme.palette.success.main,
        width: "25px",
        borderRadius: "4px",
      },
    };
  };
};
