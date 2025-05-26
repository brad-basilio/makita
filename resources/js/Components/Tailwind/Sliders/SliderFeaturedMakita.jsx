import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


export const featuredPlatforms = [
  {
    voltage: "18V | 36V",
    logoUrl: "/assets/images/lxt-logo.png",
    imageUrl: "/assets/images/makita-battery.png",
    productCount: "295+",
    productCountText: "Productos disponibles en nuestra plataforma LXT",
    buttonText: "Más información",
    buttonLink: "/platforms/lxt"
  },
  {
    voltage: "40V max XGT",
    logoUrl: "/assets/images/xgt-logo.png",
    imageUrl: "/assets/images/makita-xgt-battery.png",
    productCount: "150+",
    productCountText: "Herramientas de alta potencia XGT disponibles",
    buttonText: "Explorar XGT",
    buttonLink: "/platforms/xgt"
  },
  {
    voltage: "12V max CXT",
    logoUrl: "/assets/images/cxt-logo.png",
    imageUrl: "/assets/images/makita-cxt-battery.png",
    productCount: "100+",
    productCountText: "Herramientas compactas para mayor versatilidad",
    buttonText: "Ver serie CXT",
    buttonLink: "/platforms/cxt"
  }
];
const SliderFeaturedMakita = ({ 
  items = featuredPlatforms,
  title = "Plataformas de carga",
  description = "Duis dapibus congue velit, lobortis mollis nisi volutpat quis. Nulla facilisi. Sed efficitur, eros ut tincidunt sagittis, magna sem mollis elit, ac dapibus diam ipsum scelerisque enim."
}) => {
  return (
    <div className="relative bg-[#1a6483] overflow-hidden">
      {/* Fondo patrón */}
      <div className="absolute inset-0 opacity-30 z-0"
        style={{
          backgroundImage: 'url("/assets/images/pattern-grid.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative z-10 w-full md:max-w-7xl mx-auto flex flex-col md:flex-row items-center min-h-[480px] md:min-h-[400px] p-8 md:p-12">
        {/* Izquierda: estático */}
        <div className="w-full md:w-5/12 flex flex-col justify-center text-white pr-0 md:pr-8 mb-8 md:mb-0">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl opacity-80 mb-8">
            {description}
          </p>
        </div>
        {/* Derecha: slider */}
        <div className="w-full md:w-7/12">
          <Swiper
            slidesPerView={1}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            spaceBetween={30}
            effect={'fade'}
            observer={true}
            observeParents={true}
            className="relative"
          >
            {featuredPlatforms.map((platform, i) => (
              <SwiperSlide key={`featured-platform-${i}`}>
                <div className="relative flex flex-col md:flex-row items-center bg-white/10 rounded-xl p-8 min-h-[340px]">
                  {/* Logo y voltaje */}
                  <div className="flex flex-col items-start md:w-1/3 w-full mb-4 md:mb-0">
                    <div className="text-white text-xl md:text-2xl font-semibold mb-2">
                      {platform.voltage || "18V | 36V"}
                    </div>
                    <img 
                      src={platform.logoUrl || "/assets/images/lxt-logo.png"} 
                      alt="Logo" 
                      className="h-12 md:h-16"
                    />
                  </div>
                  {/* Imagen */}
                  <div className="flex-1 flex justify-center items-center">
                    <img 
                      src={platform.imageUrl || "/assets/images/makita-battery.png"} 
                      alt={platform.title || "Makita Battery"} 
                      className="w-48 md:w-72 object-contain"
                    />
                  </div>
                  {/* Stats y botón */}
                  <div className="flex flex-col items-start md:w-1/3 w-full mt-4 md:mt-0">
                    <div className="text-white text-4xl md:text-6xl font-bold">
                      {platform.productCount || "295+"}
                    </div>
                    <div className="text-white text-base md:text-lg opacity-80 mt-2 mb-4">
                      {platform.productCountText || "Productos... aenean mollis lorem lacus, quis accumsan elit."}
                    </div>
                    <a 
                      href={platform.buttonLink || "#"} 
                      className="inline-block bg-[#42B0CC] hover:bg-[#51c1de] text-white font-medium py-2 px-6 rounded-md transition duration-300"
                    >
                      {platform.buttonText || "Más información"}
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination !bottom-0 !relative mt-4"></div>
           
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SliderFeaturedMakita;
