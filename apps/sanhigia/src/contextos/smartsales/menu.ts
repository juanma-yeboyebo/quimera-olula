export const menuSmartsales = {
    "SmartSales": { icono: "fichero" },
    "SmartSales/Dashboard": { url: "/ss/dashboard", regla: "ss_tratos" },
    "SmartSales/Tipos de trato": { url: "/ss/tipostrato", regla: "ss_campanias.get" },
    "SmartSales/Business Intelligence": { url: "/ss/bi", regla: false },
    "SmartSales/Campañas": { url: "/ss/campanias", regla: "ss_campanias.get" },
    "SmartSales/Lead Pacientes": { url: "/ss/leadpacientes", regla: "ss_campanias/lead_pacientes" },
    "SmartSales/Tratos": { url: "/ss/tratos", regla: "ss_campanias.get" },
    "SmartSales/Farma": { url: "/ss/tratosfarma", regla: "farma/acceso_tratos" },
    "SmartSales/Contactos": { url: "/ss/contactosmd", regla: "ss_campanias.get" },
    "SmartSales/Cursos": { url: "/ss/cursos", regla: "ss_tratos" },
    "SmartSales/Clientes": { url: "/ss/clientes", regla: "clientes/acceso_clientes" },
    "SmartSales/Incidencias": { url: "/ss/incidencias" },
};
