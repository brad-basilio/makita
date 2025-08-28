
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


const BrandMakita = ({ data, items }) => {
  const [technologiesWithPosts, setTechnologiesWithPosts] = useState([]);

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const res = await axios.get('/api/technologies/with-recent-posts');
        setTechnologiesWithPosts(res.data);
      } catch (error) {
        console.error('Error fetching technologies with posts:', error);
        setTechnologiesWithPosts([]);
      }
    }
    fetchTechnologies();
  }, []);

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
      <div className="container mx-auto px-4 md:px-[5%] relative z-10">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {data?.title}
          </h2>
          {/* View More Button */}
          <a
            href={data?.link_catalog}
            className="inline-block text-lg relative z-20 bg-[#225568] hover:bg-custom  text-white  font-medium py-4 px-6 tracking-wider rounded-md transition-all duration-300"
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
            {technologiesWithPosts.map((tech) => {
              const recentPost = tech.recent_post;
              return (
                <SwiperSlide key={tech.id}>
                  <div className="flex flex-col items-center">
                    {/* Technology Logo */}
                    <div className="mb-6 h-16 flex items-center">
                      <img
                        src={`/storage/images/technology/${tech.image}`}
                        alt={`${tech.name} logo`}
                        className="h-auto max-h-full"
                        onError={e => e.target.src = '/api/cover/thumbnail/null'}
                      />
                    </div>
                    {/* Contenido del post o tecnología */}
                    {recentPost ? (
                      <>
                        {/* Imagen del post */}
                        <div className="mb-6 h-48 flex items-center">
                          <img
                            src={`/storage/images/post/${recentPost.image}`}
                            alt={`${recentPost.title}`}
                            className="h-auto max-h-full object-cover rounded-lg"
                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                          />
                        </div>
                        {/* Título del post */}
                        <h3 className="text-lg font-semibold text-center mb-4 text-white line-clamp-2">{recentPost.title}</h3>
                      </>
                    ) : (
                      <>
                        {/* Banner de la tecnología cuando no hay post */}
                        <div className="mb-6 h-48 flex items-center">
                          <img
                            src={`/storage/images/technology/${tech.banner}`}
                            alt={`${tech.name} banner`}
                            className="h-auto max-h-full object-cover rounded-lg"
                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                          />
                        </div>
                        {/* Nombre de la tecnología */}
                        <h3 className="text-lg font-semibold text-center mb-4 text-white line-clamp-2">{tech.name}</h3>
                      </>
                    )}
                    {/* View More Link */}
                    <a
                      href={recentPost ? `/posts/${recentPost.slug}` : `#${tech.id}`}
                      className="inline-block bg-custom text-white text-sm font-medium py-3 px-4 rounded-md transition-all duration-300 mt-auto"
                    >
                      {recentPost ? 'Leer más' : 'Ver más'}
                    </a>
                  </div>
                </SwiperSlide>
              );
            })}          </Swiper>

          {/* Paginación mejorada y centrada - movida fuera del Swiper */}
          <div className="w-full flex justify-center mt-5">
            <div className="flex gap-3">
              {technologiesWithPosts.map((_, index) => (
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

        {/* Desktop Swiper */}
        <div className="hidden lg:block mt-16">
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={technologiesWithPosts.length > 4}
            centeredSlides={technologiesWithPosts.length < 4}
            pagination={{
              clickable: true,
              el: '.desktop-swiper-pagination',
            }}
            breakpoints={{
              1024: {
                slidesPerView: 4,
                centeredSlides: technologiesWithPosts.length < 4,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 3,
                centeredSlides: technologiesWithPosts.length < 3,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                centeredSlides: technologiesWithPosts.length < 2,
                spaceBetween: 15,
              }
            }}
            className="relative"
          >
            {technologiesWithPosts.map((tech) => {
              const recentPost = tech.recent_post;
              return (
                <SwiperSlide key={tech.id}>
                  <div className="flex flex-col items-center h-full">
                    {/* Technology Logo */}
                    <h3 className="text-xl max-w-[200px] text-center leading-6 mb-4">{tech?.description}</h3>
                    <div className="mb-6 h-12 flex items-center">
                      <img
                        src={`/storage/images/technology/${tech.image}`}
                        alt={`${tech.name} logo`}
                        className="h-full w-auto object-contain"
                        onError={e => e.target.src = '/api/cover/thumbnail/null'}
                      />
                    </div>
                    {/* Contenido del post o tecnología */}
                    {recentPost ? (
                      <>
                        {/* Imagen del post */}
                        <div className="mb-6 h-48 flex items-center">
                          <img
                            src={`/storage/images/post/${recentPost.image}`}
                            alt={`${recentPost.title}`}
                            className="h-auto max-h-full object-cover rounded-lg"
                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                          />
                        </div>
                        {/* Título del post */}
                        <p className="text-base font-paragraph tracking-wider text-center mb-4 text-[#F6F6F6] line-clamp-4">{recentPost?.summary}</p>
                      </>
                    ) : (
                      <>
                        {/* Banner de la tecnología cuando no hay post */}
                        <div className="mb-6 h-48 flex items-center">
                          <img
                            src={`/storage/images/technology/${tech.banner}`}
                            alt={`${tech.name} banner`}
                            className="h-auto max-h-full object-cover rounded-lg"
                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                          />
                        </div>
                        {/* Nombre de la tecnología */}
                        <h3 className="text-lg font-semibold text-center mb-4 text-white line-clamp-2">{tech.name}</h3>
                      </>
                    )}
                    {/* View More Link */}
                    <a
                      href={recentPost ? `/posts/${recentPost.slug}` : `#${tech.id}`}
                      className="inline-block tracking-wider text-lg bg-custom hover:bg-[#225568] text-white font-medium py-3 px-4 rounded-md transition-all duration-300 mt-auto"
                    >
                      {recentPost ? 'Leer más' : 'Ver más'}
                    </a>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          
          {/* Desktop Pagination */}
          {technologiesWithPosts.length > 4 && (
            <div className="w-full flex justify-center mt-8">
              <div className="desktop-swiper-pagination flex gap-3"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrandMakita;
