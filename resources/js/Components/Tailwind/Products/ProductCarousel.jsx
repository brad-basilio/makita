import React from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import ProductCard from "../Components/ProductCard";

const ProductCarousel = ({ data, items, cart, setCart }) => {

  if (items.length == 0) return

  return <div className="bg-gray-50">
    <div className="max-w-6xl w-full mx-auto px-4 py-[5%] md:py-[2.5%]">
      <div className="flex flex-wrap justify-between mb-[2%]">
        <div>
          {
            data?.title &&
            <h1 className="text-2xl font-bold mb-[2%]">{data?.title}</h1>
          }
          {
            data?.description &&
            <p className="text-sm mb-[3%]">{data?.description}</p>
          }
        </div>
        <button href={data?.link_catalog} className="text-primary font-bold">
          <span>Ver todos los productos</span>
          <i className="mdi mdi-arrow-top-right"></i>
        </button>
      </div>
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
            spaceBetween: 5,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {
          items?.map((item, index) => <SwiperSlide key={index}>
            <ProductCard item={item} cart={cart} setCart={setCart} />
          </SwiperSlide>)
        }
      </Swiper>
    </div>
  </div>
}

export default ProductCarousel