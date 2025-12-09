export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      deleteBox: {
        width: "75%",
      },
      deleteCancelButton: {
        color: `${theme.palette.secondary.main}`,
      },
      deleteText: {
        color: `${theme.palette.error.main}`,
      },
      borde: {
        border: "1px solid lightgrey",
        borderRadius: "10px",
        paddingLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
      },
    };
  };
};
