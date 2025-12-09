export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      chip: {
        borderRadius: 4,
        marginRight: theme.spacing(0.5),
        fontSize: "0.8rem",
        backgroundColor: "#FAEB8C",
        textTransform: "uppercase",
      },
    };
  };
};
