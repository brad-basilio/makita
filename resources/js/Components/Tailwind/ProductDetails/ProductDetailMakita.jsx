import { useEffect, useRef, useState } from "react";
import {
    ShoppingCart,
    Store,
    Home,
    Phone,
    CircleUserRound,
    ChevronDown,
    CheckSquare,
    Plus,
    ChevronUp,
    CircleCheckIcon,
    ChevronLeft,
    Share2,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";

import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";
import ProductInfinite from "../Products/ProductInfinite";
import CartModal from "../Components/CartModal";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Grid, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductBananaLab from "../Products/ProductBananaLab";
import ProductMakita from "../Products/ProductMakita";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";





const ProductDetailMakita = ({ item, data, setCart, cart, generals, favorites, setFavorites }) => {

    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    // Estado para controlar la pestaña activa
    const [activeTab, setActiveTab] = useState("general");

    const [quantity, setQuantity] = useState(1);
    const handleChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        setQuantity(value);
    };
    /*ESPECIFICACIONES */
    const [isExpanded, setIsExpanded] = useState(false);

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: quantity });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        /*   Swal.fire({
               title: "Producto agregado",
               text: `Se agregó ${product.name} al carrito`,
               icon: "success",
               timer: 1500,
           });*/
        setModalOpen(!modalOpen);
        setTimeout(() => setModalOpen(false), 3000);
    };

    const [relationsItems, setRelationsItems] = useState([]);
    const inCart = cart?.find((x) => x.id == item?.id);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);

            handleViewUpdate(item);
        }
    }, [item]); // Agregar `item` como dependencia
    const handleViewUpdate = async (item) => {
        try {
            const request = {
                id: item?.id,
            };
            console.log(request);
            const response = await itemsRest.updateViews(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }
        } catch (error) {
            return;
        }
    };


    const productosRelacionados = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                id: item?.id,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.productsRelations(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const relations = response;

            setRelationsItems(Object.values(relations));
            console.log(relations);
        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };

    const [expandedSpecificationMain, setExpanded] = useState(false);



    // Swiper Refs
    const mainSwiperRef = useRef(null);
    const thumbSwiperRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    const phone_whatsapp = generals?.find(
        (general) => general.correlative === "phone_whatsapp"
    );

    const numeroWhatsApp = phone_whatsapp?.description; // Reemplaza con tu número
    const mensajeWhatsApp = encodeURIComponent(
        `¡Hola! Tengo dudas sobre este producto: ${item.name}`
    );
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;

    const handleClickWhatsApp = () => {
        window.open(linkWhatsApp, "_blank");
    };
    const mensajeWhatsAppCotizar = encodeURIComponent(
        `¡Hola! Me gustaría cotizar este producto: ${item.name}`
    );
    const linkWhatsAppCotizar = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsAppCotizar}`;
    const handleClickWhatsAppCotizar = () => {
        window.open(linkWhatsAppCotizar, "_blank");
    };
    // Animaciones
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    const slideUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <>
            {/* Versión Mobile */}
            <div className="md:hidden min-h-screen font-paragraph">
                {/* Header Estilo App */}
                <div className="sticky top-0 bg-white shadow-sm z-20">
                    <div className="flex items-center p-4 gap-4 border-b">
                        {/* <button onClick={() => window.history.back()} className="text-gray-600">
                            <ChevronLeft size={24} />
                        </button>*/}
                        <div>
                            <div className="customtext-primary text-sm font-medium mb-1">
                                {item?.code || item?.sku}
                            </div>
                            <h1 className="text-lg font-bold flex-1 line-clamp-2">{item?.name}</h1>
                        </div>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="p-4 pb-24">
                    {/* Carrusel Principal */}
                    <div className="relative aspect-square mb-6 rounded-xl overflow-hidden shadow-md">
                        <Swiper
                            ref={mainSwiperRef}
                            modules={[Navigation, Pagination]}
                            navigation={{
                                prevEl: navigationPrevRef.current,
                                nextEl: navigationNextRef.current,
                            }}
                            pagination={{
                                clickable: true,
                                renderBullet: (_, className) =>
                                    `<span class="${className} !w-2 !h-2 !bg-white/50 !mx-1"></span>`,
                            }}
                            loop={true}
                            onSwiper={(swiper) => {
                                mainSwiperRef.current = swiper;
                            }}
                            className="h-full"
                        >
                            {[item?.image, ...item?.images]
                                .filter((image, index, self) =>
                                    index === self.findIndex((img) => img.url === image.url)
                                )
                                .map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={`/storage/images/item/${img.url || img}`}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>

                        {/* Botones de navegación */}
                        <div className="absolute top-1/2 w-full flex justify-between px-2 transform -translate-y-1/2 z-10">
                            <button
                                ref={navigationPrevRef}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:scale-110 transition-transform"
                            >
                                <ChevronLeft className="text-gray-800" size={20} />
                            </button>
                            <button
                                ref={navigationNextRef}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:scale-110 transition-transform"
                            >
                                <ChevronRight className="text-gray-800" size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Breve descripción */}
                    <div className="mb-6">
                        <p className="text-base font-medium mb-3">
                            {item?.specifications?.find(spec => spec.title === 'Descripción breve')?.description || 'Sierra de poda sin escobillas XGT® para cortar matorales y ramas.'}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: item?.description }}>
                        </p>
                    </div>



                    {/* Tecnologías */}
                    {item?.technologies && item.technologies.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold text-base mb-3">Tecnologías</h3>
                            <div className="flex gap-4 flex-wrap">
                                {item.technologies.map((technology) => (
                                    <div key={technology.id} className="flex flex-col items-center">
                                        {technology.image && (
                                            <img
                                                src={technology.image}
                                                alt={technology.name}
                                                className="h-7 object-contain"
                                            />
                                        )}
                                        <span className="text-xs mt-1">{technology.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pestañas de navegación */}
                    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden border border-gray-100">
                        <div className="flex border-b">
                            <button
                                className={`py-3 flex-1 text-sm font-medium ${activeTab === "general" ? "border-b-2 border-primary customtext-primary" : "text-gray-600"}`}
                                onClick={() => setActiveTab("general")}
                            >
                                General
                            </button>
                            <button
                                className={`py-3 flex-1 text-sm font-medium ${activeTab === "info" ? "border-b-2 border-primary customtext-primary" : "text-gray-600"}`}
                                onClick={() => setActiveTab("info")}
                            >
                                Información técnica
                            </button>
                            <button
                                className={`py-3 flex-1 text-sm font-medium ${activeTab === "downloads" ? "border-b-2 border-primary customtext-primary" : "text-gray-600"}`}
                                onClick={() => setActiveTab("downloads")}
                            >
                                Descargables
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Contenido de General */}
                            {activeTab === "general" && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-base">Beneficios del producto</h3>
                                    <div>
                                        {item?.specifications && item.specifications.filter(spec => spec.type === 'general').length > 0 ? (
                                            item.specifications.filter(spec => spec.type === 'general').map((spec, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex items-start gap-3 py-3 px-1 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} -mx-1`}
                                                >
                                                    <div className="min-w-5 min-h-5 mt-0.5">
                                                        <CircleCheckIcon className="h-5 w-5 customtext-primary" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm">{spec.description}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" opacity="0.3" />
                                                </svg>
                                                <p className="text-sm font-medium">No hay especificaciones generales disponibles</p>
                                                <p className="text-xs mt-1">Las especificaciones se mostrarán aquí cuando estén disponibles</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Contenido de Info */}
                            {activeTab === "info" && (
                                <div className="space-y-4">


                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Especificaciones técnicas</h4>
                                        <div className="rounded overflow-hidden">
                                            {item?.specifications && item.specifications.filter(spec => spec.type === 'technical' || !spec.type).length > 0 ? (
                                                item.specifications.filter(spec => spec.type === 'technical' || !spec.type).slice(0, 6).map((spec, index) => (
                                                    <div key={index} className={`flex flex-row ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                                        <div className="py-2 px-3 w-1/2 font-medium text-gray-700 text-sm">{spec.title}</div>
                                                        <div className="py-2 px-3 w-1/2 text-gray-900 text-sm flex items-center justify-between">
                                                            <span>{spec.description}</span>
                                                            {spec.tooltip && (
                                                                <Tippy content={spec.tooltip} arrow={true} placement="auto">
                                                                    <svg
                                                                        width="20"
                                                                        height="20"
                                                                        viewBox="0 0 20 20"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="cursor-help"
                                                                    >
                                                                        <path d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#262626" />
                                                                    </svg>
                                                                </Tippy>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor" opacity="0.3" />
                                                    </svg>
                                                    <p className="text-sm font-medium">No hay especificaciones técnicas disponibles</p>
                                                    <p className="text-xs mt-1">Las especificaciones técnicas se mostrarán aquí cuando estén disponibles</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contenido de Downloads */}
                            {activeTab === "downloads" && (
                                <div className="space-y-3">
                                    {item?.downloadables && item.downloadables.length > 0 ? (
                                        item.downloadables.map((downloadable, index) => (
                                            <div key={downloadable.id}>
                                                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="customtext-primary">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">{downloadable.original_name || downloadable.name}</p>
                                                            <p className="text-xs text-gray-500">{(() => {
                                                                const sizeInBytes = parseInt(downloadable.size) || 0;
                                                                const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
                                                                return `${sizeInMB} MB`;
                                                            })()}</p>
                                                        </div>
                                                    </div>
                                                    <a href={downloadable.url} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs">
                                                        Descargar {(() => {
                                                            const fileName = downloadable.original_name || downloadable.name || '';
                                                            const extension = fileName.split('.').pop()?.toUpperCase();
                                                            if (extension && extension !== fileName.toUpperCase()) {
                                                                return extension;
                                                            }
                                                            const mimeType = downloadable.mime_type || downloadable.type || '';
                                                            if (mimeType.includes('spreadsheetml') || mimeType.includes('excel')) return 'XLSX';
                                                            if (mimeType.includes('pdf')) return 'PDF';
                                                            if (mimeType.includes('word') || mimeType.includes('document')) return 'DOCX';
                                                            if (mimeType.includes('image')) return 'IMG';
                                                            return 'ARCHIVO';
                                                        })()}
                                                    </a>
                                                </div>
                                                {index < item.downloadables.length - 1 && (
                                                    <hr className="border-gray-200 my-2" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No hay archivos disponibles para descargar</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[99]">
                    <div className="p-4 flex gap-4">
                        <button onClick={() => { handleClickWhatsAppCotizar(); }} className="flex-1 bg-primary text-white py-3 rounded-lg font-medium active:scale-95 transition-transform">
                            Cotizar producto
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className=" py-12 hidden md:block font-paragraph">
                <div className="px-primary  mx-auto 2xl:px-0 2xl:max-w-7xl bg-white rounded-xl p-4 md:p-8">


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Images and Delivery Options */}
                        <div className="space-y-6">
                            {/* Product Images */}
                            <div className="flex gap-6">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() =>
                                            setSelectedImage({
                                                url: item?.image,
                                                type: "main",
                                            })
                                        }
                                        className={`w-16 h-16 rounded-md p-2 border bg-[#F6F6F6] ${selectedImage.url === item?.image
                                            ? "border-primary"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <img
                                            src={`/storage/images/item/${item?.image}`}
                                            alt="Main Thumbnail"
                                            className="w-full h-full object-contain"
                                            onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </button>
                                    {item?.images.filter((image, index, self) =>
                                        index === self.findIndex((img) => img.url === image.url) // Filtra duplicados
                                    ).map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage({
                                                    url: image.url,
                                                    type: "gallery",
                                                })
                                            }
                                            className={`w-16 h-16 border-2 rounded-lg bg-[#F6F6F6] p-2 ${selectedImage.url === image.url
                                                ? "border-primary"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${image.url}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 flex items-center justify-center bg-[#F6F6F6] rounded-lg p-8">
                                    <img
                                        src={
                                            selectedImage.type === "main"
                                                ? `/storage/images/item/${selectedImage.url}`
                                                : `/storage/images/item/${selectedImage.url}`
                                        }
                                        onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                        }
                                        alt="Product main"
                                        className="w-full max-h-[400px] object-contain"
                                    />
                                </div>
                            </div>


                            <div className="flex lg:hidden gap-8 border-b-2 pb-8">
                                {/* Price Section */}
                                <div className=" w-full ">
                                    <p className="text-sm customtext-neutral-light mb-1">
                                        Precio:{" "}
                                        <span className="line-through line-clamp-1">
                                            S/ {item?.price}
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-4 ">
                                        <span className="text-[40px] font-bold line-clamp-1">
                                            S/ {item?.final_price}
                                        </span>
                                        <span className="bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl">
                                            -
                                            {Number(
                                                item?.discount_percent
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mt-4">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center space-x-4 customtext-neutral-light text-sm">
                                                <span className="">
                                                    Cantidad
                                                </span>
                                                <div className="relative flex items-center border rounded-md px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={quantity}
                                                        onChange={handleChange}
                                                        min="1"
                                                        max="10"
                                                        className="w-10 py-1 customtext-neutral-dark text-center bg-transparent outline-none appearance-none"
                                                    />
                                                </div>
                                                <span className="">
                                                    Máximo 10 unidades.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={() => {
                                            onAddClicked(item);

                                        }}
                                        className="w-full bg-primary text-white py-3 font-bold shadow-lg rounded-xl hover:opacity-90 transition-all duration-300 mt-4"
                                    >
                                        Quiero Cotizar
                                    </button>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="block lg:hidden flex-1 w-full ">
                                <div className="bg-[#F7F9FB] rounded-lg p-6">
                                    <h3 className="font-medium text-sm mb-4">
                                        Especificaciones principales
                                    </h3>
                                    <ul
                                        className={`space-y-2  customtext-neutral-light mb-4 transition-all duration-300 ${expandedSpecificationMain
                                            ? "max-h-full"
                                            : "max-h-24 overflow-hidden"
                                            }`}
                                        style={{ listStyleType: "disc" }}
                                    >
                                        {item?.specifications.map(
                                            (spec, index) =>
                                                spec.type === "principal" && (
                                                    <li
                                                        key={index}
                                                        className="flex gap-2"
                                                    >
                                                        <CircleCheckIcon className="customtext-primary" />
                                                        {spec.description}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                    <button
                                        className="customtext-primary text-sm font-semibold hover:underline flex items-center gap-1 transition-all duration-300"
                                        onClick={() =>
                                            setExpanded(
                                                !expandedSpecificationMain
                                            )
                                        }
                                    >
                                        {expandedSpecificationMain
                                            ? "Ver menos"
                                            : "Ver más especificaciones"}
                                        {expandedSpecificationMain ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>





                        </div>

                        {/* Right Column - Product Info */}
                        <div className="hidden md:block font-paragraph">
                            {/* Código y título del producto en la parte superior */}
                            <div className="mb-6">
                                <div className="text-[#219FB9] text-lg font-medium mb-1">
                                    {item?.code || item?.sku}
                                </div>
                                <h1 className="text-[32px] font-bold customtext-neutral-dark">
                                    {item?.name}
                                </h1>
                                {/*SECTION NO LOCALIZADO */}
                                {/* <div className="text-sm text-gray-600 mt-2 flex items-center gap-4">
                                    <span>{item?.specifications?.find(spec => spec.title === 'Potencia')?.description || '400Vmax - 150 mm'}</span>
                                    {item?.specifications?.find(spec => spec.title === 'Peso')?.description && (
                                        <span>• {item?.specifications?.find(spec => spec.title === 'Peso')?.description}</span>
                                    )}
                                </div> */}
                            </div>
                            {/* Descripción principal */}
                            <div className="mb-6">
                                {/*SECTION NO LOCALIZADO 2*/}
                                {/*  <p className="text-lg font-medium mb-4">
                                    {item?.specifications?.find(spec => spec.title === 'Descripción breve')?.description || 'Sierra de poda sin escobillas XGT® para cortar matorales y ramas.'}
                                </p> */}

                                <p className="text-base text-gray-600 line-clamp-5 " dangerouslySetInnerHTML={{ __html: item?.description }}>

                                </p>

                            </div>

                            {/* Tecnologías */}
                            {item?.technologies && item.technologies.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg mb-3 customtext-neutral-dark">Tecnologías</h3>
                                    <div className="flex gap-4 flex-wrap">
                                        {item.technologies.map((technology) => (
                                            <div key={technology.id} className="flex flex-col items-center">
                                                {technology.banner && (
                                                    <img
                                                        src={`/storage/images/technology/${technology?.banner}`}
                                                        alt={technology.name}
                                                        className="h-7 object-contain"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "/api/cover/thumbnail/null")
                                                        }
                                                    />
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Simbología */}
                            {item?.symbologies && item.symbologies.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg mb-3 customtext-neutral-dark">Simbología</h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {item.symbologies.map((symbology) => (
                                            <div key={symbology.id} className="flex flex-col items-center">
                                                {symbology.image && (
                                                    <img
                                                        src={`/storage/images/symbology/${symbology.image}`}
                                                        alt={symbology.name || `Símbolo ${symbology.id}`}
                                                        className="h-8 object-contain"
                                                        aria-label={symbology.name || `Símbolo ${symbology.id}`}
                                                    />
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Botón de cotizar */}
                            <button
                                onClick={() => {
                                    handleClickWhatsAppCotizar();
                                }}
                                className="bg-[#225568] text-white py-4 px-8  text-lg shadow-lg rounded-md hover:bg-primary transition-all duration-300 mt-4"
                            >
                                Cotizar producto
                            </button>



                        </div>
                    </div>
                </div>
                {/* Pestañas de navegación */}
                <div className="bg-white rounded-xl mt-12">
                    {/* Navegación por pestañas */}
                    <div className="bg-primary  ">
                        <div className=" mx-auto 2xl:max-w-7xl px-primary 2xl:px-0">
                            <div className="flex justify-between">
                                <button
                                    className={`py-6 text-lg w-full  ${activeTab === "general" ? "border-b-2 border-primary bg-black/10 text-white " : "text-white"}`}
                                    onClick={() => setActiveTab("general")}
                                >
                                    General
                                </button>
                                <button
                                    className={`py-6 text-lg w-full  ${activeTab === "info" ? "border-b-2 border-primary bg-black/10 text-white " : "text-white"}`}
                                    onClick={() => setActiveTab("info")}
                                >
                                    Información técnica
                                </button>
                                <button
                                    className={`py-6 text-lg w-full  ${activeTab === "downloads" ? "border-b-2 border-primary bg-black/10 text-white " : "text-white"}`}
                                    onClick={() => setActiveTab("downloads")}
                                >
                                    Descargables
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-primary 2xl:px-0 mx-auto 2xl:max-w-7xl my-10">
                        {/* Pestañas de contenido */}
                        {activeTab === "general" && (
                            <div className="grid gap-12 pt-6">
                                {/* Sección de Beneficios del producto */}
                                {item?.technologies && item.technologies.length > 0 && (
                                    <div className="mb-6">

                                        <div className="flex gap-20 flex-wrap">
                                            {item.technologies.map((technology) => (
                                                <div key={technology.id} className="flex flex-col items-center">
                                                    {technology.banner && (
                                                        <img
                                                            src={`/storage/images/technology/${technology?.banner}`}
                                                            alt={technology.name}
                                                            className="h-10 object-contain"
                                                            onError={(e) =>
                                                            (e.target.src =
                                                                "/api/cover/thumbnail/null")
                                                            }
                                                        />
                                                    )}

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Especificaciones generales */}
                                {item?.specifications && item.specifications.filter(spec => spec.type === 'general').length > 0 ? (
                                    <div>
                                        <h2 className="text-3xl font-bold mb-6 customtext-neutral-dark">
                                            Especificaciones generales
                                        </h2>
                                        <div className="bg-white w-full rounded-lg shadow-sm overflow-hidden">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
                                                {item.specifications.filter(spec => spec.type === 'general').map((spec, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex items-start gap-3 py-2 `}
                                                    >
                                                        <div className="min-w-5 min-h-5 mt-1">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#1F687F" />
                                                            </svg>
                                                        </div>
                                                        <span className="customtext-neutral-dark text-lg">{spec.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
                                            </svg>
                                            <p className="text-gray-500 text-lg font-medium">No hay especificaciones generales disponibles</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                        {activeTab === "info" && (
                            <>


                                {/* Datos técnicos detallados */}
                                {item?.specifications && item.specifications.filter(spec => spec.type === 'technical').length > 0 ? (
                                    <div className="overflow-hidden w-full">
                                        <h3 className="text-3xl font-bold mb-6 customtext-neutral-dark">Especificaciones técnicas</h3>
                                        <div className="rounded-lg  shadow-sm">
                                            {item.specifications.filter(spec => spec.type === 'technical').map((spec, index) => (
                                                <div key={index} className={`flex flex-row ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                                    <div className="py-4 px-6 w-1/2 font-bold tracking-wide customtext-neutral-dark text-base">{spec.title}</div>
                                                    <div className="py-4 px-6 w-1/2 customtext-neutral-dark text-base flex items-center justify-between">
                                                        <span>{spec.description}</span>
                                                        {spec.tooltip && (
                                                            <Tippy content={spec.tooltip} arrow={true} placement="auto">
                                                                <svg
                                                                    width="20"
                                                                    height="20"
                                                                    viewBox="0 0 20 20"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="cursor-help"
                                                                >
                                                                    <path d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#262626" />
                                                                </svg>
                                                            </Tippy>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
                                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor" />
                                            </svg>
                                            <p className="text-gray-500 text-lg font-medium">No hay especificaciones técnicas disponibles</p>
                                        </div>
                                    </div>
                                )}</>
                        )}

                        {activeTab === "downloads" && (
                            <div>
                                <h2 className="text-3xl font-bold mb-6 customtext-neutral-dark">Archivos descargables</h2>
                                <div className="space-y-4">
                                    {item?.downloadables && item.downloadables.length > 0 ? (
                                        item.downloadables.map((downloadable, index) => (
                                            <div key={downloadable.id}>
                                                <div className="flex items-center justify-between py-4 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-[#E7E7E7] p-3 rounded-md">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                
                                                                <g mask="url(#mask0_181_16134)">
                                                                    <path d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19ZM6 17H18L14.25 12L11.25 16L9 13L6 17ZM8.5 10C8.91667 10 9.27083 9.85417 9.5625 9.5625C9.85417 9.27083 10 8.91667 10 8.5C10 8.08333 9.85417 7.72917 9.5625 7.4375C9.27083 7.14583 8.91667 7 8.5 7C8.08333 7 7.72917 7.14583 7.4375 7.4375C7.14583 7.72917 7 8.08333 7 8.5C7 8.91667 7.14583 9.27083 7.4375 9.5625C7.72917 9.85417 8.08333 10 8.5 10Z" fill="#262626" />
                                                                </g>
                                                            </svg>

                                                        </div>
                                                        <div>
                                                            <p className="text-base customtext-neutral-dark">{downloadable.original_name || downloadable.name}</p>
                                                            <p className="text-sm customtext-neutral-light">{(() => {
                                                                const sizeInBytes = parseInt(downloadable.size) || 0;
                                                                const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
                                                                return `${sizeInMB} MB`;
                                                            })()}</p>
                                                        </div>
                                                    </div>
                                                    <a href={`/storage/images/downloads/item/${downloadable.url}`} target="_blank" rel="noopener noreferrer" className="bg-[#219FB9] text-white px-4 py-3 rounded-md hover:bg-primary transition-colors">
                                                        Descargar {(() => {
                                                            const fileName = downloadable.original_name || downloadable.name || '';
                                                            const extension = fileName.split('.').pop()?.toUpperCase();
                                                            if (extension && extension !== fileName.toUpperCase()) {
                                                                return extension;
                                                            }
                                                            const mimeType = downloadable.mime_type || downloadable.type || '';
                                                            if (mimeType.includes('spreadsheetml') || mimeType.includes('excel')) return 'XLSX';
                                                            if (mimeType.includes('pdf')) return 'PDF';
                                                            if (mimeType.includes('word') || mimeType.includes('document')) return 'DOCX';
                                                            if (mimeType.includes('image')) return 'IMG';
                                                            return 'ARCHIVO';
                                                        })()}
                                                    </a>
                                                </div>
                                                {index < item.downloadables.length - 1 && (
                                                    <hr className="border-gray-200" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No hay archivos disponibles para descargar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {relationsItems.length > 0 && (
                <ProductMakita
                    data={{ title: "Productos relacionados" }}
                    items={relationsItems}
                    cart={cart}
                    setCart={setCart}
                    favorites={favorites}
                    setFavorites={setFavorites}
                />)}
            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
}
export default ProductDetailMakita;