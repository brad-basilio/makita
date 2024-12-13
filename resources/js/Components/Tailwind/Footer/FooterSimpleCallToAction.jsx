import React, { useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import HtmlContent from "../../../Utils/HtmlContent";
import Global from "../../../Utils/Global";

ReactModal.setAppElement('#app')

const FooterSimpleCallToAction = ({ socials = [], terms = {}, footerLinks = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const links = {}
  footerLinks.forEach(fl => {
    links[fl.correlative] = fl.description
  })

  return (
    <>
      <footer class="font-poppins bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-[5%] md:py-[2.5%]">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:justify-center">
            <div class="lg:col-span-3 w-full flex flex-col gap-10">
              <div>
                <a href="/">
                  <img src="/assets/img/logo.svg" alt={Global.APP_NAME} className="drop-shadow-lg" />
                </a>
              </div>
              <nav>
                <ul class="flex flex-col gap-3 text-base font-normal">
                  <li class="flex flex-row items-start gap-2">
                    <i className="mdi mdi-map-marker"></i>
                    <span>Av. Camino Real 356 - San Isidro. Lima - Perú</span>
                  </li>
                  <li class="flex flex-row gap-2">
                    <i className="mdi mdi-email"></i>
                    <span className="text-wrap break-all">soporte@jugueteslúdicos.com.pe</span>
                  </li>
                  <li class="flex flex-row gap-2">
                    <i className="mdi mdi-whatsapp"></i>
                    <span>+51 987435733</span>
                  </li>
                </ul>
              </nav>


            </div>

            <div class="lg:col-span-3 w-full flex flex-col gap-5">
              <h3 class="font-bold text-lg">Términos Legales</h3>

              <nav>
                <ul class="flex flex-col gap-3 text-base font-normal">
                  <li class="flex flex-row gap-2"><a href="https://juguetesludicos.mundoweb.pe/catalogo"> Políticas de privacidad </a></li>
                  <li class="flex flex-row gap-2"><a href="https://juguetesludicos.mundoweb.pe/catalogo"> Políticas de envío </a></li>
                  <li class="flex flex-row gap-2"><a href="https://juguetesludicos.mundoweb.pe/catalogo"> Políticas de devolución y cambio </a></li>
                </ul>
              </nav>

              <a href="https://juguetesludicos.mundoweb.pe/libro-de-reclamaciones"><img class="w-28" src="https://juguetesludicos.mundoweb.pe/images/img/reclamaciones.png" /></a>
            </div>

            <div class="lg:col-span-2 w-full flex flex-col gap-5">
              <h3 class="font-bold text-lg">Menú</h3>

              <nav>
                <ul class="flex flex-col gap-3 text-base font-normal">
                  <li class="flex flex-row gap-2"><a href="#"> Inicio </a></li>
                  <li class="flex flex-row gap-2"><a href="#"> Productos </a></li>
                  <li class="flex flex-row gap-2"><a href="#"> Blog </a></li>
                  <li class="flex flex-row gap-2"><a href="#"> Contáctanos </a></li>
                </ul>
              </nav>
            </div>

            <div class="lg:col-span-4 w-full flex flex-col gap-5">


              <h3 class="text-2xl font-bold">Suscríbete a nuestro blog</h3>
              <p class="font-normal text-base">Mantente actualizado sobre las últimas noticias y ofertas.</p>

              <div class="flex flex-col gap-2">
                <form action="" id="footerFormulario" class="flex flex-col md:flex-row md:justify-start md:items-center gap-3">
                  <input type="hidden" name="_token" value="Ek9NgzaWpp9BKf76URqctRbsjpo73zuqd1GaRvdw" autocomplete="off" />                    <div class="w-full">
                    <input required="" name="email" type="email" id="emailFooter" class="ring-0 focus:ring-0 border-transparent focus:border-transparent bg-white px-5 py-3 rounded-xl w-full text-colorJL placeholder:text-colorJL" placeholder="info@mail.com" />
                  </div>
                  <input type="hidden" id="nameFooter" required="" name="full_name" value="Usuario suscrito" />
                  <input type="hidden" id="tipo" placeholder="tipo" name="tipo_message" value="Inscripción" />

                  <div class="flex justify-center items-center w-full md:w-auto">
                    <button type="submit" class="font-helveticaBold text-base text-white border border-white py-3 px-3 rounded-xl w-full md:w-auto text-center">Suscribirme
                    </button>
                  </div>
                </form>
                <p class="font-helveticaLight text-text12 text-white">
                  Al suscribirse, acepta nuestra Política de privacidad y brinda su
                  consentimiento para recibir actualizaciones de nuestra empresa.
                </p>
              </div>


            </div>
          </div>

          <div class="mt-5 flex flex-col md:flex-row justify-center md:justify-between items-center gap-5 mx-auto">
            <div class="flex flex-col md:flex-row gap-2">
              <p class="font-normal">
                Copyright © <a target="_blank" href="http://mundoweb.pe/" class="font-bold">2024 Mundo Web</a>. Reservados todos los derechos
              </p>

            </div>

            <div class="flex flex-wrap gap-2 pb-5">
              {
                socials.map((social, index) => {
                  return <Tippy key={index} content={`Ver ${social.name} en ${social.description}`}>
                    <button
                      href={social.link}
                      className={`text-xl bg-transparent bg-white text-primary ${social.icon} w-10 h-10 pt-0.5 text-center rounded-full`}
                    />
                  </Tippy>
                })
              }
            </div>
          </div>
        </div>
      </footer>

      {/* Modal para Términos y Condiciones */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Términos y condiciones"
        className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow-lg w-[95%] max-w-2xl my-8 outline-none h-[90vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <button onClick={closeModal} className="float-right text-gray-500 hover:text-gray-900">
          Cerrar
        </button>
        <h2 className="text-xl font-bold mb-4">Políticas de privacidad y condiciones de uso</h2>
        <HtmlContent className="prose h-[calc(90vh-120px)] lg:h-[calc(90vh-90px)] overflow-auto" html={terms.description} />
      </ReactModal>
    </>
  );
};

export default FooterSimpleCallToAction;
