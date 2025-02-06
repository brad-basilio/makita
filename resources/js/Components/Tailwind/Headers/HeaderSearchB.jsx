
import { useState } from "react"

const HeaderSearchB = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wireframe%20-%201-dD7WZg4zL7Aape3mL2kpqmRNZlk68V.png"
              alt="S&T Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">S&T</span>
          </a>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-xl mx-4 lg:flex items-center relative">
            <input type="search" placeholder="Buscar productos" className="w-full pr-10 py-2 px-4 border rounded-md" />
            <button className="absolute right-0 top-0 h-full px-3" aria-label="Buscar">
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
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* Account and Cart */}
          <div className="flex items-center gap-4">
            <a href="/account" className="hidden md:flex items-center gap-2 text-sm">
              <span>Mi Cuenta</span>
            </a>
            <a href="/cart" className="flex items-center gap-2 text-sm">
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
                className="h-5 w-5"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="hidden md:inline">Mi Carrito</span>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-500 text-white rounded-full">
                0
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-sky-50">
        <div className="container mx-auto px-4">
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
