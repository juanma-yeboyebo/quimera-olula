export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        marginTop: 12,
      },
      yellowBox: {
        backgroundColor: `${theme.palette.warning.main} !important`,
        width: "25px",
        borderRadius: "4px",
      },
      greenBox: {
        backgroundColor: `${theme.palette.success.main} !important`,
        width: "25px",
        borderRadius: "4px",
      },
      card: {
        borderTop: `2px solid ${theme.palette.grey[200]}`,
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
      },
      cardSelected: {
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        borderTop: `2px solid ${theme.palette.secondary.main}`,
      },
    };
  };
};
