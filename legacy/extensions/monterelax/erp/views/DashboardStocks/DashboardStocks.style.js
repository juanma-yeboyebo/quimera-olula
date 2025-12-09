export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        marginTop: 12,
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
