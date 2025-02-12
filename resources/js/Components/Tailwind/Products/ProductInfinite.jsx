

import { ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import CardHoverBtn from "./Components/CardHoverBtn"
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const ProductInfinite = ({ items, data, setCart, cart }) => {




    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(6); // Default en desktop

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
        <section className="py-12 bg-[#F7F9FB]">
            <div className=" mx-auto px-primary">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2 customborder-neutral-light">
                    <h2 className="text-4xl font-bold  font-font-secondary ">{data?.title}</h2>
                    <a

                        href={data.link_catalog}
                        className="bg-primary text-white border-2 border-none flex flex-row items-center gap-3 px-3 md:px-6 py-3 text-base rounded-lg tracking-wide font-bold"
                    >
                        Ver todos
                        <Tag width={"1rem"} className="rotate-90" />
                    </a>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Previous button */}
                    <button
                        onClick={prevSlide}
                        ref={prevSlideRef}
                        disabled={currentSlide === 0}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-secondary rounded-lg "
                        aria-label="Productos anteriores"
                    >
                        <ChevronLeft width={"1rem"} />
                    </button>

                    {/* Products container */}
                    <div className="overflow-hidden py-4">
                        <div
                            className="flex items-center transition-all duration-300   ease-in-out "
                            style={{
                                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
                            }}
                        >
                            {items.map((product) => (
                                <CardHoverBtn product={product} setCart={setCart} cart={cart} />
                            ))}
                        </div>
                    </div>

                    {/* Next button */}
                    <button
                        onClick={nextSlide}
                        ref={nextSlideRef}
                        disabled={currentSlide >= maxSlide}
                        className="absolute  -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-secondary rounded-lg  "
                        aria-label="Siguientes productos"
                    >
                        <ChevronRight width={"1rem"} />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ProductInfinite;