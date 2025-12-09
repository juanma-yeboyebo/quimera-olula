export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      listElement: {
        "&:hover": {
          cursor: "pointer",
        },
        "padding": "5px 0px",
        "borderTop": `2px solid ${theme.palette.grey[300]}`,
      },
      elementSelected: {
        "&:hover": {
          cursor: "pointer",
        },
        "padding": "5px 0px",
        "borderTop": `2px solid ${theme.palette.grey[300]}`,
        "backgroundColor": `${theme.palette.grey[300]}`,
      },
      breadCrumb: {
        padding: "5px 0px",
      },
      iconFolder: {
        color: `${theme.palette.grey[500]}`,
      },
      iconDocument: {
        color: `${theme.palette.primary.main}`,
      },
    };
  };
};
