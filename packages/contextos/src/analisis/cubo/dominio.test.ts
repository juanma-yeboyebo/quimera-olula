import { FilaPivot, Medida, Miembro, PeticionPivot } from "./diseño.ts";
import {
  alternarMedida,
  alternarNodo,
  cambiarFiltro,
  arbolDesdePivot,
  claveRuta,
  columnasTabla,
  expandirNodo,
  filasTabla,
  medidaDeColumna,
  moverNivel,
  necesitaCargar,
  nombreExportacion,
  ordenTrasPulsar,
  peticionNodo,
} from "./dominio.ts";

const m = (codigo: Miembro["codigo"], etiqueta = String(codigo)): Miembro => ({ codigo, etiqueta });

const fila = (
  filas: (Miembro | null)[],
  columnas: (Miembro | null)[],
  importe: number | null
): FilaPivot => ({ filas, columnas, medidas: { importe } });

const importe: Medida = { id: "importe", descripcion: "Importe", agregacion: "suma", formato: "moneda" };
const cantidad: Medida = { id: "cantidad", descripcion: "Cantidad", agregacion: "suma", formato: "unidades" };

const peticion: PeticionPivot = {
  filas: ["articulo.familia", "articulo.articulo"],
  columnas: ["tiempo.ano"],
  medidas: ["importe"],
  filtros: { "cliente.cliente": ["C1"] },
  orden: null,
  top: null,
  excluirCeros: false,
};

const carga = [
  fila([null], [null], 100),
  fila([null], [m(2025)], 40),
  fila([null], [m(2026)], 60),
  fila([m("F2", "Bebidas")], [null], 70),
  fila([m("F1", "Comida")], [null], 30),
  fila([m("F2", "Bebidas")], [m(2026)], 50),
  fila([m("F2", "Bebidas")], [m(2025)], 20),
  fila([m("F1", "Comida")], [m(2025)], 20),
  fila([m("F1", "Comida")], [m(2026)], 10),
];

describe("peticionNodo", () => {
  test("sin ruta pide solo el primer nivel de filas", () => {
    expect(peticionNodo(peticion, [])).toEqual({ ...peticion, filas: ["articulo.familia"] });
  });

  test("al expandir pide el nivel siguiente filtrado por los ancestros", () => {
    expect(peticionNodo(peticion, [m("F1")])).toEqual({
      ...peticion,
      filas: ["articulo.familia", "articulo.articulo"],
      filtros: { "cliente.cliente": ["C1"], "articulo.familia": ["F1"] },
    });
  });

  test("el nodo sin valor se filtra con null", () => {
    expect(peticionNodo(peticion, [m(null, "(sin valor)")]).filtros["articulo.familia"]).toEqual([null]);
  });

  test("sin niveles en filas no cambia la petición", () => {
    const soloColumnas = { ...peticion, filas: [] };
    expect(peticionNodo(soloColumnas, [])).toEqual(soloColumnas);
  });
});

describe("arbolDesdePivot", () => {
  const arbol = arbolDesdePivot(carga);

  test("el total general sale de la fila sin miembros", () => {
    expect(arbol.total).toEqual({
      [claveRuta([])]: { importe: 100 },
      [claveRuta([m(2025)])]: { importe: 40 },
      [claveRuta([m(2026)])]: { importe: 60 },
    });
  });

  test("los nodos respetan el orden en que llegan, sin hijos cargados", () => {
    expect(arbol.nodos.map((n) => n.ruta)).toEqual([[m("F2", "Bebidas")], [m("F1", "Comida")]]);
    expect(arbol.nodos[0].hijos).toBeNull();
    expect(arbol.nodos[0].expandido).toBe(false);
    expect(arbol.nodos[0].valores[claveRuta([m(2025)])]).toEqual({ importe: 20 });
  });

  test("las columnas quedan ordenadas, con el total delante", () => {
    expect(arbol.columnas).toEqual([[], [m(2025)], [m(2026)]]);
  });
});

describe("expandirNodo", () => {
  const hijos = [
    fila([null, null], [null], 30),
    fila([m("F1", "Comida"), null], [null], 30),
    fila([m("F1", "Comida"), m("A2", "Pan")], [null], 25),
    fila([m("F1", "Comida"), m("A1", "Sal")], [null], 5),
    fila([m("F1", "Comida"), m("A2", "Pan")], [m(2025)], 15),
  ];
  const arbol = expandirNodo(arbolDesdePivot(carga), [m("F1", "Comida")], hijos);
  const comida = arbol.nodos[1];

  test("cuelga del nodo solo las filas del nivel siguiente", () => {
    expect(comida.expandido).toBe(true);
    expect(comida.hijos?.map((n) => n.ruta)).toEqual([
      [m("F1", "Comida"), m("A2", "Pan")],
      [m("F1", "Comida"), m("A1", "Sal")],
    ]);
    expect(comida.hijos?.[0].valores[claveRuta([m(2025)])]).toEqual({ importe: 15 });
  });

  test("no toca el resto de nodos", () => {
    expect(arbol.nodos[0].hijos).toBeNull();
  });

  test("con hijos cargados ya no necesita cargar y se puede contraer", () => {
    expect(necesitaCargar(arbol, [m("F1", "Comida")])).toBe(false);
    expect(necesitaCargar(arbol, [m("F2", "Bebidas")])).toBe(true);
    const contraido = alternarNodo(arbol, [m("F1", "Comida")]);
    expect(contraido.nodos[1].expandido).toBe(false);
    expect(contraido.nodos[1].hijos).toHaveLength(2);
  });
});

