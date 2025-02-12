

import { useState } from "react";
import Global from "../../../Utils/Global";
import { CircleUser, Search, ShoppingCart } from "lucide-react";
import CartModal from "../Components/CartModal";

const HeaderSearchB = ({ data, cart, setCart }) => {

  const [modalOpen, setModalOpen] = useState(false)

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity);
  }, 0);
  return (
    <header className="w-full">
      <div className="px-primary mx-auto py-4 font-font-secondary text-base font-semibold">
        <div className="flex items-center justify-between gap-4 ">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-14  object-contain object-center" />


          </a>

          {/* Search Bar */}
          <div className="relative w-full max-w-xl mx-auto">
            <input
              type="search"
              placeholder="Buscar productos"
              className="w-full pr-14 py-4  pl-4 border rounded-full focus:ring-0 focus:outline-none"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg"
              aria-label="Buscar"
            >
              <Search />
            </button>
          </div>

          {/* Account and Cart */}
          <div className="flex items-center gap-4">
            <a href="/account" className="hidden md:flex items-center gap-2 text-sm">
              <div className="customtext-primary">
                <CircleUser />
              </div>
              <span>Mi Cuenta</span>
            </a>
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 text-sm relative">
              <div className="customtext-primary">
                <ShoppingCart />
              </div>
              <span className="hidden md:inline">Mi Carrito</span>
              <span className="absolute -right-6 -top-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-white rounded-full">
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <CartModal data={data} cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </header>
  )
}
export default HeaderSearchB;
