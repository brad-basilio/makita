import React from "react"
import { Swiper, SwiperSlide } from "swiper/react";

const ProductList = ({ data, items }) => {
  return <div>
    <h1 className="h1">{data?.title} - Lista</h1>
    <p className="p">{data?.description}</p>
    <Swiper>
      {items?.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full bg-red-500">{item?.name}</div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
}

export default ProductList