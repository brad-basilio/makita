import React from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Tippy from "@tippyjs/react";
import Number2Currency from "../../../Utils/Number2Currency";
import Swal from "sweetalert2";

const ProductCarousel = ({ data, items, cart, setCart }) => {

  const onAddClicked = (item) => {
    const newCart = structuredClone(cart)
    const index = newCart.findIndex(x => x.id == item.id)
    if (index == -1) {
      newCart.push({ ...item, quantity: 1 })
    } else {
      newCart[index].quantity++
    }
    setCart(newCart)

    Swal.fire({
      title: 'Producto agregado',
      text: `Se agregó ${item.name} al carrito`,
      icon: 'success',
      timer: 1500,
    })
  }

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
        {items?.map((item, index) => {
          const inCart = cart.find(x => x.id == item.id)
          const finalPrice = item?.discount > 0 ? item?.discount : item?.price
          return <SwiperSlide key={index}>
            <img src={`/api/items/media/${item?.image}`} alt={item?.name} className="w-full h-full object-cover mb-4 aspect-square rounded-3xl shadow-lg" />
            {
              item?.category &&
              <h3 className="line-clamp-1 h-8">{item?.category?.name}</h3>
            }
            <h2 className="text-2xl line-clamp-1 font-bold mb-2">{item?.name}</h2>
            <p className="line-clamp-3 h-[72px] opacity-80 mb-4">{item?.description}</p>
            <div className="flex justify-between items-end">
              <div className="h-[52px] flex flex-col items-start justify-end">
                <span className="text-sm block opacity-80 line-through">{item?.discount > 0 ? <>S/. {Number2Currency(item?.price)}</> : ''}</span>
                <span className="text-2xl font-bold">S/. {Number2Currency(finalPrice)}</span>
              </div>
              <Tippy content='Agregar al carrito'>
                <button className="bg-primary text-white text-lg px-3 py-1 rounded disabled:cursor-not-allowed disabled:opacity-80" disabled={inCart} onClick={() => onAddClicked(item)}>
                  <i className="mdi mdi-cart-plus"></i>
                </button>
              </Tippy>
            </div>
          </SwiperSlide>
        })}
      </Swiper>
    </div>
  </div>
}

export default ProductCarousel