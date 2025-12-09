export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      leftIcon: {
        marginRight: theme.spacing(1),
      },
      avatar: {
        backgroundColor: `${theme.palette.success.main} !important`,
        marginRight: "10px",
      },
      card: {
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
      },
    };
  };
};
