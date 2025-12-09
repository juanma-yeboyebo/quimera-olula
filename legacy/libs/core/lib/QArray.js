const groupBy = (array, fn) =>
  array.map(typeof fn === "function" ? fn : val => val[fn]).reduce(
    (accum, item, idx) => ({
      ...accum,
      [item]: [...(accum[item] ?? []), array[idx]],
    }),
    {},
  );

const countBy = (arr, fn) =>
  arr.map(typeof fn === "function" ? fn : val => val[fn]).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;

    return acc;
  }, {});

const toObj = (array, fn) =>
  array.map(typeof fn === "function" ? fn : val => val[fn]).reduce(
    (accum, item, idx) => ({
      ...accum,
      [item]: array[idx],
    }),
    {},
  );

const range = (from, to, step = 1) =>
  [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);

export default {
  groupBy,
  countBy,
  toObj,
  range,
};
