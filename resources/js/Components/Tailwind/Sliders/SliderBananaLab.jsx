import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

const SliderBananaLab = ({ items, data }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const buttonsRef = useRef([]);

    useEffect(() => {
        buttonsRef.current.forEach((button) => {
            if (button) adjustTextColor(button); // Aplicar a cada botón en el slider
        });
    }, [items]);
    return (
        <div className="px-primary mx-auto my-6 font-paragraph relative 2xl:px-0 2xl:max-w-7xl">
            <Swiper
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
            }}
                slidesPerView={3}
                spaceBetween={30}
                loop={true}
                breakpoints={{
                    0: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 1, spaceBetween: 10 },
                    1024: { slidesPerView: 1, spaceBetween: 0 },
                }}
                modules={[Navigation, Pagination]}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div
                            key={`slide-${index}`}
                            className=" h-[760px] lg:h-[500px] rounded-3xl  bg-sections-color   relative flex flex-col overflow-hidden"
                        >
                            <img
                                src={`/assets/img/backgrounds/sliders/slider.png`}
                                alt={item.name}
                                loading="lazy"
                                className="absolute bottom-0 -rotate-180  left-0  object-cover object-right-bottom  h-full lg:top-0 lg:right-0 lg:rotate-0 "
                            />

                            <div className="p-5 py-8 lg:max-w-2xl lg:px-16 lg:flex lg:items-center lg:h-full">
                                <div className="flex flex-col gap-5 lg:gap-5 items-start">
                                    <h2
                                        className="w-[95%] text-[32px] font-semibold leading-9 lg:text-4xl"
                                        style={{
                                            textShadow:
                                                "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        {item.name}
                                    </h2>
                                    <p
                                        className="my-2 w-10/12 customtext-neutral-light text-sm leading-tight "
                                        style={{
                                            textShadow:
                                                "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        {item.description}
                                    </p>

                                    <a
                                        href={item.button_link}
                                        ref={(el) =>
                                            (buttonsRef.current[index] = el)
                                        }
                                        className="bg-primary z-50 my-1 w-7/12 h-11 flex items-center justify-center rounded-full text-white text-sm font-semibold lg:w-max lg:px-10 "
                                    >
                                        {item.button_text}
                                    </a>
                                </div>
                            </div>
                            <img
                                src={`/storage/images/slider/${item.bg_image || "undefined"
                                    }`}
                                alt={item.name}
                                loading="lazy"
                                className="absolute -bottom-40 w-auto h-[600px] object-cover lg:right-0 lg:h-[700px]"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Paginacion personalizada */}
            <div className="absolute bottom-4 z-50 left-1/2 -translate-x-1/2 flex justify-center gap-2 mt-10 lg:hidden">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={`rounded-full transition-all duration-300 ${index === activeIndex
                                ? "bg-primary w-[16px] h-[16px] "
                                : " bg-white  w-[16px] h-[16px] "
                            }`}
                    />
                ))}
            </div>

            {/* Botones de navegación personalizados */}
            <div className="hidden lg:flex absolute bottom-10 right-10 z-50  gap-4">
                <div className="  custom-prev cursor-pointer  h-14 w-14 flex items-center justify-center bg-primary brightness-125  text-white hover:brightness-100  hover:bg-primary rounded-full transition-all duration-300">
                <ChevronLeft/>
                </div>

                <div className=" custom-next cursor-pointer h-14 w-14 flex items-center justify-center bg-primary brightness-125 text-white  hover:brightness-100   hover:bg-primary rounded-full transition-all durantion-300">
                   <ChevronRight/>
                </div>
            </div>
        </div>
    );
};

export default SliderBananaLab;
