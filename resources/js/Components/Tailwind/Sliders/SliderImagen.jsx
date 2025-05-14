import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useRef } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const SliderImagen = ({ items, data }) => {
    const prevSlideRef = useRef(null);
    const nextSlideRef = useRef(null);
    const swiperRef = useRef(null);

    // Ajustar colores de los botones
    useEffect(() => {
        adjustTextColor(prevSlideRef.current);
        adjustTextColor(nextSlideRef.current);
    }, []);

    return (
        <div>
            <h2 className="text-[36px] leading-tight md:text-5xl text-center font-bold font-font-primary py-4 md:py-8 bg-[#F7F9FB]">
                {data?.title}
            </h2>
            <div className="bg-primary py-6 md:py-8">
                <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                    <div className="relative flex items-center justify-center">
                        <button
                            ref={prevSlideRef}
                            className="absolute -left-2 z-10 p-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform"
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

                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                prevEl: prevSlideRef.current,
                                nextEl: nextSlideRef.current,
                            }}
                            loop={true}
                            spaceBetween={16}
                            slidesPerView={1}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                1024: {
                                    slidesPerView: 5,
                                    centeredSlides: true,
                                },
                            }}
                            className="w-full  !px-10 2xl:!px-4 !flex !justify-between"
                        >
                            {items.map((brand, index) => (
                                <SwiperSlide key={index}>
                                    <div className="group w-full flex items-center justify-center px-2 font-font-secondary">
                                        <img
                                            src={`/storage/images/brand/${brand.image}`}
                                            alt={brand.name}
                                            className="h-10 w-full object-contain grayscale brightness-0 invert hover:scale-105 transition-transform cursor-pointer"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            ref={nextSlideRef}
                            className="absolute -right-2 z-10 p-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform"
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
