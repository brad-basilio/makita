import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useRef, useState } from "react";
import CardHoverBtn from "./Components/CardHoverBtn";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const ProductInfinite = ({ items, data, setCart, cart }) => {
    const prevSlideRef = useRef(null);
    const nextSlideRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    // Ajuste de colores para los botones
    useEffect(() => {
        if (prevSlideRef.current) adjustTextColor(prevSlideRef.current);
        if (nextSlideRef.current) adjustTextColor(nextSlideRef.current);
    }, []);

    // Actualizar navegación cuando la instancia de Swiper esté lista
    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.params.navigation.prevEl = prevSlideRef.current;
            swiperInstance.params.navigation.nextEl = nextSlideRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    return (
        <section className="relative bg-sections-color">
            <div className="relative mx-auto px-[5%] py-[2.5%]">
                {/* Header */}
                <div className="md:flex justify-between items-center mb-8 pb-4 border-b customborder-neutral-light">
                    <h2 className="text-[28px] md:text-4xl font-bold font-font-secondary mb-4 md:mb-0">
                        {data?.title}
                    </h2>
                    <a
                        href={data?.link_catalog}
                        className="bg-primary transition-all duration-300 text-white border-none flex justify-center flex-row items-center gap-3 px-10 py-4 text-base rounded-xl tracking-wide font-bold cursor-pointer hover:opacity-90"
                    >
                        Ver todos
                        <Tag width="1rem" className="rotate-90" />
                    </a>
                </div>

                {/* Swiper Carousel */}
                <div className="relative">
                    <button
                        ref={prevSlideRef}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Productos anteriores"
                    >
                        <ChevronLeft width="1rem" />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: prevSlideRef.current,
                            nextEl: nextSlideRef.current,
                        }}
                        spaceBetween={16}
                        slidesPerView={2}
                        loop={true}
                        onSwiper={setSwiperInstance}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 },
                        }}
                        className=" lg:h-[500px] lg:max-h-[500px] lg:!flex lg:items-center lg:justify-center "
                    >
                        {items.map((product, index) => (
                            <SwiperSlide
                                key={index}
                                className="!h-full lg:!flex lg:items-center lg:justify-center"
                            >
                                <CardHoverBtn
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                    data={data}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        ref={nextSlideRef}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Siguientes productos"
                    >
                        <ChevronRight width="1rem" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductInfinite;
