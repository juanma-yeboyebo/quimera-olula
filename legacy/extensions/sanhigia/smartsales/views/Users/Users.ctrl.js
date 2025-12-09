export const bunch = parent => ({
  ...parent,
  onSupervisorSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["supervisor"] }),
    },
  ],
  onSupervisorSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["supervisor"] }),
    },
  ],
});
