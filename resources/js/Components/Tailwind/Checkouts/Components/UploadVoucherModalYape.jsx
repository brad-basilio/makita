"use client";

import { useState } from "react";
import ReactModal from "react-modal";

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
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[95%] max-w-md top-1/2 -translate-y-1/2 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                    Subir comprobante de {paymentMethod === "yape" ? "Yape" : "Transferencia"}
                </h2>
                
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