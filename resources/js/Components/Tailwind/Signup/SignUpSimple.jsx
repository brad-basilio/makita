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
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] px-primary 2xl:px-0 ">
            <div className="2xl:max-w-7xl w-full mx-auto py-16">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">

                        <div className="hidden lg:block lg:w-1/2 relative">
                            <img
                                src={`/assets/${Global.APP_CORRELATIVE}/signup.png` || image}
                                alt="Imagen decorativa"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                        <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-16">
                            <div className="max-w-md mx-auto">
                                <div className="space-y-2">
                                    <h5 className="customtext-primary font-medium">
                                        Vamos a crear!
                                    </h5>
                                    <h1 className="text-3xl font-bold">
                                        Crear una nueva cuenta
                                    </h1>
                                    <p className="customtext-neutral-light">
                                        Class aptent taciti sociosqu ad litora torquent
                                        per conubia nostra, per inceptos himenaeos.
                                    </p>
                                </div>
                                <form className="space-y-4 mt-4" onSubmit={onSignUpSubmit}>
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
            </div>
        </div>
    );
}
