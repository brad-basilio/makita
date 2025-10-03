import { useState, useEffect } from "react";
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

    // Estilos del scrollbar personalizado (igual que HeaderMakita)
    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            border: 2px solid transparent;
            background-clip: padding-box;
        }
    `;

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
        <>
            <style>{scrollbarStyles}</style>
            <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white mx-auto'}`}>
            {data?.policyTerms ? (
                <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white'} ${data?.color ? `${data.color}` : 'customtext-neutral-dark'} text-sm mx-auto font-medium py-3 customtext-neutral-dark text-center px-primary 2xl:px-0  2xl:max-w-7xl flex flex-col lg:flex-row justify-between items-center font-paragraph`}>
                    <p className="!text-sm lg:text-base">{copyright?.description || "© 2025 Todos los derechos reservados"}     <span className="italic ">  Powered by  <a href="https://www.mundoweb.pe" target="_blank" rel="noopener noreferrer">MundoWeb</a></span></p>
                    <ul className="gap-3 mt-2 lg:mt-0 flex flex-col lg:flex-row  text-white">
                        <li>
                            <a
                                type="button"
                                href="#"
                                onClick={() => openModal(1)}
                                className="cursor-pointer text-xs lg:text-sm  hover:customtext-primary underline hover:font-bold transition-all duration-300"
                            >
                                Términos y Condiciones de uso del sitio web
                            </a>
                        </li>

                        <li>
                            <a
                                onClick={() => openModal(0)}
                                className="cursor-pointer text-xs lg:text-sm  hover:customtext-primary underline hover:font-bold transition-all duration-300"
                            >
                                Políticas de privacidad
                            </a>
                        </li>

                        <li>
                            <a
                                type="button"
                                href="#"
                                onClick={() => openModal(2)}
                                className="cursor-pointer text-xs lg:text-sm  underline hover:customtext-primary hover:font-bold transition-all duration-300"
                            >
                                Trabaja con nosotros
                            </a>
                        </li>

                    </ul>

                </div>
            ) : (
                <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white'} ${data?.color ? `${data.color}` : 'customtext-neutral-dark'} text-sm font-bold py-3 customtext-neutral-dark text-center px-primary flex justify-center items-center font-paragraph`}>
                    <p>{copyright?.description || "© 2025 Todos los derechos reservados"}</p>
                        <span className="italic ">  Powered by  <a href="https://www.mundoweb.pe" target="_blank" rel="noopener noreferrer">MundoWeb</a></span>
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
                         className="absolute p-8 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white  shadow-2xl w-[95%] max-w-4xl  "
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                    >
                       
                   <div className="w-full flex justify-end">
                  <button
                    onClick={closeModal}
                    className=" top-4 right-4 bg-primary shadow-lg hover:shadow-xl rounded-md p-2 text-white hover:text-white transition-all duration-300 z-50 border border-gray-200"
                  
                >
                    <X className="w-5 h-5" />
                </button>
              </div>
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
                className={`absolute p-4 sm:p-8 left-1/2 -translate-x-1/2 sm:left-1/2 sm:top-1/2 top-4 sm:-translate-y-1/2 bg-white shadow-2xl w-[95%] max-w-4xl max-h-[95vh] overflow-y-auto`}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            >
                {/* Botón cerrar fijo - no se mueve con el scroll */}
              <div className="w-full flex justify-end">
                  <button
                    onClick={closeModal}
                    className=" top-4 right-4 bg-primary shadow-lg hover:shadow-xl rounded-md p-2 text-white hover:text-white transition-all duration-300 z-50 border border-gray-200"
                  
                >
                    <X className="w-5 h-5" />
                </button>
              </div>

                <div className="flex flex-col overflow-y-auto custom-scrollbar lg:flex-row gap-8 h-auto lg:h-full min-h-0 lg:max-h-[80vh] lg:overflow-y-hidden">
                    {/* Imagen lateral */}
                    <div className="w-full mt-8 lg:mt-0 h-96 lg:h-auto rounded-xl lg:w-1/2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src="/assets/img/makita/form-cv.webp"
                                alt="Trabajador Makita"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                        <div class="flex flex-col items-center justify-center h-full text-white p-8">
                                           
                                            <h3 class="text-2xl font-bold text-center mb-4">¡Únete a Makita Perú!</h3>
                                            <p class="text-center text-lg opacity-90">Forma parte de nuestro equipo de excelencia</p>
                                        </div>
                                    `;
                                }}
                            />
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="w-full md:w-1/2 lg:overflow-y-auto lg:custom-scrollbar">

                        {!showSuccessMessage ? (
                            <div>
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold customtext-neutral-dark mb-2">
                                        ¡Únete a Makita Perú y crece con nosotros!
                                    </h2>
                                    <p className="customtext-neutral-light leading-relaxed">
                                        En Makita Perú, creemos en el talento y la pasión por la excelencia.
                                        Si buscas formar parte de un equipo innovador y comprometido,
                                        esta es tu oportunidad. Déjanos tus datos y adjunta tu CV.
                                        ¡Queremos conocerte!
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-2">
                                    {/* Nombre completo */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            placeholder="Nombre completo"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    {/* Teléfono */}
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            placeholder="Teléfono"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Correo electrónico"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    {/* Upload CV */}
                                    <div className="relative">
                                        <div 
                                            className="rounded-xl p-8 text-center hover:bg-gray-50 transition-all duration-300 border-dashed border-2 border-primary cursor-pointer bg-white shadow-sm hover:shadow-md"
                                           
                                        >
                                            <input
                                                type="file"
                                                id="cv-upload"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="hidden"
                                            />
                                            <label htmlFor="cv-upload" className="cursor-pointer block">
                                                <div className="flex flex-col items-center">
                                                    <div className="">
                                                       <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="24.4805" cy="24" r="24" fill="#F6F6F6"/>
<path d="M25.8555 15.0023C25.3854 15 24.8862 15 24.3555 15C19.8771 15 17.638 15 16.2467 16.3912C14.8555 17.7825 14.8555 20.0217 14.8555 24.5C14.8555 28.9783 14.8555 31.2175 16.2467 32.6088C17.638 34 19.8771 34 24.3555 34C28.8338 34 31.073 34 32.4643 32.6088C33.8027 31.2703 33.8535 29.147 33.8554 25" stroke="#219FB9" stroke-width="1.5" stroke-linecap="round"/>
<path d="M14.8555 26.1354C15.4745 26.0455 16.1003 26.0011 16.7272 26.0027C19.3791 25.9466 21.9661 26.7729 24.0266 28.3342C25.9375 29.7821 27.2802 31.7749 27.8555 34" stroke="#219FB9" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M33.8555 28.8962C32.6801 28.3009 31.4643 27.9988 30.2417 28.0001C28.39 27.9928 26.557 28.6733 24.8555 30" stroke="#219FB9" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M29.8555 16.5C30.347 15.9943 31.6553 14 32.3555 14M32.3555 14C33.0557 14 34.364 15.9943 34.8555 16.5M32.3555 14V22" stroke="#219FB9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                                                    </div>
                                                    <p className="text-sm font-semibold customtext-neutral-dark ">
                                                        Adjuntar tu CV
                                                    </p>
                                                   
                                                 
                                                    <p className="text-xs customtext-neutral-light mt-3 ">
                                                        (Formatos aceptados: .pdf, .doc, .docx)
                                                    </p>
                                                </div>
                                            </label>

                                        
                                        </div>
                                    </div>

                                    {/* Botón enviar */}
                                    <button
                                        type="submit"
                                        className="w-full font-medium bg-primary brightness-125 text-white  py-3 px-6 rounded-md transition-all duration-300 transform  hover:shadow-xl shadow-lg flex items-center justify-center group"
                                    >
                                     Enviar solicitud
                                      
                                    </button>

                                        {formData.cv && (
                                                <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10  rounded-lg flex items-center justify-center mr-3">
                                                                <FileText className="w-5 h-5 customtext-primary" />
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-semibold text-teal-800 block">
                                                                    {formData.cv.name}
                                                                </span>
                                                                <span className="text-xs Customtext-neutral-dark">
                                                                    {(formData.cv.size / 1024 / 1024).toFixed(2)} MB
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <CheckCircle className="w-6 h-6 customtext-primary" />
                                                    </div>
                                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                                        <div className="mt-3">
                                                            <div className="bg-white rounded-full h-2 shadow-inner">
                                                                <div
                                                                    className="bg-primary h-2 rounded-full transition-all duration-300 shadow-sm"
                                                                    style={{ width: `${uploadProgress}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs customtext-neutral-dark mt-1 font-medium">{uploadProgress}% completado</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                </form>
                            </div>
                        ) : (
                            // Mensaje de éxito
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="mb-4  rounded-full flex items-center justify-center ">
                                    <CheckCircle className="w-6 h-6 customtext-primary" />
                                </div>
                                <h2 className="text-2xl font-bold customtext-neutral-dark mb-4  lg:max-w-xs">
                                    ¡Tu solicitud ha sido enviada con éxito!
                                </h2>
                                <p className="customtext-neutral-light text-sm leading-relaxed mb-6 lg:max-w-xs">
                                    Gracias por postular a Makita Perú. Hemos recibido tu información
                                    y nuestro equipo de selección la revisará pronto.
                                </p>
                                <div className="bg-gray-100  p-6 mb-8 lg:max-w-xs">
                                    <p className="text-sm customtext-neutral-dark font-semibold">
                                        Si tu perfil es seleccionado, nos pondremos en contacto contigo.
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                      className="w-full font-medium bg-primary brightness-125 lg:max-w-xs text-white  py-3 px-6 rounded-md transition-all duration-300 transform  hover:shadow-xl shadow-lg flex items-center justify-center group"
                                >
                                    Seguir navegando
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </ReactModal>

            </div>
        </>
    );
}

export default TopBarCopyright;