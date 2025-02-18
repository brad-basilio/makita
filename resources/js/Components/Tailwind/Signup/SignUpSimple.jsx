import JSEncrypt from "jsencrypt"
import { useEffect, useRef, useState } from "react"
import { GET } from "sode-extend-react"
import Global from "../../../Utils/Global"
import image from "../../../../sources/images/signup.png"
import AuthClientRest from '../../../Actions/AuthClientRest'
import Swal from "sweetalert2"
export default function SignUpSimple() {
  const jsEncrypt = new JSEncrypt()
  jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY)

  // Estados
  const [loading, setLoading] = useState(true)

  const nameRef = useRef()
  const lastnameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmationRef = useRef()

  useEffect(() => {
    if (GET.message) Swal.fire({
      icon: 'info',
      title: 'Mensaje',
      text: GET.message,
      showConfirmButton: false,
      timer: 3000
    })
  }, [null])

  const onSignUpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const email = emailRef.current.value
    const password = passwordRef.current.value
    const name = nameRef.current.value
    const lastname = lastnameRef.current.value
    const confirmation = confirmationRef.current.value
    if (password !== confirmation) return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden',
      showConfirmButton: false,
      timer: 3000
    })

    const request = {
      email: jsEncrypt.encrypt(email),
      password: jsEncrypt.encrypt(password),
      name: jsEncrypt.encrypt(name),
      lastname: jsEncrypt.encrypt(lastname),
      confirmation: jsEncrypt.encrypt(confirmation)
    }
    const result = await AuthClientRest.signup(request)

    if (!result) return setLoading(false)


    window.location.href = "/"

  }
  return (
    <div className=" w-full px-primary mx-auto py-16 bg-[#F7F9FB]">
      <div className="p-8 lg:grid lg:grid-cols-2 gap-8 bg-white rounded-xl">
        <div className="hidden lg:block">
          <img
            src={image}
            alt="Imagen decorativa"
            className="h-[600px] w-full object-cover rounded-xl transform -rotate-90"
          />
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2">
              <h5 className="text-sky-500 font-medium">Vamos a crear!</h5>
              <h1 className="text-3xl font-bold">Crear una nueva cuenta</h1>
              <p className="text-gray-500">
                Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
            <form className="space-y-4" onSubmit={onSignUpSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Nombres
                </label>
                <input
                  id="name"
                  ref={nameRef}
                  name="name"
                  type="text"
                  placeholder="Carlos Soria de la Flor"
                  className="w-full rounded-md border border-gray-200 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Apellidos
                </label>
                <input
                  id="lastname"
                  ref={lastnameRef}
                  name="lastname"
                  type="text"
                  placeholder="Carlos Soria de la Flor"
                  className="w-full rounded-md border border-gray-200 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  ref={emailRef}
                  name="email"
                  type="email"
                  placeholder="hola@mail.com"
                  className="w-full rounded-md border border-gray-200 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  className="w-full rounded-md border border-gray-200 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirm-password">
                  Confirmar contraseña
                </label>
                <input
                  id="confirm-password"
                  ref={confirmationRef}
                  name="confirm-password"
                  type="password"
                  className="w-full rounded-md border border-gray-200 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                Crear cuenta
              </button>
              {/*
            
            <div className="relative">
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
            </div>
            */}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

