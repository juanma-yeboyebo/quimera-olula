export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      cabecera: {
        marginTop: 30,
        borderBottom: `2px solid ${theme.palette.grey[400]}`,
      },
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
