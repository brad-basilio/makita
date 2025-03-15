import { Cookies, Fetch, Notify } from "sode-extend-react";
class AuthClientRest {
    static login = async (request) => {
        console.log(request);
        try {
            const { status, result } = await Fetch("./api/login-client", {
                method: "POST",

                body: JSON.stringify(request),
            });

            if (!status || result.status !== 200) {
                Notify.add({
                    icon: "/assets/img/icon.svg",
                    title: "Operación incorrecta",
                    body: result?.message || "Error al iniciar sesión",
                    type: "danger",
                });
                return false;
            }

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Operación correcta",
                body: "Se inició sesión correctamente",
            });

            return result; // Devuelve el resultado para que el frontend decida qué hacer
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return false;
        }
    };

    static signup = async (request) => {
        try {
            const { status, result } = await Fetch("./api/signup-client", {
                method: "POST",
                body: JSON.stringify(request),
            });
            if (!status)
                throw new Error(
                    result?.message || "Error al registrar el usuario"
                );

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Operacion correcta",
                body: "Se registro el usuario correctamente",
            });

            return result.data;
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return null;
        }
    };

    static forgotPassword = async (request) => {
        try {
            const { status, result } = await Fetch(
                "./api/forgot-password-client",
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ||
                        "Error al solicitar el restablecimiento de contraseña"
                );

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Operacion correcta",
                body: "Se ha enviado un enlace para restablecer tu contraseña.",
            });
            return true;
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return false;
        }
    };

    static resetPassword = async (request) => {
        try {
            const { status, result } = await Fetch(
                "./api/reset-password-client",
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message || "Error al restablecer la contraseña"
                );
            return true;
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return false;
        }
    };
}

export default AuthClientRest;
