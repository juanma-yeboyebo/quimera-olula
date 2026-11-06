import { useEffect } from "react";
import { useNavigate } from "react-router";
import { cerrarSesion } from "../sesion.ts";

export const LogoutTienda = () => {
    const navigate = useNavigate();

    useEffect(() => {
        cerrarSesion()
            .catch(() => undefined)
            .then(() => navigate("/", { replace: true }));
    }, [navigate]);

    return null;
};
