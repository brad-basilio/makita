import React, { useRef, useState } from "react"
import MessagesRest from "../../../Actions/MessagesRest"
import Swal from "sweetalert2"

const messagesRest = new MessagesRest()

const ContactSimple = ({ data }) => {

  const nameRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()
  const descriptionRef = useRef()

  const [sending, setSending] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    setSending(true)

    const request = {
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      description: descriptionRef.current.value
    }

    const result = await messagesRest.save(request);
    setSending(false)

    if (!result) return

    Swal.fire({
      icon: 'success',
      title: 'Mensaje enviado',
      text: 'Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!',
      showConfirmButton: false,
      timer: 3000
    })

    if (data.redirect) {
      location.href = data.redirect
    }

    nameRef.current.value = null
    phoneRef.current.value = null
    emailRef.current.value = null
    descriptionRef.current.value = null
  }

  return <div className="bg-white">
    <div className="px-[5%] replace-max-w-here w-full mx-auto px-4 py-[5%] md:py-[2.5%]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-44">
        <div className="flex flex-col gap-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
          <h2 className="font-poppins font-bold text-4xl  leading-none text-colorJL">Escríbenos para
            ayudarte</h2>
          <p className="text-[#565656] font-poppins font-normal text-base">Si deseas contactarte con
            nosotros, puedes comunicarte con alguno de nuestros representantes, los cuales solucionarán
            cualquier duda</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
            <div className="w-full">
              <input ref={nameRef} required type="text" id="full_name" name="full_name" placeholder="Nombre completo" className="border-b-[1.5px] border-[#082252] border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:border-border-b-[1.5px] focus:border-[#082252] font-poppins text-text16  py-3 focus:ring-transparent" disabled={sending}/>
            </div>

            <div className="w-full">
              <input ref={phoneRef} required type="tel" id="telefono" name="phone" placeholder="Teléfono" maxlength="9" className="border-b-[1.5px] border-[#082252] border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:border-border-b-[1.5px] focus:border-[#082252] font-poppins text-text16  py-3 focus:ring-transparent" disabled={sending}/>
            </div>

            <div className="w-full">
              <input ref={emailRef} required type="email" id="email" name="email" placeholder="E-mail" className="border-b-[1.5px] border-[#082252] border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:border-border-b-[1.5px] focus:border-[#082252] font-poppins text-text16  py-3 focus:ring-transparent" disabled={sending}/>
            </div>

            <div className="w-full">
              <input ref={descriptionRef} required type="text" id="message" name="message" placeholder="Mensaje" className="border-b-[1.5px] border-[#082252] border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:border-border-b-[1.5px] focus:border-[#082252] font-poppins text-text16  py-3 focus:ring-transparent" disabled={sending}/>
            </div>

            <div className="flex justify-center items-center pt-3">
              <button type="submit" className="font-moderat_Bold text-text16 md:text-text18 text-white py-4 px-10 bg-primary w-full text-center rounded-3xl hover:opacity-75 md:duration-300 disabled:opacity-75" disabled={sending}>
                Enviar Solicitud
              </button>
            </div>

          </form>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
            <h2 className="font-poppins font-bold text-3xl  leading-none text-colorJL">Datos de contacto</h2>
            <p className="text-[#565656] font-poppins font-normal text-base">Si deseas contactarte con
              nosotros, puedes comunicarte con alguno de nuestros representantes, los cuales solucionarán
              cualquier duda</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
                <i className="fa  fas fa-map-marker-alt text-2xl text-primary"></i>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none text-colorJL">Dirección
                </p>
                <p className="text-[#565656] font-poppins font-normal text-base">
                  Lima, Perú

                </p>
              </div>
            </div>

            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
                <i className="fa fas fa-phone-alt text-2xl text-primary"></i>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none text-colorJL">Número
                  de Teléfono</p>
                <p className="text-[#565656] font-poppins font-normal text-base">
                  +51 123456789
                </p>
              </div>
            </div>

            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
                <i className="fa fas fa-envelope text-2xl text-primary"></i>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none text-colorJL">Correo
                  Electrónico</p>
                <p className="text-[#565656] font-poppins font-normal text-base">
                  info@mail.com </p>
              </div>
            </div>

            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
                <i className="fa fas fa-calendar-day text-2xl text-primary"></i>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none text-colorJL">Horario
                  de Atención</p>


                <p className="text-[#565656] font-poppins font-normal text-base">
                  horarios
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
}

export default ContactSimple