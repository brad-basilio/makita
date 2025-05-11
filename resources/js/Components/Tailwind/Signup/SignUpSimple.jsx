import JSEncrypt from "jsencrypt";
import { useEffect, useRef, useState } from "react";
import { GET } from "sode-extend-react";
import Global from "../../../Utils/Global";
import image from "../../../../sources/images/signup.png";
import AuthClientRest from "../../../Actions/AuthClientRest";
import Swal from "sweetalert2";

export default function SignUpSimple() {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    // Estados
    const [loading, setLoading] = useState(true);

    const nameRef = useRef();
    const lastnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmationRef = useRef();

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

    const onSignUpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const name = nameRef.current.value;
        const lastname = lastnameRef.current.value;
        const confirmation = confirmationRef.current.value;
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
            name: jsEncrypt.encrypt(name),
            lastname: jsEncrypt.encrypt(lastname),
            confirmation: jsEncrypt.encrypt(confirmation),
        };
        const result = await AuthClientRest.signup(request);

        if (result) {
            window.location.href = "/"; // Redirigir solo si es exitoso
        } else {
            setLoading(false);
        }
    };
    return (
        <div className="w-full px-primary mx-auto py-16 bg-white">
            <div className="lg:grid lg:grid-cols-2 gap-8 bg-[#f9f9f9] rounded-xl">
                <div className="hidden lg:block">
                    <img
                        src={
                            `/storage/images/${Global.APP_CORRELATIVE}/signup.png` ||
                            image
                        }
                        alt="Imagen decorativa"
                        className="h-full w-full object-cover rounded-xl transform "
                    />
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="mx-auto w-full max-w-md space-y-6">
                        <div className="space-y-2">
                            <h5 className="text-sky-500 font-medium">
                                Vamos a crear!
                            </h5>
                            <h1 className="text-3xl font-bold">
                                Crear una nueva cuenta
                            </h1>
                            <p className="text-gray-500">
                                Class aptent taciti sociosqu ad litora torquent
                                per conubia nostra, per inceptos himenaeos.
                            </p>
                        </div>
                        <form className="space-y-4" onSubmit={onSignUpSubmit}>
                            <div className="space-y-2">
                                <label
                                    className="block text-sm mb-1 customtext-neutral-dark"
                                    htmlFor="name"
                                >
                                    Nombres
                                </label>
                                <input
                                    id="name"
                                    ref={nameRef}
                                    name="name"
                                    type="text"
                                    placeholder="Carlos Soria de la Flor"
                                    className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="block text-sm mb-1 customtext-neutral-dark"
                                    htmlFor="name"
                                >
                                    Apellidos
                                </label>
                                <input
                                    id="lastname"
                                    ref={lastnameRef}
                                    name="lastname"
                                    type="text"
                                    placeholder="Carlos Soria de la Flor"
                                    className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                    required
                                />
                            </div>
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
                            <div className="space-y-2">
                                <label
                                    className="block text-sm mb-1 customtext-neutral-dark"
                                    htmlFor="password"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    ref={passwordRef}
                                    name="password"
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
                                    ref={confirmationRef}
                                    name="confirm-password"
                                    type="password"
                                    className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl font-semibold  bg-primary px-4 py-3 text-white hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300"
                            >
                                Crear cuenta
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
