import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';



const SliderFeaturedMakita = ({
  items,
  data
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const swiperRef = useRef(null);
  return (
    <div 
      className="relative bg-primary overflow-hidden py-8 lg:py-12"
      style={{
        backgroundImage: 'url(/assets/img/makita/bg-SliderFeaturedMakita.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Degradado para que la imagen se vea más en el bottom */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, #1F687F 40%,  transparent 100%)'
        }}
      />

      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to left, #1F687F 10%,  transparent 100%)'
        }}
      />
       <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to right, #1F687F 10%,  transparent 100%)'
        }}
      />
      
      {/* Círculo blanco transparente en top left */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full z-[2]"
        style={{
          background: 'linear-gradient(126deg, #888 20.76%, #D1D1D1 61.55%)',
          mixBlendMode: 'overlay',
          filter: 'blur(70px)'
        }}
      />
      
      {/* Fondo patrón */}
      <div className="absolute inset-0 opacity-30 z-[3]"
        
      />
      <div className="relative z-10 w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto flex flex-col md:flex-row items-center min-h-[480px] md:min-h-[400px] py-8 md:py-12">
        {/* Izquierda: estático */}
        <div className="w-full md:w-5/12 flex flex-col justify-center text-white pr-0 md:pr-8 mb-8 md:mb-0">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {data?.title}
          </h2>
          <p className="text-lg md:text-xl opacity-80 mb-8">
            {data?.description}
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
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
          >
            {items.map((item, i) => (
              <SwiperSlide key={`featured-platform-${i} relative flex flex-col !cursor-grab`}>
                <div 
                  className="h-[550px] lg:h-auto flex flex-col w-full !cursor-grab lg:w-11/12 md:flex-row items-center bg-secondary lg:bg-black/10 rounded-xl p-8 min-h-[340px] hover:bg-primary brightness-100 hover:brightness-125 transition-colors duration-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Logo y voltaje */}
                  <div className="flex flex-col items-start w-full  md:w-6/12  md:mb-0 gap-4">

                    <img
                      src={`/storage/images/brand/${item?.brand.image}`}
                      alt="Logo"
                      className="h-12 md:h-16"
                    />

                    <div className="text-white text-base md:text-lg opacity-80 mt-2 mb-4 prose line-clamp-4" dangerouslySetInnerHTML={{ __html: item?.description }}>

                    </div>
                    <a
                       href={`/product/${item.slug}`}
                      className="inline-block bg-primary font-medium brightness-125 text-white  py-4 px-6 rounded-md transition-colors duration-300"
                    >
                       Más información
                    </a>
                  </div>
                  {/* Imagen */}

                  {/* Stats y botón */}
                  <div className="flex flex-col items-start w-full  md:w-5/12 mt-4 md:mt-0 ">
                    <div className="flex-1 flex justify-center items-center absolute lg:top-0 bottom-0 right-5 lg:-right-20">
                      <div className="w-[350px] h-[300px] lg:w-[500px] lg:h-[400px] overflow-hidden">
                        <img
                          src={`/storage/images/item/${item?.banner}`}
                          alt={item?.name}
                          className="w-full h-full object-contain object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
                {/* Paginación mejorada y centrada */}
                <div className="w-full flex justify-center mt-6 mb-2 absolute bottom-4 left-0 right-0 z-20">
                  <div className="flex gap-3">
                    {items.map((_, index) => (
                      <button
                        key={`dot-${index}`}
                        aria-label={`Ir al slide ${index + 1}`}
                        onClick={() => {
                          setCurrentIndex(index + 1);
                          if (swiperRef.current) {
                            swiperRef.current.slideToLoop(index);
                          }
                        }}
                        onMouseEnter={() => {
                          setCurrentIndex(index + 1);
                          if (swiperRef.current) {
                            swiperRef.current.slideToLoop(index);
                          }
                        }}
                        className={`transition-all duration-300 rounded-full flex items-center justify-center hover:scale-110
                          ${currentIndex === index + 1
                            ? `w-3 h-3 ${isHovered ? 'bg-primary' : 'bg-primary brightness-125'} shadow-lg`
                            : `w-3 h-3 ${isHovered ? 'bg-white/70' : 'bg-gray-100'} hover:bg-primary/70`}
                        `}
                        style={{ outline: 'none' }}
                      >
                      
                      </button>
                    ))}
                  </div>
                </div>
          

          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SliderFeaturedMakita;

