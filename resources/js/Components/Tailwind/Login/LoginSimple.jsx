import { useEffect, useRef, useState } from "react";
import image from "../../../../sources/images/login.png";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
export default function LoginSimple() {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    // Estados
    const [loading, setLoading] = useState(true);

    const emailRef = useRef();
    const passwordRef = useRef();
    const rememberRef = useRef();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

    const onLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = formData?.email;
        const password = formData?.password;

        const request = {
            email: jsEncrypt.encrypt(email),
            password: jsEncrypt.encrypt(password),
        };

        const result = await AuthClientRest.login(request);

        setLoading(false); // Deja de mostrar el loading

        // 🔴 Verifica si la autenticación fue exitosa antes de redirigir
        if (!result || result.status !== 200) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: result?.message || "Credenciales incorrectas",
                type: "danger",
            });
            return; // 🔴 DETIENE la redirección
        }

        // ✅ Si el login fue exitoso, redirige
        window.location.href = "/";
    };

    return (
        <div className=" w-full px-primary mx-auto py-16 bg-[#F7F9FB]">
            <div className="p-8 lg:grid lg:grid-cols-2 gap-8 bg-white rounded-xl">
                <div className="hidden lg:block">
                    <img
                        src={
                            `/storage/images/${Global.APP_CORRELATIVE}/login.png` ||
                            image
                        }
                        alt="Imagen decorativa"
                        className="h-[600px] w-full object-cover rounded-xl"
                    />
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="mx-auto w-full max-w-md space-y-6">
                        <div className="space-y-2">
                            <h5 className="text-sky-500 font-medium">Hola</h5>
                            <h1 className="text-3xl font-bold">Bienvenido</h1>
                            <p className="text-gray-500">
                                Inicia sesión para acceder a tu cuenta y seguir
                                tus pedidos y disfrutar de una experiencia de
                                compra extraordinaria.
                            </p>
                        </div>
                        <form className="space-y-4" onSubmit={onLoginSubmit}>
                            <div className="space-y-2">
                                <InputForm
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="hola@mail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputForm
                                    label="Contraseña"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="password"
                                />
                            </div>
                            <div className="flex items-center justify-between pb-6">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        ref={rememberRef}
                                        className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm text-gray-600"
                                    >
                                        Guardar mis datos
                                    </label>
                                </div>
                                <a
                                    href="/forgot-password"
                                    className="text-sm flex gap-2
                                    items-center justify-center customtext-primary font-semibold  fill-primary"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="17"
                                        viewBox="0 0 14 17"
                                        fill="current"
                                    >
                                        <path
                                            d="M5.79167 11H8.20833L7.75 8.3125C7.98256 8.18831 8.16569 8.00822 8.29942 7.77223C8.43314 7.53626 8.5 7.27544 8.5 6.98979C8.5 6.57993 8.35269 6.22917 8.05808 5.9375C7.76346 5.64583 7.40929 5.5 6.99558 5.5C6.58186 5.5 6.22917 5.64688 5.9375 5.94063C5.64583 6.23438 5.5 6.5875 5.5 7C5.5 7.28344 5.56686 7.54225 5.70058 7.77642C5.83431 8.01057 6.01744 8.18926 6.25 8.3125L5.79167 11ZM7 16.5C5.125 16.0417 3.57292 14.9803 2.34375 13.3158C1.11458 11.6513 0.5 9.80297 0.5 7.77083V3L7 0.5L13.5 3V7.77083C13.5 9.80297 12.8854 11.6513 11.6562 13.3158C10.4271 14.9803 8.875 16.0417 7 16.5ZM7 14.9375C8.44444 14.4896 9.63889 13.5938 10.5833 12.25C11.5278 10.9062 12 9.41319 12 7.77083V4.02083L7 2.10417L2 4.02083V7.77083C2 9.41319 2.47222 10.9062 3.41667 12.25C4.36111 13.5938 5.55556 14.4896 7 14.9375Z"
                                            fill="current"
                                        />
                                    </svg>
                                    Olvidé mi contraseña
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl font-semibold  bg-primary px-4 py-3 text-white hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300"
                            >
                                Ingresar
                            </button>
                            <div>
                                {" "}
                                <div className="row mt-3">
                                    <div className="text-sm text-center customtext-neutral-light">
                                        <a
                                            href="/crear-cuenta"
                                            className="text-muted"
                                        >
                                            ¿Eres nuevo por aquí? Crea una
                                            cuenta.{" "}
                                        </a>
                                    </div>
                                </div>
                                {/*   <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O continuar con</span>
                </div>
              </div>
              <div className="grid gap-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Ingresar con mi cuenta de Google
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <svg className="mr-2 h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                  </svg>
                  Ingresar con mi cuenta de Facebook
                </button>
              </div>*/}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
