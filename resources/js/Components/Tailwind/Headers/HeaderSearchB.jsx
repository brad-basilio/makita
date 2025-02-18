

import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import { CircleUser, DoorClosed, Search, ShoppingCart } from "lucide-react";
import CartModal from "../Components/CartModal";
import AuthRest from '../../../Actions/AuthRest'
import Logout from "../../../Actions/Logout";
const HeaderSearchB = ({ data, cart, setCart, isUser }) => {

  const [modalOpen, setModalOpen] = useState(false)

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity);
  }, 0);



  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const [search, setSearch] = useState("");
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
              value={search} // Vincula el valor del input al estado
              onChange={(e) => setSearch(e.target.value)} // Actualiza el estado cuando el usuario escribe
              className="w-full pr-14 py-4  pl-4 border rounded-full focus:ring-0 focus:outline-none"
            />
            <a
              href={search.trim() ? `/catalogo?search=${encodeURIComponent(search)}` : "#"}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg"
              aria-label="Buscar"
            >
              <Search />
            </a>
          </div>

          {/* Account and Cart */}
          <div className="flex items-center gap-4 relative text-sm">
            {isUser ? (
              <button
                className="customtext-neutral-dark flex items-center gap-2 hover:customtext-primary  pr-6 transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <CircleUser className="customtext-primary" />
                <span className="hidden md:inline">{isUser.name}</span>
              </button>
            ) : (
              <a href="/iniciar-sesion" className="flex items-center gap-2 text-sm">
                <CircleUser className="customtext-primary" />
                <span className="hidden md:inline">Iniciar Sesión</span>
              </a>
            )}
            {isMenuOpen && (
              <div className="absolute z-50 top-full left-0 bg-white shadow-xl border-t rounded-xl transition-all duration-300 ease-in-out w-40 mt-2">
                <div className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="flex items-center gap-2 customtext-neutral-dark text-xs hover:customtext-primary transition-colors duration-300 cursor-pointer">
                        <CircleUser className="customtext-primary" height="1rem" />
                        <span>Mi cuenta</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={Logout} className="flex items-center gap-2 customtext-neutral-dark text-xs hover:customtext-primary transition-colors duration-300 cursor-pointer">
                        <DoorClosed className="customtext-primary" height="1rem" />
                        <span>Cerrar sesión</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
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
