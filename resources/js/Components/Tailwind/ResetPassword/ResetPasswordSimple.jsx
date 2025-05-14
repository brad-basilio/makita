import { useEffect, useRef, useState } from "react";
import image from "../../../../sources/images/reset-password.png";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";

export default function ResetPasswordSimple() {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    // Estados
    const [loading, setLoading] = useState(true);

    const passwordRef = useRef();
    const confirmationRef = useRef();
    const tokenRef = useRef();
    const emailRef = useRef();

    useEffect(() => {
        if (GET.message)
            Swal.fire({
                icon: "info",
                title: "Mensaje",
                text: GET.message,
                showConfirmButton: false,
                timer: 3000,
            });
    }, [null]);

    useEffect(() => {
        // Obtener los parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");

        // Asignar el token al tokenRef usando .current
        if (token) {
            tokenRef.current = token;
            emailRef.current = email;
        } else {
            console.error("No se encontró el token en la URL.");
        }
    }, []);

    const onResetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const password = passwordRef.current.value;
        const token = tokenRef.current;
        const confirmation = confirmationRef.current.value;
        const email = emailRef.current;
        if (password !== confirmation)
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: "Las contraseñas no coinciden",
                showConfirmButton: false,
                timer: 3000,
            });

        const request = {
            email: jsEncrypt.encrypt(email),
            password: jsEncrypt.encrypt(password),
            token: token,
            confirmation: jsEncrypt.encrypt(confirmation),
        };
        const result = await AuthClientRest.resetPassword(request);

        if (!result) return setLoading(false);

        window.location.href = "/";
    };
    return (
        <div className=" w-full px-primary mx-auto py-16 bg-[#F7F9FB]">
            <div className="p-8 lg:grid lg:grid-cols-2 gap-8 bg-white rounded-xl">
                <div className="hidden lg:block">
                    <img
                        src={
                            `/assets/${Global.APP_CORRELATIVE}/restore.png` ||
                            image
                        }
                        alt="Imagen decorativa"
                        className="h-[600px] w-full object-cover rounded-xl"
                    />
                </div>

                <div className="flex items-center justify-center p-8">
                    <div className="mx-auto w-full max-w-md space-y-6">
                        <div className="space-y-2">
                            <h5 className="customtext-primary font-medium">
                                Nueva contraseña
                            </h5>
                            <h1 className="text-3xl font-bold">
                                Restaurar contraseña
                            </h1>
                            <p className="customtext-neutral-light">
                                Class aptent taciti sociosqu ad litora torquent
                                per conubia nostra, per inceptos himenaeos.
                            </p>
                        </div>
                        <form className="space-y-4" onSubmit={onResetSubmit}>
                            <div className="space-y-2">
                                <label
                                    className="block text-sm mb-1 customtext-neutral-dark"
                                    htmlFor="password"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    ref={passwordRef}
                                    type="password"
                                    className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="block text-sm mb-1 customtext-neutral-dark"
                                    htmlFor="confirm-password"
                                >
                                    Confirmar contraseña
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    ref={confirmationRef}
                                    type="password"
                                    className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl font-semibold  bg-primary px-4 py-3 text-white hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300"
                            >
                                Restablecer contraseña
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
