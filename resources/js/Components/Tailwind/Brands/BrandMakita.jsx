
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


const BrandMakita = ({ data, items }) => {
  const [relatedProducts, setRelatedProducts] = useState({});

  useEffect(() => {
    async function fetchRelated() {
      const productsMap = {};
      await Promise.all(
        items.map(async (item) => {
          try {
            // Llama a la API para traer el producto destacado/reciente de la marca (item.id es el id de la marca)
            const res = await axios.get(`/api/brands/${item.id}/featured-item`);
            productsMap[item.id] = res.data.item;
          } catch {
            productsMap[item.id] = null;
          }
        })
      );
      setRelatedProducts(productsMap);
    }
    if (items && items.length > 0) fetchRelated();
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const swiperRef = useRef(null);
  return (
    <section className="relative  w-full bg-secondary text-white py-16 md:py-24">
      {/* Círculo blanco transparente en top left */}
      <div 
        className="absolute -top-56 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full z-[2]"
        style={{
          background: 'linear-gradient(126deg, #888 20.76%, #D1D1D1 61.55%)',
          mixBlendMode: 'overlay',
          filter: 'blur(70px)'
        }}
      />
      <div className="container mx-auto px-4 md:px-[5%]">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {data?.title}
          </h2>
          {/* View More Button */}
          <a
            href={data?.link_catalog}
            className="inline-block bg-custom bg-opacity-40  text-white text-base font-medium py-4 px-6 rounded-md transition-all duration-300"
          >
            {data?.button_text}
          </a>
        </div>

        {/* Mobile Swiper */}
        <div className="block lg:hidden mt-16">
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
            {items.map((tech) => {
              const related = relatedProducts[tech.id];
              return (
                <SwiperSlide key={tech.id}>
                  <div className="flex flex-col items-center">
                    {/* Technology Logo */}
                    <div className="mb-6 h-16 flex items-center">
                      <img
                        src={`/storage/images/brand/${tech.image}`}
                        alt={`${tech.name} logo`}
                        className="h-auto max-h-full"
                        onError={e => e.target.src = '/api/cover/thumbnail/null'}
                      />
                    </div>
                    {related && (
                      <>
                        {/* Imagen del producto */}
                        <div className="mb-6 h-48 flex items-center">
                          <img
                            src={`/storage/images/item/${related.image}`}
                            alt={`${related.name} herramienta`}
                            className="h-auto max-h-full"
                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                          />
                        </div>
                        {/* Descripción del producto */}
                        <p className="text-base text-center mb-6 prose line-clamp-4 text-white" dangerouslySetInnerHTML={{ __html: related.description }} />
                      </>
                    )}
                    {/* View More Link */}
                    <a
                      href={`#${tech.id}`}
                      className="inline-block bg-custom text-white text-sm font-medium py-3 px-4 rounded-md transition-all duration-300 mt-auto"
                    >
                      Ver más
                    </a>
                  </div>
                </SwiperSlide>
              );
            })}          </Swiper>

          {/* Paginación mejorada y centrada - movida fuera del Swiper */}
          <div className="w-full flex justify-center mt-5">
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
                  className={`transition-all duration-300 rounded-full flex items-center justify-center
                    ${currentIndex === index + 1
                      ? 'w-3 h-3 bg-primary brightness-125 shadow-lg'
                      : 'w-3 h-3  bg-gray-100 hover:bg-primary/30'}
                  `}
                  style={{ outline: 'none' }}
                >

                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {items.map((tech) => {
            const related = relatedProducts[tech.id];
            return (
              <div key={tech.id} className="flex flex-col items-center">
                {/* Technology Logo */}
                <div className="mb-6 h-16 flex items-center">
                  <img
                    src={`/storage/images/brand/${tech.image}`}
                    alt={`${tech.name} logo`}
                    className="h-auto max-h-full"
                    onError={e => e.target.src = '/api/cover/thumbnail/null'}
                  />
                </div>
                {related && (
                  <>
                    {/* Imagen del producto */}
                    <div className="mb-6 h-48 flex items-center">
                      <img
                        src={`/storage/images/item/${related.image}`}
                        alt={`${related.name} herramienta`}
                        className="h-auto max-h-full"
                        onError={e => e.target.src = '/api/cover/thumbnail/null'}
                      />
                    </div>
                    {/* Descripción del producto */}
                    <p className="text-base text-center mb-6 prose line-clamp-4 text-white" dangerouslySetInnerHTML={{ __html: related.description }} />
                  </>
                )}
                {/* View More Link */}
                <a
                  href={`#${tech.id}`}
                  className="inline-block bg-custom text-white text-sm font-medium py-3 px-4 rounded-md transition-all duration-300 mt-auto"
                >
                  Ver más
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandMakita;
