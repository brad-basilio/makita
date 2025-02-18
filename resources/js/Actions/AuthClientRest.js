import { Fetch, Notify } from "sode-extend-react";

class AuthClientRest {
    static login = async (request) => {
        try {
            const { status, result } = await Fetch("./api/login-client", {
                method: "POST",
                body: JSON.stringify(request),
            });
            if (!status)
                throw new Error(result?.message || "Error al iniciar sesion");

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Operacion correcta",
                body: "Se inicio sesion correctamente",
            });

            return result;
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
