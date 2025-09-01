import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import axios from "axios";
import 'swiper/css';
import 'swiper/css/pagination';

const BlogSectionMakita = ({ data, items: initialItems }) => {
    const [items, setItems] = useState(initialItems || []);
    const [loading, setLoading] = useState(false);

    // Fetch posts excluding technology category
    useEffect(() => {
        async function fetchRecentPosts() {
            try {
                setLoading(true);
                console.log('Fetching posts from API...');
                const response = await axios.get('/api/posts/recent-excluding-technology');
                console.log('API Response:', response);
                console.log('API Response Data:', response.data);
                
                // Check if response has success and data properties
                if (response.data && response.data.success && response.data.data) {
                    console.log('Setting items with:', response.data.data);
                    setItems(response.data.data);
                } else {
                    console.log('Using direct response.data:', response.data);
                    setItems(response.data || []);
                }
            } catch (error) {
                console.error('Error fetching recent posts:', error);
                setItems(initialItems || []);
            } finally {
                setLoading(false);
            }
        }
        
        fetchRecentPosts();
    }, []);


    

    const [currentIndex, setCurrentIndex] = useState(1);
    const swiperRef = useRef(null);
    // Función para truncar texto
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    // Preparar contenido HTML para extraer texto plano
    const getTextFromHTML = (html) => {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    return (
        <section className="bg-[#F6F6F6] py-16 md:py-20">
            <div className="px-primary mx-auto  2xl:px-0 2xl:max-w-7xl">
                {/* Center aligned header */}
                <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold customtext-neutral-dark mb-4">
                        {data?.title || "Noticias sobre Makita"}
                    </h2>
                    <p className="customtext-neutral-light text-lg mb-8">
                        {data?.description || "Duis dapibus congue velit, lobortis mollis nisi volutpat quis."}
                    </p>
                    <a 
                        href={data?.link_blog || "/blogs"} 
                        className="inline-block bg-custom hover:bg-secondary text-white font-medium py-3 px-6 text-lg rounded-md transition-all duration-500"
                    >
                        {data?.button_text || "Ver blog"}
                    </a>
                </div>

                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom"></div>
                    </div>
                )}

                {/* Mobile Swiper - 2 posts per slide */}
                <div className={`block md:hidden mt-12 ${loading ? 'opacity-50' : ''}`}>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        pagination={{
                            clickable: true,
                              el: '.swiper-pagination',
                        }}

                        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                        className="relative pb-12"
                    >
                        {/* Crear slides con 2 artículos cada uno */}
                        {Array.isArray(items) && items.length > 0 && Array.from({ length: Math.ceil(items.length / 2) }, (_, slideIndex) => (
                            <SwiperSlide key={slideIndex}>
                                <div className="grid grid-cols-1 gap-4">
                                    {items.slice(slideIndex * 2, slideIndex * 2 + 2).map((post, itemIndex) => (
                                      <a href={`/post/${post?.slug}`}>
                                         <article 
                                            key={slideIndex * 2 + itemIndex}
                                            className="flex flex-col gap-4 bg-white rounded-xl overflow-hidden"
                                        >
                                            {/* Image container */}
                                            <div className="w-full aspect-video flex-shrink-0">
                                                <img
                                                    src={`/storage/images/post/${post?.image}`}
                                                    onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                                    alt={post?.name}
                                                    className="w-full aspect-video object-cover rounded-xl"
                                                />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="w-full flex flex-col justify-center py-2">
                                                <h3 className="text-sm font-bold mb-2 customtext-neutral-dark line-clamp-2">
                                                    {post?.name || "Todo lo que puedes hacer con tu Rotomartillo Inalámbrico"}
                                                </h3>
                                                
                                                <p className="customtext-neutral-light text-xs line-clamp-2">
                                                    {truncateText(getTextFromHTML(post?.description), 80) || 
                                                    "Duis dapibus congue velit, lobortis mollis nisi volutpat quis."}
                                                </p>
                                            </div>
                                        </article>
                                      </a>
                                     
                                    ))}
                                </div>
                            </SwiperSlide>
                        ))}
                            {/* Paginación mejorada y centrada - movida fuera del Swiper */}
          <div className="w-full flex justify-center mt-5">
            <div className="flex gap-3">
              {Array.isArray(items) && items.map((_, index) => (
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
                    </Swiper>
                </div>

                {/* Desktop Grid - 2x2 on desktop */}
                <div className={`hidden md:grid grid-cols-2 gap-8 mt-12 ${loading ? 'opacity-50' : ''}`}>
                    {Array.isArray(items) && items.length > 0 && items.slice(0, 4).map((post, index) => (
                      <a href={`/post/${post?.slug}`}>
                      <article 
                            key={index}
                            className="flex flex-col items-center md:flex-row gap-6 bg-white rounded-xl overflow-hidden"
                        >
                            {/* Image container */}
                            <div className="w-full md:w-1/3">
                                <img
                                    src={`/storage/images/post/${post?.image}`}
                                    onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    alt={post?.name}
                                    className="w-full aspect-square object-cover"
                                />
                            </div>
                            
                            {/* Content */}
                            <div className="w-full md:w-2/3 pl-4">
                                <h3 className="text-2xl font-bold mb-2 customtext-neutral-dark line-clamp-2">
                                    {post?.name || "Todo lo que puedes hacxer con tu Rotomartillo Inalámbrico"}
                                </h3>
                                
                                <p className="customtext-neutral-light line-clamp-3 ">
                                    {truncateText(getTextFromHTML(post?.description), 120) || 
                                    "Duis dapibus congue velit, lobortis mollis nisi volutpat quis. Nulla facilisi. Sed efficitur, eros ut tincidunt sagittis, magna sem mollis elit."}
                                </p>
                            </div>
                        </article>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSectionMakita;