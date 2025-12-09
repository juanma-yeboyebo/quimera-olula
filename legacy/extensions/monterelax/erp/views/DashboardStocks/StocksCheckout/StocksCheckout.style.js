export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        marginTop: "10px",
        marginLeft: theme.spacing(7) + 1,
        marginRight: theme.spacing(7) + 1,
      },
      listContainer: {
        marginTop: "16px",
      },
      card: {
        border: `1px solid ${theme.palette.grey[400]}`,
      },
    };
  };
};
