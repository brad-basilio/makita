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
    );
}