describe("columnasTabla", () => {
  const columnas = [[], [m(2025)], [m(2025), m("T1")], [m(2026)], [m(2026), m("T1")]];

  test("medidas en columnas: bajo cada miembro, con los subtotales a la izquierda", () => {
    const resultado = columnasTabla(columnas, [importe, cantidad], 2, true);
    expect(resultado.map((c) => [c.grupo, c.cabecera])).toEqual([
      [["Total"], "Importe"],
      [["Total"], "Cantidad"],
      [["2025", "Total"], "Importe"],
      [["2025", "Total"], "Cantidad"],
      [["2025", "T1"], "Importe"],
      [["2025", "T1"], "Cantidad"],
      [["2026", "Total"], "Importe"],
      [["2026", "Total"], "Cantidad"],
      [["2026", "T1"], "Importe"],
      [["2026", "T1"], "Cantidad"],
    ]);
    expect(resultado[0]).toMatchObject({ id: `${claveRuta([])}|importe`, tipo: "moneda" });
    expect(resultado[1]).toMatchObject({ tipo: "numero", decimales: 0 });
  });

  test("medidas en filas: una columna por miembro", () => {
    expect(columnasTabla(columnas, [importe], 2, false).map((c) => [c.grupo, c.cabecera])).toEqual([
      [[], "Total"],
      [["2025"], "Total"],
      [["2025"], "T1"],
      [["2026"], "Total"],
      [["2026"], "T1"],
    ]);
  });

  test("sin niveles en columnas, solo las medidas", () => {
    expect(columnasTabla([[]], [importe], 0, true).map((c) => [c.grupo, c.cabecera])).toEqual([[[], "Importe"]]);
  });
});

describe("filasTabla", () => {
  const arbol = expandirNodo(arbolDesdePivot(carga), [m("F2", "Bebidas")], [
    fila([m("F2", "Bebidas"), m("A9", "Agua")], [null], 70),
  ]);

  test("medidas en columnas: nodos en preorden y el total al final", () => {
    const filas = filasTabla(arbol, [importe], 2, true);
    expect(filas.map((f) => [f.etiqueta, f.nivel, f.expandible, f.expandida, f.destacada])).toEqual([
      ["Bebidas", 0, true, true, true],
      ["Agua", 1, false, false, false],
      ["Comida", 0, true, false, false],
      ["Total", 0, false, false, true],
    ]);
    expect(filas[0].valores[`${claveRuta([m(2026)])}|importe`]).toBe(50);
  });

  test("medidas en filas: una fila por medida bajo cada miembro", () => {
    const filas = filasTabla(arbolDesdePivot(carga), [importe], 1, false);
    expect(filas.map((f) => [f.etiqueta, f.nivel])).toEqual([
      ["Bebidas", 0],
      ["Importe", 1],
      ["Comida", 0],
      ["Importe", 1],
      ["Total", 0],
      ["Importe", 1],
    ]);
    expect(filas[1].valores[claveRuta([])]).toBe(70);
  });
});

describe("ordenTrasPulsar", () => {
  test("una medida nueva ordena descendente y repetirla invierte", () => {
    expect(ordenTrasPulsar(null, "importe")).toEqual({ por: "importe", sentido: "desc" });
    expect(ordenTrasPulsar({ por: "importe", sentido: "desc" }, "importe")).toEqual({ por: "importe", sentido: "asc" });
    expect(ordenTrasPulsar({ por: "importe", sentido: "asc" }, "cantidad")).toEqual({ por: "cantidad", sentido: "desc" });
  });
});

describe("moverNivel", () => {
  test("de filas a columnas, al final", () => {
    expect(moverNivel(peticion, "articulo.familia", "columnas")).toMatchObject({
      filas: ["articulo.articulo"],
      columnas: ["tiempo.ano", "articulo.familia"],
    });
  });

  test("delante de otro nivel del mismo eje", () => {
    expect(moverNivel(peticion, "articulo.articulo", "filas", "articulo.familia").filas).toEqual([
      "articulo.articulo",
      "articulo.familia",
    ]);
  });

  test("sin destino lo quita de los ejes", () => {
    expect(moverNivel(peticion, "tiempo.ano", null).columnas).toEqual([]);
  });
});

describe("alternarMedida", () => {
  test("añade en el orden del cubo y no deja quitar la última", () => {
    const conAmbas = alternarMedida({ ...peticion, medidas: ["cantidad"] }, "importe", [importe, cantidad]);
    expect(conAmbas.medidas).toEqual(["importe", "cantidad"]);
    expect(alternarMedida(peticion, "importe", [importe, cantidad]).medidas).toEqual(["importe"]);
  });

  test("quitar la medida del orden quita el orden", () => {
    const ordenada = { ...peticion, medidas: ["importe", "cantidad"], orden: { por: "cantidad", sentido: "desc" as const } };
    expect(alternarMedida(ordenada, "cantidad", [importe, cantidad]).orden).toBeNull();
  });
});

describe("cambiarFiltro", () => {
  test("sin códigos quita el filtro", () => {
    expect(cambiarFiltro(peticion, "cliente.cliente", []).filtros).toEqual({});
    expect(cambiarFiltro(peticion, "tiempo.ano", [2025, null]).filtros).toEqual({
      "cliente.cliente": ["C1"],
      "tiempo.ano": [2025, null],
    });
  });
});

describe("medidaDeColumna", () => {
  test("saca la medida del id de columna", () => {
    expect(medidaDeColumna(`${claveRuta([])}|importe`)).toBe("importe");
    expect(medidaDeColumna(claveRuta([]))).toBeNull();
  });
});

describe("nombreExportacion", () => {
  test("cubo y fecha local en AAAAMMDD", () => {
    expect(nombreExportacion("ventas", new Date(2026, 0, 5))).toBe("ventas-20260105.xlsx");
  });
});
