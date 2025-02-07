
import { useState } from "react"
import Global from "../../../Utils/Global";
import { CircleUser, Search, ShoppingCart } from "lucide-react";

const HeaderSearchB = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full">
      <div className="px-primary mx-auto py-4 font-font-secondary text-base font-semibold">
        <div className="flex items-center justify-between gap-4 ">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-14 aspect-[13/4] object-contain object-center" />


          </a>

          {/* Search Bar */}
          <div className="relative w-full max-w-xl mx-auto">
            <input
              type="search"
              placeholder="Buscar productos"
              className="w-full pr-14 py-4 pl-4 border rounded-full focus:ring-0 focus:outline-none"
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
            <a href="/cart" className="flex items-center gap-2 text-sm relative">
              <div className="customtext-primary">
                <ShoppingCart />
              </div>
              <span className="hidden md:inline">Mi Carrito</span>
              <span className="absolute -right-6 -top-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-white rounded-full">
                0
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-secondary font-font-secondary font-normal text-sm">
        <div className="px-primary mx-auto ">
          <ul className="flex items-center gap-6 text-sm">
            <li className="relative py-3">
              <button className="flex items-center" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                Categorias
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 origin-top-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                    Categoría 1
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                    Categoría 2
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                    Categoría 3
                  </a>
                </div>
              )}
            </li>
            <li className="py-3">
              <a href="/gift-card" className="hover:text-blue-500">
                Gift Card
              </a>
            </li>
            <li className="py-3">
              <a href="/nosotros" className="hover:text-blue-500">
                Nosotros
              </a>
            </li>
            <li className="py-3">
              <a href="/blog" className="hover:text-blue-500">
                Blog
              </a>
            </li>
            <li className="py-3">
              <a href="/contacto" className="hover:text-blue-500">
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
export default HeaderSearchB;
