import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

import CardProductMakita from "./Components/CardProductMakita";
import CompareBarModal from "./Modals/CompareBarModal";
import CompareDetailsModal from "./Modals/CompareDetailsModal";



const ProductMakita = ({ items, data, setCart, cart }) => {
    const [swiperInstance, setSwiperInstance] = useState(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const navigationDesktopPrevRef = useRef(null);
    const navigationDesktopNextRef = useRef(null);
    const navigationMobilePrevRef = useRef(null);
    const navigationMobileNextRef = useRef(null);
    // Ajuste de colores para los botones
    useEffect(() => {
        [navigationDesktopPrevRef, navigationDesktopNextRef, navigationMobilePrevRef, navigationMobileNextRef].forEach(ref => {
            if (ref.current) adjustTextColor(ref.current);
        });
    }, []);
    // Actualizar navegación cuando la instancia de Swiper esté lista
    useEffect(() => {
        if (!swiperInstance) return;

        const handleResize = () => {
            const isDesktop = window.innerWidth >= 768;
            swiperInstance.params.navigation.prevEl = isDesktop
                ? navigationDesktopPrevRef.current
                : navigationMobilePrevRef.current;

            swiperInstance.params.navigation.nextEl = isDesktop
                ? navigationDesktopNextRef.current
                : navigationMobileNextRef.current;

            swiperInstance.navigation.destroy();
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Ejecutar inicialmente

        return () => window.removeEventListener('resize', handleResize);
    }, [swiperInstance]);

    // Estado para barra de comparación
    const [compareBarOpen, setCompareBarOpen] = useState(false);
    const [compareBarMinimized, setCompareBarMinimized] = useState(false);
    const [compareProducts, setCompareProducts] = useState([]);
    const [showCompareDetails, setShowCompareDetails] = useState(false);

    // Agregar producto a la barra
    const handleCompareClick = (product) => {
        console.log('Click en comparar', product);
        setCompareBarOpen(true);
        setCompareBarMinimized(false);
        setCompareProducts((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            console.log('Productos actuales en barra:', prev, '¿Ya existe?', exists);
            if (exists || prev.length >= 4) return prev;
            const nuevos = [...prev, product];
            console.log('Nuevos productos en barra:', nuevos);
            return nuevos;
        });
    };

    // Quitar producto de la barra
    const handleRemoveCompare = (id) => {
        setCompareProducts((prev) => prev.filter((p) => p.id !== id));
    };

    // Minimizar barra
    const handleMinimizeBar = () => setCompareBarMinimized(true);
    // Restaurar barra
    const handleRestoreBar = () => setCompareBarMinimized(false);

    // Comparar (abrir modal detalles)
    const handleCompare = () => {
        if (compareProducts.length === 4) {
            setShowCompareDetails(true);
        }
    };

    // Cerrar modal detalles
    const handleCloseDetails = () => {
        setShowCompareDetails(false);
        setCompareProducts([]);
        setCompareBarOpen(false);
    };

    return (
        <section className="relative bg-[#F6F6F6] py-8">
            <div className="relative mx-auto px-primary py-10 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold customtext-neutral-dark">
                        {data?.title || "Set de nuevas máquinas"}
                    </h2>
                    <a
                        href={data?.link_catalog}
                        className="hidden md:flex bg-custom transition-all duration-300 text-white border-none justify-center flex-row items-center gap-2 px-8 py-3  rounded-md font-medium cursor-pointer hover:brightness-125"
                    >
                        Ver todo
                    </a>
                </div>

                {/* Swiper Carousel */}
                <div className="relative w-full">
                    <Swiper
                        modules={[Navigation, Grid]}
                        navigation={{
                            prevEl: navigationDesktopPrevRef.current,
                            nextEl: navigationDesktopNextRef.current,
                            enabled: true,
                        }}
                        slidesPerView={2}
                        spaceBetween={16}
                        loop={true}
                        grid={{
                            fill: 'row',
                            rows: 2,
                        }}
                        onSwiper={setSwiperInstance}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 16 },
                            768: { slidesPerView: 3, spaceBetween: 16, grid: { rows: 1 } },
                            1024: { slidesPerView: 4, spaceBetween: 20, grid: { rows: 1 } },
                            1280: { slidesPerView: 4, spaceBetween: 0, grid: { rows: 1 } },
                        }}
                       
                    >
                        {items?.map((product, index) => (
                            <SwiperSlide
                                key={index}
                                className="py-2 lg:px-4"
                            >
                                <CardProductMakita product={product} onCompareClick={() => handleCompareClick(product)} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <button
                        ref={navigationDesktopPrevRef}
                        className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12  items-center justify-center rounded-md bg-secondary bg-opacity-70 text-white hover:brightness-125"
                        aria-label="Productos anteriores"
                    >
                        <ChevronLeft width="1.3rem" />
                    </button>
                    <button
                        ref={navigationDesktopNextRef}
                        className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12  items-center justify-center rounded-md bg-secondary bg-opacity-70 text-white hover:brightness-125"
                        aria-label="Siguientes productos"
                    >
                        <ChevronRight width="1.3rem" />
                    </button>
                </div>
            </div>
            {/* Barra inferior de comparación */}
            <CompareBarModal
                open={true} // Forzar visible para depuración
                minimized={compareBarMinimized}
                products={compareProducts}
                onRemove={handleRemoveCompare}
                onCompare={handleCompare}
                onMinimize={handleMinimizeBar}
                onRestore={handleRestoreBar}
            />
            {/* Modal de detalles de comparación */}
            <CompareDetailsModal
                isOpen={showCompareDetails}
                onClose={handleCloseDetails}
                products={compareProducts}
            />
        </section>
    );
};

export default ProductMakita;
