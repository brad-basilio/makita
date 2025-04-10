import { Hexagon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";
const CarruselBananaLab = ({ items }) => {
    // Duplicamos los elementos para lograr el efecto infinito
    const infiniteBenefits = [...items, ...items];
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const totalWidth = slider.scrollWidth / 2; // La mitad porque duplicamos la lista
            let start = 0;

            const animate = () => {
                start -= 1; // Velocidad de desplazamiento
                if (Math.abs(start) >= totalWidth) {
                    start = 0; // Reinicia el scroll sin que se note el corte
                }
                slider.style.transform = `translateX(${start}px)`;
                requestAnimationFrame(animate);
            };

            animate();
        }
    }, []);

    const pasos = [
        {
            name: "Paso 1",
            description: "Elige tus fotos, diseñados, lo que tú quieras",
            image: "/assets/img/backgrounds/resources/paso1.png",
        },
        {
            name: "Paso 2",
            description: "Selecciona tus productos entre cientos de opciones",
            image: "/assets/img/backgrounds/resources/paso2.png",
        },
        {
            name: "Paso 3",
            description: "Crea tu proyecto seleccionado tus fotos",
            image: "/assets/img/backgrounds/resources/paso3.png",
        },
        {
            name: "Paso 4",
            description: "Selecciona tus productos entre cientos de opciones",
            image: "/assets/img/backgrounds/resources/paso4.png",
        },
    ];
    return (
        <div className=" pl-[5%] lg:px-[5%] overflow-hidden customtext-neutral-dark  font-paragraph mt-5 lg:mt-10 lg:flex lg:gap-8 2xl:px-0 2xl:max-w-7xl mx-auto">
            <div className="bg-secondary rounded-l-3xl 2xl:px-0  2xl:max-w-7xl mx-auto relative lg:w-9/12 lg:rounded-3xl">
                <div className="lg:hidden pl-4 py-4">
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1.8, spaceBetween: 20 },
                            640: { slidesPerView: 1, spaceBetween: 10 },
                            1024: { slidesPerView: 1, spaceBetween: 0 },
                        }}
                        modules={[Navigation, Pagination]}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                        }
                    >
                        {pasos.map((benefit, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    key={index}
                                    className="flex  bg-[#F4B8B8] p-4 flex-col rounded-xl  justify-center h-[230px]  "
                                >
                                    <div className="relative w-20 h-20 rounded-full flex  justify-start">
                                        {/* Ícono */}
                                        <div className="relative z-10 text-3xl">
                                            <img
                                                src={`/storage/images/indicator/${benefit.symbol}`}
                                                onError={(e) =>
                                                    (e.target.src =
                                                        benefit.image)
                                                }
                                                className="w-full h-auto "
                                            />
                                        </div>
                                    </div>
                                    <p className="font-bold text-white mt-4">
                                        {benefit.name}
                                    </p>{" "}
                                    <p className="text-white text-lg  leading-6">
                                        {benefit.description}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className="hidden lg:grid grid-cols-2 lg:p-4 lg:gap-4">
                    {pasos.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex  bg-[#F4B8B8] p-4 flex-col lg:flex-row lg:items-center lg:gap-4 rounded-xl  justify-center h-[230px] lg:h-auto "
                        >
                            <div className="relative w-20 h-20 rounded-full flex  justify-start lg:justify-center lg:items-center">
                                {/* Ícono */}
                                <div className="relative z-10 text-3xl">
                                    <img
                                        src={`/storage/images/indicator/${benefit.symbol}`}
                                        onError={(e) =>
                                            (e.target.src = benefit.image)
                                        }
                                        className="w-full h-auto "
                                    />
                                </div>
                            </div>
                            <div className="lg:flex lg:flex-col">
                                <p className="font-bold text-white mt-4 lg:mt-0">
                                    {benefit.name}
                                </p>{" "}
                                <p className="text-white text-lg  leading-6">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className=" h-[330px] w-full pr-[5%] relative lg:w-4/12 ">
                <img
                    src="/assets/img/backgrounds/resources/anuncio-mobile.png"
                    className="absolute h-[350px]    object-cover object-left lg:w-auto h:h-full lg:bottom-0  lg:right-0"
                />
            </div>
        </div>
    );
};

export default CarruselBananaLab;
