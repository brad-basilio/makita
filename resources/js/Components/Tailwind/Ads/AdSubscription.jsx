import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import { X } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const AdSubscription = ({ data, items }) => {
  const subscriptionsRest = new SubscriptionsRest();
  const emailRef = useRef();
  const [modalOpen, setModalOpen] = useState(true);
  const [saving, setSaving] = useState(false);

  const closeModal = () => setModalOpen(false);

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const request = {
      email: emailRef.current.value,
    };
    const result = await subscriptionsRest.save(request);
    setSaving(false);

    if (!result) return;

    Swal.fire({
      title: "¡Éxito!",
      text: "Te has suscrito correctamente a nuestro boletín.",
      icon: "success",
      confirmButtonText: "Ok",
    });

    emailRef.current.value = null;
    closeModal();
  };

  return (
    <ReactModal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      contentLabel="Suscripción"
      className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl my-8"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <button
        onClick={closeModal}
        className="absolute right-4 top-4 text-green-600 hover:text-green-800 transition-all duration-300"
      >
        <X width="1.5rem" strokeWidth="3px" />
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          {items && items.length > 0 && (
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000 }}
              className="w-full h-full"
            >
              {items.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`/storage/images/ads/${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            AMOR POR LA NUTRICIÓN
          </h2>
          <p className="text-gray-600 mb-8">
            Suscríbete ahora y sé parte de esta comunidad donde podrás obtener
            descuentos especiales
          </p>

          <form onSubmit={onEmailSubmit}>
            <div className="relative">
              <input
                ref={emailRef}
                type="email"
                placeholder="Ingresa tu correo electrónico"
                disabled={saving}
                className="w-full text-gray-700 font-semibold shadow-xl py-3 pl-5 pr-12 border rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
              <Tippy content="Enviar">
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 font-bold shadow-xl bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Enviar"
                  disabled={saving}
                >
                  Enviar
                </button>
              </Tippy>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
};

export default AdSubscription;