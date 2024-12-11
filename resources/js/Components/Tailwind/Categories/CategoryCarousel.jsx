import React from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const CategoryCarousel = ({ data, items }) => {
  return <div className="bg-gray-100">
    <div className="max-w-6xl w-full mx-auto p-4 py-8">
      {
        data?.title &&
        <h1 className="text-2xl font-bold mb-4">{data?.title}</h1>
      }
      {
        data?.description &&
        <p className="text-sm mb-4">{data?.description}</p>
      }
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 1.2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2.2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3.2,
            spaceBetween: 20,
          },
        }}
      >
        {items?.map((item, index) => (
          <SwiperSlide key={index} className="p-4 shadow-md rounded-2xl bg-white w-full aspect-[4/3] flex items-center justify-center">
            <img className="absolute w-full h-full rounded-2xl top-0 left-0 object-cover object-center" src={`/api/categories/media/${item.image}`} alt="" />
            <div className="relative">
              <h2>{item.name}</h2>
              <button href={`/${data?.path}/${item.slug}`}>
              Ver productos
              <i className="ms-1 mdi mdi-arrow-top-right"></i>
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
}

export default CategoryCarousel