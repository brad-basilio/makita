import React, { useState } from "react";
import Global from "../../../Utils/Global";
import CartModal from "../Components/CartModal";

const HeaderSearchContact = ({ data, cart, setCart, pages }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity)
  }, 0)

  const totalPrice = cart.reduce((acc, item) => {
    const finalPrice = item.discount ? item.discount : item.price
    return acc + Number(item.quantity) * finalPrice
  }, 0)

  return (
    <>
      <section className="bg-white shadow z-20 sticky top-0">
        <header className="px-[5%] mx-auto flex p-3 justify-between items-center">
          <a href="/" className="flex-shrink-0">
            <img
              className="h-12 aspect-[13/4] object-contain object-center w-auto"
              src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
              alt={Global.APP_NAME}
            />
          </a>

          <div className="hidden md:flex relative flex-grow mx-8 max-w-xl">
            <input
              type="text"
              placeholder="Estoy buscando..."
              className="w-full py-2 px-4 bg-accent rounded-full text-sm focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i className="mdi mdi-magnify text-gray-500 text-xl"></i>
            </button>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:block text-right">
              <p className="text-xs font-medium">Haz tu pedido</p>
              <p className="text-sm font-bold">(+51) 949 299 959</p>
            </div>

            <button className="hidden md:block">
              <i className="mdi mdi-account-outline text-2xl"></i>
            </button>

            <button className="hidden md:flex relative items-center">
              <i className="mdi mdi-heart-outline text-2xl"></i>
              <span className="flex items-center justify-center absolute w-5 h-5 -right-1 -top-1 bg-primary text-[10px] text-white rounded-full">
                0
              </span>
            </button>

            <button className="relative flex items-center" onClick={() => setModalOpen(true)}>
              <div className="relative">
                <i className="mdi mdi-cart-outline text-2xl"></i>
                <span className="flex items-center justify-center absolute w-5 h-5 -right-1 -top-1 bg-primary text-[10px] text-white rounded-full">
                  {totalCount}
                </span>
              </div>
              <div className="hidden md:block ml-2 text-left">
                <p className="text-xs font-medium">Tu carrito</p>
                <p className="text-sm font-bold">S/ {totalPrice.toFixed(2)}</p>
              </div>
            </button>

            <button className="md:hidden">
              <i className="mdi mdi-magnify text-2xl"></i>
            </button>
          </div>
        </header>
      </section>
      <CartModal data={data} cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  )
}

export default HeaderSearchContact