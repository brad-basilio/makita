import React, { useRef, useState } from "react";
import axios from "axios";
import Modal from "../../Components/Adminto/Modal";

const ModalImportItem = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Por favor, selecciona un archivo.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const response = await axios.post(
                `https://builder1.alohaperu.com/api/import-items`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage(
                "Error al importar: " + error.response?.data?.error ||
                    error.message
            );
        }
        setLoading(false);
    };

    return (
        <div className="bg-white">
            <div className="modal-content">
                <h2>Importar Datos</h2>
                <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                />
                <button onClick={handleUpload} disabled={loading}>
                    {loading ? "Subiendo..." : "Subir Archivo"}
                </button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};
export default ModalImportItem;
