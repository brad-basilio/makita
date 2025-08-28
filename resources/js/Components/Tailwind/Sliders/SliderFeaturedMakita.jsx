import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';



const SliderFeaturedMakita = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  
  // Cargar plataformas con conteo de productos desde la API
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/platforms/with-product-count');
        const result = await response.json();
        
        if (result.success && result.data) {
          setPlatforms(result.data);
        }
      } catch (error) {
        console.error('Error fetching platforms:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlatforms();
  }, []);
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
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full z-[2]"
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
            Plataformas de carga
          </h2>
          <p className="text-lg md:text-xl opacity-80 mb-8">
           Duis dapibus congue velit, lobortis mollis nisi volutpat quis. Nulla facilisi. Sed efficitur, eros ut tincidunt sagittis, magna sem mollis elit, ac dapibus diam ipsum scelerisque enim.
          </p>
        </div>
        {/* Derecha: slider */}
        <div className="w-full md:w-7/12">
          {loading ? (
            <div className="flex items-center justify-center h-[340px] bg-black/10 rounded-xl">
              <div className="text-white text-lg">Cargando plataformas...</div>
            </div>
          ) : platforms.length === 0 ? (
            <div className="flex items-center justify-center h-[340px] bg-black/10 rounded-xl">
              <div className="text-white text-lg">No hay plataformas disponibles</div>
            </div>
          ) : (
            <Swiper
              slidesPerView={1}
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={platforms.length > 1}
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
              {platforms.map((platform, i) => (
              <SwiperSlide key={`featured-platform-${i}`} className="relative flex flex-col !cursor-grab">
                <div 
                  className="h-[550px] lg:h-auto group flex flex-col w-full !cursor-grab lg:w-11/12 md:flex-row items-center bg-secondary lg:bg-black/10 rounded-xl p-8 min-h-[340px] hover:bg-primary brightness-100 hover:brightness-125 transition-all duration-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Información de la plataforma */}
                  <div className="flex flex-col items-start w-full md:w-6/12 md:mb-0 gap-4">
                    
                    {/* Nombre y descripción de la plataforma */}
                    <div className="space-y-2 flex flex-col items-center">
                  
                      <div className="text-white text-base md:text-2xl opacity-80 font-bold tracking-wider  line-clamp-3" 
                           dangerouslySetInnerHTML={{ __html: platform?.description || platform?.name }}>
                      </div>

                       {/* Logo de la plataforma */}
                    <img
                      src={`/storage/images/platform/${platform?.image}`}
                      alt={platform?.name || 'Plataforma'}
                      className="h-12 md:h-16 object-contain"
                      onError={(e) => {
                        e.target.src = "/api/cover/thumbnail/null";
                      }}
                    />
                    </div>
                    
                   


                    {/* Contador de productos */}
                    <div className="flex flex-col items-start gap-3  rounded-lg px-4 py-2">
                   
                      <span className="text-white font-bold text-5xl tracking-wider">
                        {platform?.items_count || 0}+
                      </span>
                      <p className='text-white text-lg'>{platform?.content}</p>
                    </div>

                    {/* Botón de acción */}
                    <a
                      href={`/catalogo?platform=${platform?.slug}`}
                      className="inline-flex items-center gap-2 bg-custom group-hover:bg-black/20 font-medium text-white py-4 px-6 rounded-md transition-all duration-300 hover:scale-105"
                    >
                      Ver productos
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>

                  {/* Imagen de la plataforma */}
                  <div className="flex flex-col items-start w-full md:w-5/12 mt-4 md:mt-0">
                    <div className="flex-1 flex justify-center items-center absolute lg:top-0 bottom-0 right-5 lg:-right-20">
                      <div className="w-[350px] h-[300px] lg:w-[500px] lg:h-[400px] overflow-hidden">
                        <img
                          src={`/storage/images/platform/${platform?.banner || platform?.image}`}
                          alt={platform?.name}
                          className="w-full h-full object-contain object-center filter drop-shadow-2xl"
                          onError={(e) => {
                            e.target.src = "/api/cover/thumbnail/null";
                          }}
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
                    {platforms.map((_, index) => (
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
            )}
          </div>
      </div>
    </div>
  );
};

export default SliderFeaturedMakita;

