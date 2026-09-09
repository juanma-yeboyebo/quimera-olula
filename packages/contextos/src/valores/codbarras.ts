export const tiposCodBarras = [
    "Code39",
    "Code128",
    "Code128B",
    "Code128C",
    "Code128R",
    "EAN",
    "ISBN",
    "UPC",
    "CodeI25",
    "CBR",
    "MSI",
    "PLS",
    "Code93",
] as const;

export type TipoCodBarras = (typeof tiposCodBarras)[number];

export const opcionesTipoCodBarras = [
    { valor: "", descripcion: "—" },
    ...tiposCodBarras.map((tipo) => ({ valor: tipo, descripcion: tipo })),
];

export const tipoCodBarrasDesdeApi = (valor: string | null): TipoCodBarras | "" =>
    valor && (tiposCodBarras as readonly string[]).includes(valor)
        ? (valor as TipoCodBarras)
        : "";
