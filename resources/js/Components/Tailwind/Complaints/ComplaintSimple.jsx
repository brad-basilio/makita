"use client";

import { useEffect, useState } from "react";
import InputForm from "../Checkouts/Components/InputForm";
import ubigeoData from "../../../../../storage/app/utils/ubigeo.json";
import SelectForm from "../Checkouts/Components/SelectForm";
export default function ComplaintSimple() {
    const [formData, setFormData] = useState({
        nombre: "",
        tipoDocumento: "RUC",
        numeroIdentidad: "",
        celular: "",
        correoElectronico: "",
        departamento: "",
        provincia: "",
        distrito: "",
        direccion: "",
        tipoProducto: "",
        montoReclamado: "",
        descripcionProducto: "",
        tipoReclamo: "",
        fechaOcurrencia: "",
        numeroPedido: "",
        detalleReclamo: "",
        aceptaTerminos: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData);
        // Aquí iría la lógica para enviar el formulario
    };

    // Estados para manejar los valores seleccionados
    const [departamento, setDepartamento] = useState("");
    const [provincia, setProvincia] = useState("");
    const [distrito, setDistrito] = useState("");

    // Estados para las opciones dinámicas
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    // Estado para el precio de envío
    const [shippingCost, setShippingCost] = useState(0);

    // Cargar los departamentos al iniciar el componente
    useEffect(() => {
        const uniqueDepartamentos = [
            ...new Set(ubigeoData.map((item) => item.departamento)),
        ];
        setDepartamentos(uniqueDepartamentos);
    }, []);

    // Filtrar provincias cuando se selecciona un departamento
    useEffect(() => {
        if (departamento) {
            const filteredProvincias = [
                ...new Set(
                    ubigeoData
                        .filter((item) => item.departamento === departamento)
                        .map((item) => item.provincia)
                ),
            ];
            setProvincias(filteredProvincias);
            setProvincia(""); // Reiniciar provincia
            setDistrito(""); // Reiniciar distrito
            setDistritos([]); // Limpiar distritos
            setFormData((prev) => ({
                ...prev,
                department: departamento,
                province: "",
                district: "",
            }));
        }
    }, [departamento]);

    // Filtrar distritos cuando se selecciona una provincia
    useEffect(() => {
        if (provincia) {
            const filteredDistritos = ubigeoData
                .filter(
                    (item) =>
                        item.departamento === departamento &&
                        item.provincia === provincia
                )
                .map((item) => item.distrito);
            setDistritos(filteredDistritos);
            setDistrito(""); // Reiniciar distrito
            setFormData((prev) => ({
                ...prev,
                province: provincia,
                district: "",
            }));
        }
    }, [provincia]);

    // Consultar el precio de envío cuando se selecciona un distrito
    useEffect(() => {
        if (distrito) {
            setFormData((prev) => ({ ...prev, district: distrito }));
        }
    }, [distrito]);

    const typesDocument = [
        { value: "ruc", label: "RUC" },
        { value: "dni", label: "DNI" },
        { value: "ce", label: "CE" },
        { value: "pasaporte", label: "Pasaporte" },
    ];
    const typesContract = [
        { value: "producto", label: "Producto" },
        { value: "servicio", label: "Servicio" },
    ];
    const typesClaim = [
        { value: "reclamo", label: "Reclamo" },
        { value: "queja", label: "Queja" },
    ];
    return (
        <div className=" w-full px-primary mx-auto py-16 bg-[#F7F9FB]">
            <div className="max-w-7xl mx-auto  bg-white shadow-lg rounded-2xl customtext-neutral-dark p-8">
                <h1 className="text-2xl font-bold mb-10 text-center uppercase">
                    Libro de Reclamaciones
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* Identificación del Consumidor */}
                    <div className="mb-8">
                        <h2 className="text-xl font-medium mb-4">
                            Identificación del Consumidor
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Nombres"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nombres"
                                />
                            </div>
                            {/*TIPO DOCUMENTO */}
                            <div className="space-y-1">
                                <SelectForm
                                    label="Tipo de documento"
                                    options={typesDocument}
                                    placeholder="Selecciona  documento"
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipoDocumento: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Número de identidad"
                                    name="numeroIdentidad"
                                    value={formData.numeroIdentidad}
                                    onChange={handleChange}
                                    placeholder="Número de identidad"
                                />
                            </div>
                        </div>
                        {/*CELULAR */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Número de celular"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    placeholder="Número de celular"
                                />
                            </div>
                            {/*CORREO */}
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label=" Correo Electrónico"
                                    name="correoElectronico"
                                    value={formData.correoElectronico}
                                    onChange={handleChange}
                                    placeholder=" Correo Electrónico"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {/* Departamento */}

                            <SelectForm
                                label="Departamento"
                                options={departamentos}
                                placeholder="Selecciona un Departamento"
                                onChange={(value) => {
                                    setDepartamento(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        department: departamento,
                                    }));
                                }}
                            />

                            {/* Provincia */}

                            <SelectForm
                                disabled={!departamento}
                                label="Provincia"
                                options={provincias}
                                placeholder="Selecciona una Provincia"
                                onChange={(value) => {
                                    setProvincia(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        province: provincia,
                                    }));
                                }}
                            />

                            {/* Distrito */}

                            <SelectForm
                                disabled={!provincia}
                                label="Distrito"
                                options={distritos}
                                placeholder="Selecciona un Distrito"
                                onChange={(value) => {
                                    setDistrito(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        district: distrito,
                                    }));
                                }}
                            />
                        </div>

                        <div className="mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Dirección"
                                    name="Dirección"
                                    value={formData.dirección}
                                    onChange={handleChange}
                                    placeholder=" Dirección"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Identificación del bien contratado */}
                    <div className="mb-8">
                        <h2 className="text-xl font-medium mb-4">
                            Identificación del bien contratado
                        </h2>

                        <div className="mb-4">
                            <div className="relative mt-1">
                                <SelectForm
                                    label=" ¿Fue un producto o Servicio?"
                                    options={typesContract}
                                    placeholder="Selecciona..."
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipoProducto: value,
                                        }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="number"
                                    label=" Monto reclamado"
                                    name=" Monto reclamado"
                                    value={formData.montoReclamado}
                                    onChange={handleChange}
                                    placeholder="  Monto reclamado"
                                />
                            </div>

                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label=" Descripción de producto"
                                    name=" Descripción de producto"
                                    value={formData.descripcionProducto}
                                    onChange={handleChange}
                                    placeholder="Nombre de producto y/o servicios, código(opcional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detalle del reclamo del pedido del consumidor */}
                    <div className="mb-8">
                        <h2 className="text-xl font-medium mb-4">
                            Detalle del reclamo del pedido del consumidor
                        </h2>

                        <div className="mb-4">
                            <SelectForm
                                label="¿Es un reclamo o queja?"
                                options={typesClaim}
                                placeholder="Selecciona..."
                                onChange={(value) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        tipoProducto: value,
                                    }));
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="date"
                                    label="  Fecha de ocurrencia"
                                    name=" fechaOcurrencia"
                                    value={formData.fechaOcurrencia}
                                    onChange={handleChange}
                                    placeholder="dd/mm/aaaa"
                                />
                            </div>

                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Número de Pedido"
                                    name="numeroPedido"
                                    value={formData.numeroPedido}
                                    onChange={handleChange}
                                    placeholder="Número de pedido: #95825548"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="space-y-1">
                                <label className="block text-sm mb-1 customtext-neutral-dark">
                                    Detalle de reclamo o queja
                                </label>
                                <textarea
                                    name="detalleReclamo"
                                    placeholder="Detalle de reclamo"
                                    className="w-full min-h-32  px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                    value={formData.detalleReclamo}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Términos y condiciones */}
                    <div className="mb-8">
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terminos"
                                name="aceptaTerminos"
                                className="mt-1 mr-2"
                                checked={formData.aceptaTerminos}
                                onChange={handleChange}
                            />
                            <label htmlFor="terminos" className="text-sm">
                                Estoy de acuerdo con los{" "}
                                <a href="#" className="text-blue-600 underline">
                                    términos y condiciones
                                </a>
                            </label>
                        </div>
                    </div>

                    {/* reCAPTCHA 
                    <div className="mb-8">
                        <div className="border border-gray-300 rounded w-fit p-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="recaptcha"
                                    className="mr-2"
                                />
                                <label htmlFor="recaptcha" className="text-sm">
                                    No soy un robot
                                </label>
                            </div>
                            <div className="flex justify-end mt-2">
                                <div className="flex items-center">
                                    <div className="text-xs text-gray-500 mr-1">
                                        reCAPTCHA
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Privacidad - Términos
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
*/}
                    {/* Botón de envío */}
                    <div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-3 font-medium rounded-lg"
                        >
                            Enviar a libro de reclamaciones
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
