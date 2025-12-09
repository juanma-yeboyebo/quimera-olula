export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      
    };
  };
};
