import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const InfiniteCategory = ({ items, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(6); // Default en desktop

    // Detectar el tamaño de la pantalla para ajustar slidesPerView
    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerView(2); // Móvil
            else if (width < 1024) setSlidesPerView(3); // Tablet
            else setSlidesPerView(6); // Desktop
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
        <section className="py-12">
            <div className="w-full px-[5%] py-[2.5%] mx-auto">
                <h2 className="text-[28px] md:text-4xl font-bold pb-4 mb-8 font-font-secondary border-b customborder-neutral-light">
                    {data?.title}
                </h2>
                <div className="relative">
                    {/* Botón de retroceso */}
                    <button
                        ref={prevSlideRef}
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary  disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Categoría anterior"
                    >
                        <ChevronLeft width={"1rem"} />
                    </button>

                    {/* Contenedor de categorías */}
                    <div className="overflow-hidden py-4">
                        <div
                            className="flex transition-transform justify-center duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentSlide * (100 / slidesPerView)
                                }%)`,
                            }}
                        >
                            {items.map((category) => (
                                <div
                                    key={category.id}
                                    className="group   px-2 w-1/2 sm:w-1/3 lg:w-1/6 flex-shrink-0 group-hover:shadow-xl"
                                >
                                    <a
                                        href={`/catalogo?category=${category.slug}`}
                                        className="block group"
                                    >
                                        <div className="bg-sections-color rounded-xl p-4 transition-transform duration-300 ">
                                            <div className="aspect-square relative mb-4">
                                                <img
                                                    src={`/storage/images/category/${category.image}`}
                                                    alt={category.name}
                                                    className="w-full h-full object-contain  transition-transform duration-300 group-hover:scale-110"
                                                    loading="lazy"
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "/api/cover/thumbnail/null")
                                                    }
                                                />
                                            </div>
                                            <h3 className="text-center font-semibold text-base customtext-neutral-dark">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón de avance */}
                    <button
                        ref={nextSlideRef}
                        onClick={nextSlide}
                        disabled={currentSlide >= maxSlide}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8  flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Categoría siguiente"
                    >
                        <ChevronRight width={"1rem"} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InfiniteCategory;
