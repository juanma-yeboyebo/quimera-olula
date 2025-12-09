export const state = parent => ({});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "navigate",
      url: () => "/",
    },
    {
      type: "appDispatch",
      name: "onLogout",
    },
  ],
});
