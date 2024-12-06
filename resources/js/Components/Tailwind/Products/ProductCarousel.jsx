import React from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const ProductCarousel = ({ data, items }) => {
  return <div className="p-[5%] bg-gray-100">
    <h1 className="text-2xl font-bold mb-2">{data?.title}</h1>
    <p className="text-sm mb-4">{data?.description}</p>
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop={true}
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      }}
    >
      {items?.map((item, index) => (
        <SwiperSlide key={index} className="p-4 shadow-md rounded-md bg-white">
          <img src={`/api/courses/media/${item?.image}`} alt={item?.name} className="w-full h-full object-cover mb-2 aspect-video rounded-md" />
          <div className="w-full h-full font-bold line-clamp-1 mb-1">{item?.name}</div>
          <div className="text-sm line-clamp-2">{item?.description}</div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
}

export default ProductCarousel