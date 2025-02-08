

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import CardHoverBtn from "./Components/CardHoverBtn"
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const ProductInfinite = ({ items, data }) => {




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

                        href="#"
                        className="bg-primary text-white border-2 border-none flex flex-row items-center gap-3 px-3 md:px-6 py-3 text-base rounded-lg tracking-wide font-bold"
                    >
                        Ver todos
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.9961 10H11.0111M10.9998 16H11.0148"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M7 13H15"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M17.5 5C18.3284 5 19 5.67157 19 6.5C19 7.32843 18.3284 8 17.5 8C16.6716 8 16 7.32843 16 6.5C16 5.67157 16.6716 5 17.5 5Z"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z"
                                stroke="white"
                                stroke-width="1.5"
                            />
                        </svg>
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
                                <CardHoverBtn product={product} />
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