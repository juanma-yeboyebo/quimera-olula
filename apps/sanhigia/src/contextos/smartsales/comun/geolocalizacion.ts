export type Posicion = {
    latitud: number;
    longitud: number;
};

export const posicionActual = (espera = 10000): Promise<Posicion | null> =>
    new Promise((resolver) => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
            resolver(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolver({ latitud: coords.latitude, longitud: coords.longitude }),
            () => resolver(null),
            { enableHighAccuracy: true, timeout: espera, maximumAge: 60000 }
        );
    });
