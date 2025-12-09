export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      avatar: {
        backgroundColor: `${theme.palette.success.main}`,
      },
      avatarErroneo: {
        backgroundColor: `${theme.palette.error.main}`,
      },
      card: {
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
      },
      articulo: {
        flexGrow: 1,
        marginRight: theme.spacing(1),
      },
    };
  };
};
