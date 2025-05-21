import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import "swiper/css";

const CarruselBenefitsPaani = ({ items }) => {
  const benefitsRef = useRef(null);

  useEffect(() => {
    adjustTextColor(benefitsRef.current);
  }, []);

  // Helper to highlight **text** in description
  const highlightDescription = (desc) => {
    const parts = desc.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <span key={i} className="font-bold text-primary-700">
          {part.slice(2, -2)}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div ref={benefitsRef} className="bg-primary py-10 overflow-hidden">
      <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={32}
          loop={true}
          breakpoints={{
            768: {
              slidesPerView: 4,
              loop: false,
              allowTouchMove: false,
            },
          }}
          className="w-full"
        >
          {items.map((benefit, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col h-full ">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 h-full  transition   duration-200">
                  <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-md w-20 h-20 md:w-16 md:h-16 p-2">
                    <img
                      alt={benefit.name}
                      src={`/storage/images/indicator/${benefit.symbol}`}
                      className="w-14 h-14 md:w-12 md:h-12 object-contain"
                      onError={(e) => {
                        e.target.src = "/api/cover/thumbnail/null";
                      }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                    <p className="text-base leading-tight text-primary-900">
                      {highlightDescription(benefit.description)}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CarruselBenefitsPaani;
