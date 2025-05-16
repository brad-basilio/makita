"use client";

import { useState } from "react";
import ReactModal from "react-modal";
import Global from "../../../../Utils/Global";
import Tippy from "@tippyjs/react";


export default function UploadVoucherModalYape({ 
    isOpen, 
    onClose, 
    onUpload, 
    paymentMethod 
}) {
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState("");

    const handleUpload = async () => {
        if (!file) {
            alert("Por favor selecciona un comprobante");
            return;
        }

        setSaving(true);
        try {
            await onUpload({
                file,
                referenceNumber,
                paymentMethod
            });
            onClose();
        } catch (error) {
            console.error("Error al subir comprobante:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[95%] max-w-lg top-1/2 -translate-y-1/2 overflow-hidden font-font-general"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="py-6 px-10 flex flex-col gap-3">

                <div className="flex justify-center items-center z-40">
                    <a href="/" className="flex items-center gap-2">
                        <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-14 object-contain object-center" onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/img/logo-bk.svg';
                        }} />
                    </a>
                </div>

                <h2 className="text-xl md:text-xl 2xl:text-2xl font-bold customtext-primary text-center">
                    Felicitaciones!
                </h2>

                <p className="text-primary mt-2 text-sm 2xl:text-base text-center">Estás a un paso de completar tu compra, escanea el código DESDE TU CELULAR DE YAPE Y/O PLIN para realizar el pago</p>

                {/* <img
                    src={`/storage/images/general/${collection.image}`}
                    onError={(e) =>
                    (e.target.src =
                    "assets/img/noimage/no_imagen_circular.png")
                    }
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                /> */}

                <Tippy content='Yape BCP'>
                          <img src="/assets/img/banks/yape.png" alt="Yape BCP" className="h-20 object-contain " />
                </Tippy>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Número de operación/referencia
                        </label>
                        <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Ingresa el número de referencia"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Comprobante de pago
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full p-2 border border-gray-300 rounded"
                            accept="image/*,.pdf"
                        />
                    </div>
                    
                    <div className="pt-4 space-y-3">
                        <button
                            onClick={handleUpload}
                            disabled={saving}
                            className={`w-full bg-primary text-white py-3 rounded-3xl font-medium ${
                                saving ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {saving ? "Enviando..." : "Enviar comprobante"}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full border border-primary text-primary py-3 rounded-3xl font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}