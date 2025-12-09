export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      chartDesktop: {
        backgroundColor: "white",
        padding: theme.spacing(1),
        borderRadius: 4,
      },
      chartMobile: {},
    };
  };
};
