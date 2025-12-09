const baseImageUrl = "http://barnaplant.com/imagenes/disponible";
const noImage = "/img/noimage.png";

const colores = [
  { value: "/AMA/", label: "Amarillo", checked: false, rgb: "#F9E79F" },
  { value: "/AZU/", label: "Azul", checked: false, rgb: "#5DADE2" },
  { value: "/AZU-O/", label: "Azul oscuro", checked: false, rgb: "#2471A3" },
  { value: "/BIC/", label: "Bicolor", checked: false, rgb: "#000000" },
  { value: "/BLA/", label: "Blanco", checked: false, rgb: "#FFFFFF" },
  { value: "/GRA/", label: "Granate", checked: false, rgb: "#800000" },
  { value: "/MAR/", label: "Marrón", checked: false, rgb: "#935116" },
  { value: "/NAR/", label: "Naranja", checked: false, rgb: "#F39C12" },
  { value: "/NEG/", label: "Negro", checked: false, rgb: "#000000" },
  { value: "/PUR/", label: "Púrpura", checked: false, rgb: "#7D2181" },
  { value: "/ROJ/", label: "Rojo", checked: false, rgb: "#FF0000" },
  { value: "/ROS/", label: "Rosa", checked: false, rgb: "#FF0080" },
  { value: "/ROS-C/", label: "Rosa claro", checked: false, rgb: "#EA899A " },
  { value: "/ROS-O/", label: "Rosa oscuro", checked: false, rgb: "#FF0080" },
  { value: "/VER/", label: "Verde", checked: false, rgb: "#27AE60" },
];

const resistenciasHumedad = [
  { key: 1, value: "resistenciaHumedad.muySeco" },
  { key: 2, value: "resistenciaHumedad.seco" },
  { key: 3, value: "resistenciaHumedad.medio" },
  { key: 4, value: "resistenciaHumedad.alto" },
  { key: 5, value: "resistenciaHumedad.acuatica" },
];

const resistenciasSol = [
  { key: 1, value: "exposicionSolar.sol" },
  { key: 2, value: "exposicionSolar.solSombra" },
  { key: 3, value: "exposicionSolar.sombra" },
];

const resistenciasSalinidad = [
  { key: 1, value: "resistenciaSalinidad.alta" },
  { key: 2, value: "resistenciaSalinidad.media" },
  { key: 3, value: "resistenciaSalinidad.baja" },
];

// const altoCabeceraMaster = 225;
// const altoCabeceraFiltro = 345;
const altoCabeceraMaster = 70;
const altoCabeceraFiltro = 190;

export {
  altoCabeceraFiltro,
  altoCabeceraMaster,
  baseImageUrl,
  colores,
  noImage,
  resistenciasHumedad,
  resistenciasSalinidad,
  resistenciasSol,
};
