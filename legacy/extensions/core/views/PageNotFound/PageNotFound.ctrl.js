export const state = parent => ({
  ...parent,
});

export const ctrl = parent => class core extends parent {};
