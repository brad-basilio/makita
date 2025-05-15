"use client";

import { useState } from "react";
import ReactModal from "react-modal";

export default function PaymentModal({ onPaymentComplete }) {
    const [paymentMethod, setPaymentMethod] = useState("yape");
    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState();
    
    const handlePayment = () => {
        onPaymentComplete();
    };

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);
  

    if (!isOpen) return null;

    return (
        <ReactModal  key={index} isOpen={modalOpen === index} onRequestClose={closeModal} 
            className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl my-8"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        >
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Imagen decorativa - lado izquierdo */}
                        <div className="hidden md:block bg-[#f8f5f2] h-full">
                            <img
                                src="/placeholder.svg"
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Contenido del modal - lado derecho */}
                        <div className="p-6 overflow-y-auto">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-[#3a2723]">
                                    ¿Cómo deseas pagar tu pedido?
                                </h2>
                                <p className="text-[#5c504c] mt-2">
                                    Elige una de las opciones disponibles para
                                    completar tu pago de forma segura.
                                </p>
                            </div>

                            <div className="mt-6 space-y-4">
                                {/* Opción Tarjeta */}
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer ${
                                        paymentMethod === "tarjeta"
                                            ? "border-[#3a2723]"
                                            : "border-gray-200"
                                    }`}
                                    onClick={() => setPaymentMethod("tarjeta")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="tarjeta"
                                                name="paymentMethod"
                                                checked={
                                                    paymentMethod === "tarjeta"
                                                }
                                                onChange={() => {}}
                                                className="h-5 w-5 text-[#3a2723] focus:ring-[#3a2723]"
                                            />
                                            <label
                                                htmlFor="tarjeta"
                                                className="font-medium text-lg"
                                            >
                                                Pago con Tarjeta
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-[#5c504c] ml-6 mt-1">
                                        Renueva tus espacios con estilo: Fundas
                                        exclusivas para cada temporada.
                                    </p>
                                </div>

                                {/* Opción Yape/Plin */}
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer ${
                                        paymentMethod === "yape"
                                            ? "border-[#3a2723]"
                                            : "border-gray-200"
                                    }`}
                                    onClick={() => setPaymentMethod("yape")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="yape"
                                                name="paymentMethod"
                                                checked={
                                                    paymentMethod === "yape"
                                                }
                                                onChange={() => {}}
                                                className="h-5 w-5 text-[#3a2723] focus:ring-[#3a2723]"
                                            />
                                            <label
                                                htmlFor="yape"
                                                className="font-medium text-lg"
                                            >
                                                Yape / Plin
                                            </label>
                                        </div>
                                        {paymentMethod === "yape" && (
                                            <div className="h-5 w-5 rounded-full bg-[#3a2723] flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[#5c504c] ml-6 mt-1">
                                        Realiza el pago desde tu celular sin
                                        comisiones.
                                    </p>
                                </div>

                                {/* Opción Transferencia */}
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer ${
                                        paymentMethod === "transferencia"
                                            ? "border-[#3a2723]"
                                            : "border-gray-200"
                                    }`}
                                    onClick={() =>
                                        setPaymentMethod("transferencia")
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="transferencia"
                                                name="paymentMethod"
                                                checked={
                                                    paymentMethod ===
                                                    "transferencia"
                                                }
                                                onChange={() => {}}
                                                className="h-5 w-5 text-[#3a2723] focus:ring-[#3a2723]"
                                            />
                                            <label
                                                htmlFor="transferencia"
                                                className="font-medium text-lg"
                                            >
                                                Pago por Transferencia
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-[#5c504c] ml-6 mt-1">
                                        Haz una transferencia bancaria desde tu
                                        app o banca por internet.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <button
                                    className="w-full bg-[#3a2723] hover:bg-[#2a1d1a] text-white py-4 rounded-md text-lg font-medium"
                                    onClick={handlePayment}
                                >
                                    Pagar ahora
                                </button>
                                <button
                                    className="w-full border border-[#3a2723] text-[#3a2723] py-4 rounded-md text-lg font-medium"
                                    onClick={onClose}
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
