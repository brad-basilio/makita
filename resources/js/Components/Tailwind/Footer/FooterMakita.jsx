import React, { useRef, useState, useEffect } from "react";
import ReactModal from "react-modal";
import { CircleCheckBig, X } from "lucide-react";
import { toast } from "sonner";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import Tippy from "@tippyjs/react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaGlobe
} from 'react-icons/fa';

const FooterMakita = ({ pages, generals, items }) => {
    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();
    const subscriptorRef = useRef();
    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState(false);

    const policyItems = {
        terms_conditions: "Términos y condiciones",
        privacy_policy: "Políticas de privacidad",
        saleback_policy: "Políticas de devolución y cambio",
    };

    // Redes sociales predefinidas como en Socials.jsx
    const predefinedSocials = [
        { id: 'facebook', name: 'Facebook', icon: FaFacebook, iconRef: 'fab fa-facebook' },
        { id: 'instagram', name: 'Instagram', icon: FaInstagram, iconRef: 'fab fa-instagram' },
        { id: 'twitter', name: 'Twitter/X', icon: FaTwitter, iconRef: 'fab fa-twitter' },
        { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, iconRef: 'fab fa-linkedin' },
        { id: 'youtube', name: 'YouTube', icon: FaYoutube, iconRef: 'fab fa-youtube' },
        { id: 'tiktok', name: 'TikTok', icon: FaTiktok, iconRef: 'fab fa-tiktok' },
        { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, iconRef: 'fab fa-whatsapp' },
        { id: 'telegram', name: 'Telegram', icon: FaTelegram, iconRef: 'fab fa-telegram' },
        { id: 'discord', name: 'Discord', icon: FaDiscord, iconRef: 'fab fa-discord' },
        { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, iconRef: 'fab fa-snapchat' },
        { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, iconRef: 'fab fa-pinterest' },
        { id: 'reddit', name: 'Reddit', icon: FaReddit, iconRef: 'fab fa-reddit' }
    ];

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    // Función para capitalizar solo la primera letra
    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const request = {
            email: emailRef.current.value,
            subscriptor: subscriptorRef.current.value,
            status: 1,
        };
        const result = await subscriptionsRest.save(request);
        setSaving(false);

        if (!result) return;

        toast.success("¡Suscrito!", {
            description: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: <CircleCheckBig className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: "top-center",
        });

        emailRef.current.value = null;
    };
 const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

