import { useEffect, useMemo, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const SliderImagen = ({ items, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(5); // Default en desktop

    // Detectar el tamaño de la pantalla para ajustar slidesPerView
    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerView(1); // Móvil
            else if (width < 1024) setSlidesPerView(3); // Tablet
            else setSlidesPerView(5); // Desktop
        };
        updateSlidesPerView();
        window.addEventListener("resize", updateSlidesPerView);
        return () => window.removeEventListener("resize", updateSlidesPerView);
    }, []);

    // Calcular el máximo número de desplazamientos permitidos
    const maxSlide = useMemo(() => {
        return Math.max(0, Math.ceil(items.length / slidesPerView) - 1);
    }, [items.length, slidesPerView]);

    // Función para avanzar al siguiente slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : prev));
    };

    // Función para retroceder al slide anterior
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const prevSlideRef = useRef(null);
    const nextSlideRef = useRef(null);
    useEffect(() => {
        adjustTextColor(prevSlideRef.current); // Aplicar a cada botón en el slider
        adjustTextColor(nextSlideRef.current); // Aplicar a cada botón en el slider
    }, []);
    return (
        <div>
            <h2 className=" text-[36px] leading-tight md:text-5xl text-center font-bold  font-font-primary py-4 md:py-8 bg-[#F7F9FB]">
                {data?.title}
            </h2>
            <div className="bg-primary py-6 md:py-8">
                <div className=" mx-auto px-primary">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={prevSlide}
                            ref={prevSlideRef}
                            disabled={currentSlide === 0}
                            className="absolute -left-2 z-10 p-2 bg-white rounded-lg shadow-lg"
                            aria-label="Previous brand"
                        >
                            <svg
                                className="h-4 w-4 customtext-neutral-dark"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <div className="overflow-hidden w-full px-4">
                            {/* Movemos px-4 aquí */}
                            <div
                                className="flex items-center transition-all duration-300 ease-in-out w-full"
                                style={{
                                    transform: `translateX(-${
                                        currentSlide * (100 / slidesPerView)
                                    }%)`,
                                }}
                            >
                                {items.map((brand, index) => (
                                    <div
                                        key={index}
                                        className="group w-full flex items-center justify-center md:items-center md:justify-start px-2 sm:w-1/3 lg:w-1/5 flex-shrink-0 font-font-secondary"
                                    >
                                        <img
                                            src={`/api/brands/media/${brand.image}`}
                                            alt={brand.name}
                                            className="h-10 w-full object-contain grayscale brightness-0 invert"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={nextSlide}
                            ref={nextSlideRef}
                            disabled={currentSlide >= maxSlide}
                            className="absolute -right-2 z-10 p-2 bg-white rounded-lg shadow-lg "
                            aria-label="Next brand"
                        >
                            <svg
                                className="h-4 w-4 customtext-neutral-dark"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SliderImagen;
