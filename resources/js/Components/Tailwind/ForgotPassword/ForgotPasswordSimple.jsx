import AuthClientRest from "../../../Actions/AuthClientRest";
import image from "../../../../sources/images/forgot-password.png";
import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import Global from "../../../Utils/Global";
export default function ForgotPasswordSimple() {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    // Estados
    const [loading, setLoading] = useState(true);

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

    const onForgotSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = emailRef.current.value;

        const request = {
            email: jsEncrypt.encrypt(email),
        };
        const result = await AuthClientRest.forgotPassword(request);

        if (!result) return setLoading(false);
        window.location.href = "/";
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] px-primary 2xl:px-0  ">
            <div className="2xl:max-w-7xl w-full mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:min-h-[600px]">
                        <div className="hidden lg:block lg:w-1/2 relative">
                            <img
                                src={`/assets/${Global.APP_CORRELATIVE}/restore.png` || image}
                                alt="Imagen decorativa"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                        <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-16">
                            <div className="max-w-md mx-auto  h-full flex flex-col justify-center">
                                <div className="space-y-2">
                                    <h5 className="customtext-primary font-medium">
                                        Olvidé
                                    </h5>
                                    <h1 className="text-3xl font-bold customtext-neutral-dark">
                                        Ops, olvidé mi contraseña
                                    </h1>
                                    <p className="customtext-neutral-light">
                                        Class aptent taciti sociosqu ad litora torquent
                                        per conubia nostra, per inceptos himenaeos.
                                    </p>
                                </div>
                                <form className="space-y-4" onSubmit={onForgotSubmit}>
                                    <div className="space-y-2">
                                        <label
                                            className="block text-sm mb-1 customtext-neutral-dark"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            ref={emailRef}
                                            name="email"
                                            type="email"
                                            placeholder="hola@mail.com"
                                            className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full rounded-xl font-semibold  bg-primary px-4 py-3 text-white hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300"
                                    >
                                        Enviar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