// useEffect para traer las categorías
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await fetch('/api/categories');
                const result = await response.json();
                
                if (result.success) {
                    setCategories(result.data);
                   // console.log('Categorías obtenidas:', result.data);
                } else {
                   // console.error('Error al obtener categorías:', result.message);
                }
            } catch (error) {
                //console.error('Error en la petición de categorías:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);
    return (
        <footer className="bg-primary text-white py-16">
            <div className="px-primary mx-auto  2xl:px-0 2xl:max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Logo and company info */}
                    <div>
                        <img src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-12 lg:h-12 object-contain mb-4" onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/img/logo-bk.svg';
                        }} />
                        <p className="mb-4 text-sm">
                            La línea más completa de herramientas y accesorios.
                        </p>
                        <div className="mb-2">
                            <p className="text-sm font-medium mb-1">Teléfono</p>
                            <p className="text-sm">{generals?.find(item => item.correlative === 'support_phone')?.description}</p>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm font-medium mb-1">Correo electrónico</p>
                            <p className="text-sm">{generals?.find(item => item.correlative === 'support_email')?.description}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm ">Siga a Makita:</p>
                            <div className="flex space-x-0">
                                {
                                    items && items.length > 0 ? items.filter(g => g.description !== 'WhatsApp').map((social, index) => {
                                        // Buscar el icono como en Socials.jsx
                                        const socialData = predefinedSocials.find(s =>
                                            s.name === social.description || s.iconRef === social.icon
                                        );
                                        
                                        if (socialData) {
                                            const IconComponent = socialData.icon;
                                            return (
                                                <Tippy
                                                    key={index}
                                                    content={`Ver ${social.name || social.description || 'Red social'}`}>
                                                    <a
                                                        className={`text-xl w-8 h-8 flex items-center justify-center text-white rounded-full  hover:scale-110 transition-transform duration-200 cursor-pointer`}
                                                        href={social.url || social.link || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => {
                                                            if (!social.url && !social.link) {
                                                                e.preventDefault();
                                                               // console.warn('URL no configurada para:', social);
                                                            }
                                                        }}
                                                    >
                                                        <IconComponent />
                                                    </a>
                                                </Tippy>
                                            );
                                        } else {
                                            // Fallback con Font Awesome si no encuentra el React Icon
                                            return (
                                                <Tippy
                                                    key={index}
                                                    content={`Ver ${social.name || social.description || 'Red social'}`}>
                                                    <a
                                                        className={`text-xl w-8 h-8 flex items-center justify-center text-white rounded-full p-2 hover:scale-110 transition-transform duration-200 cursor-pointer`}
                                                        href={social.url || social.link || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => {
                                                            if (!social.url && !social.link) {
                                                                e.preventDefault();
                                                               // console.warn('URL no configurada para:', social);
                                                            }
                                                        }}
                                                    >
                                                        <FaGlobe />
                                                    </a>
                                                </Tippy>
                                            );
                                        }
                                    }) : (
                                        <span className="text-sm opacity-75">No hay redes sociales configuradas</span>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Products */}
                    <div>
                        <h3 className="text-xl font-medium mb-6">Productos</h3>
                        <ul className="space-y-3">
                            {loadingCategories ? (
                                <li className="text-sm opacity-75">Cargando categorías...</li>
                            ) : categories.length > 0 ? (
                                <>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <a
                                                href={`/catalogo?category=${category.slug || category.id}`}
                                                className="hover:text-[#27b6cc] transition-colors"
                                            >
                                                {capitalizeFirst(category.name)}
                                            </a>
                                        </li>
                                    ))}
                                   
                                </>
                            ) : (
                                <li className="text-sm opacity-75">No hay categorías disponibles</li>
                            )}
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h3 className="text-xl font-medium mb-6">Recursos</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/distribuidores-y-red-de-servicios"
                                    className="hover:text-[#27b6cc] transition-colors"
                                >
                                    Distribuidores
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/distribuidores-y-red-de-servicios"
                                    className="hover:text-[#27b6cc] transition-colors"
                                >
                                    Servicios Técnicos
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/blogs"
                                    className="hover:text-[#27b6cc] transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/catalogo"
                                    className="hover:text-[#27b6cc] transition-colors"
                                >
                                    Cotizar productos
                                </a>
                            </li>
                          
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-xl font-medium mb-4">Recibe novedades</h3>
                        <form onSubmit={onEmailSubmit}>
                            <div className="space-y-4">
                                <input
                                    ref={subscriptorRef}
                                    type="text"
                                    placeholder="Nombre completo"
                                    className="w-full p-3 rounded border border-gray-300 bg-white text-gray-800"
                                />

                                <input
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Correo electrónico"
                                    className="w-full p-3 rounded border border-gray-300 bg-white text-gray-800"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-custom hover:bg-[#1d9baf] text-white font-medium py-3 px-4 rounded transition-colors"
                                >
                                    {saving ? "Enviando..." : "Registrarme"}
                                </button>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mr-2"
                                        required
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm"
                                    >
                                        Acepto los{" "}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openModal(0);
                                            }}
                                            className="underline hover:text-[#27b6cc]"
                                        >
                                            Términos y condiciones
                                        </a>
                                        .
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modals for policies */}
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
                        className="absolute left-1/2 -translate-x-1/2 bg-white p-6 !rounded-none shadow-lg w-[95%] max-w-4xl my-8"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                    >
                        <button
                            onClick={closeModal}
                            className="float-right text-red-500 hover:text-red-700 transition-all duration-300"
                        >
                            <X width="2rem" strokeWidth="4px" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                        <HtmlContent className="prose" html={content} />
                    </ReactModal>
                );
            })}
        </footer>
    );
};

export default FooterMakita;
