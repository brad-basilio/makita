import { useState } from "react";
import General from "../../../Utils/General"
import ReactModal from "react-modal";
import { X, Upload, CheckCircle, User, Mail, Phone, FileText } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";
import JobApplicationsRest from "../../../Actions/JobApplicationsRest";


const TopBarCopyright = ({ data, generals = [] }) => {
    console.log(generals);
    const [modalOpen, setModalOpen] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        cv: null
    });

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => {
        setModalOpen(null);
        setShowSuccessMessage(false);
        setUploadProgress(0);
        setFormData({
            nombre: '',
            telefono: '',
            email: '',
            cv: null
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo (PDF, DOC, DOCX)
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (allowedTypes.includes(file.type)) {
                setFormData(prev => ({
                    ...prev,
                    cv: file
                }));
                // Simular progreso de carga
                simulateUploadProgress();
            } else {
                alert('Por favor selecciona un archivo PDF, DOC o DOCX');
            }
        }
    };

    const simulateUploadProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.nombre || !formData.telefono || !formData.email || !formData.cv) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            // Crear FormData para envío del archivo
            const submitData = new FormData();
            submitData.append('name', formData.nombre);
            submitData.append('phone', formData.telefono);
            submitData.append('email', formData.email);
            submitData.append('cv_file', formData.cv);
            const jobApplicationsRest = new JobApplicationsRest();
            const result = await jobApplicationsRest.save(submitData);
            if (!result) return;
            setShowSuccessMessage(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar la solicitud. Por favor intenta nuevamente.');
        }
    };

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",

        // 'delivery_policy': 'Políticas de envío',
        saleback_policy: "Políticas de devolucion y cambio",
    };
    const copyright = generals?.find(
        (item) => item.correlative === "copyright"
    );

    return (
        <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white mx-auto'}`}>
            {data?.policyTerms ? (
                <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white'} ${data?.color ? `${data.color}` : 'customtext-neutral-dark'} text-sm mx-auto font-medium py-3 customtext-neutral-dark text-center px-primary 2xl:px-0  2xl:max-w-7xl flex justify-between items-center font-paragraph`}>
                    <p>{copyright?.description || "© 2025 Todos los derechos reservados"}</p>
                    <ul className="gap-3 flex text-white">
                        <li>
                            <a
                                type="button"
                                href="#"
                                onClick={() => openModal(1)}
                                className="cursor-pointer hover:customtext-primary underline hover:font-bold transition-all duration-300"
                            >
                                Términos y Condiciones de uso del sitio web
                            </a>
                        </li>

                        <li>
                            <a
                                onClick={() => openModal(0)}
                                className="cursor-pointer hover:customtext-primary underline hover:font-bold transition-all duration-300"
                            >
                                Políticas de privacidad
                            </a>
                        </li>

                        <li>
                            <a
                                type="button"
                                href="#"
                                onClick={() => openModal(2)}
                                className="cursor-pointer underline hover:customtext-primary hover:font-bold transition-all duration-300"
                            >
                                Trabaja con nosotros
                            </a>
                        </li>

                    </ul>

                </div>
            ) : (
                <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white'} ${data?.color ? `${data.color}` : 'customtext-neutral-dark'} text-sm font-bold py-3 customtext-neutral-dark text-center px-primary flex justify-center items-center font-paragraph`}>
                    <p>{copyright?.description || "© 2025 Todos los derechos reservados"}</p>
                </div>
            )}


            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content =
                    generals.find((x) => x.correlative == key)?.description ??
                    "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                    >
                        <button
                            onClick={closeModal}
                            className="float-right text-red-500 hover:text-red-700 transition-all duration-300 "
                        >
                            <X width="2rem" strokeWidth="4px" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                        <HtmlContent className="prose" html={content} />
                    </ReactModal>
                );
            })}

            {/* Modal Trabaja con nosotros */}
            <ReactModal
                isOpen={modalOpen === 2}
                onRequestClose={closeModal}
                contentLabel="Trabaja con nosotros"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            >
                <div className="flex h-full max-h-[90vh]">
                    {/* Imagen lateral */}
                    <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 to-teal-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src="/images/makita-worker.jpg"
                                alt="Trabajador Makita"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                        <div class="flex flex-col items-center justify-center h-full text-white p-8">
                                            <div class="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                                                <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            </div>
                                            <h3 class="text-2xl font-bold text-center mb-4">¡Únete a Makita Perú!</h3>
                                            <p class="text-center text-lg opacity-90">Forma parte de nuestro equipo de excelencia</p>
                                        </div>
                                    `;
                                }}
                            />
                        </div>
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-all duration-300 z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Formulario */}
                    <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                        {/* Botón cerrar para móvil */}
                        <button
                            onClick={closeModal}
                            className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-all duration-300"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {!showSuccessMessage ? (
                            <div>
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                        ¡Únete a Makita Perú y crece con nosotros!
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        En Makita Perú, creemos en el talento y la pasión por la excelencia.
                                        Si buscas formar parte de un equipo innovador y comprometido,
                                        esta es tu oportunidad. Déjanos tus datos y adjunta tu CV.
                                        ¡Queremos conocerte!
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nombre completo */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            placeholder="Nombre completo"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* Teléfono */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            placeholder="Teléfono"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Correo electrónico"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* Upload CV */}
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-500 transition-all duration-300">
                                        <input
                                            type="file"
                                            id="cv-upload"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                        />
                                        <label htmlFor="cv-upload" className="cursor-pointer">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                                    <Upload className="w-8 h-8 text-teal-600" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-700 mb-2">
                                                    Adjuntar CV
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    (Formatos aceptados: .pdf, .doc, .docx)
                                                </p>
                                            </div>
                                        </label>

                                        {formData.cv && (
                                            <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <FileText className="w-5 h-5 text-teal-600 mr-2" />
                                                        <span className="text-sm font-medium text-teal-800">
                                                            {formData.cv.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-teal-600">
                                                        {(formData.cv.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </div>
                                                {uploadProgress > 0 && uploadProgress < 100 && (
                                                    <div className="mt-2">
                                                        <div className="bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${uploadProgress}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-xs text-teal-600 mt-1">{uploadProgress}%</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón enviar */}
                                    <button
                                        type="submit"
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Enviar solicitud
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // Mensaje de éxito
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    ¡Tu solicitud ha sido enviada con éxito!
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                                    Gracias por postular a Makita Perú. Hemos recibido tu información
                                    y nuestro equipo de selección la revisará pronto.
                                </p>
                                <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md">
                                    <p className="text-sm text-gray-700 font-medium">
                                        Si tu perfil es seleccionado, nos pondremos en contacto contigo.
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                                >
                                    Seguir navegando
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </ReactModal>

        </div>
    );
}

export default TopBarCopyright;