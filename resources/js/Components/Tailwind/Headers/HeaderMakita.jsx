import React, { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import {
  CircleUser,
  DoorClosed,
  Search,
  ShoppingCart,
  XIcon,
  User,
  Settings,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import CartModal from "../Components/CartModal";
import Logout from "../../../Actions/Logout";
import MobileMenu from "./Components/MobileMenu";
import { motion, AnimatePresence } from "framer-motion";
import { set } from "lodash";

const HeaderMakita = ({
  items,
  data,
  cart,
  setCart,
  isUser,
  pages,
  generals = [],
}) => {
  const phoneWhatsappObj = generals.find((item) => item.correlative === "phone_whatsapp");
  const messageWhatsappObj = generals.find((item) => item.correlative === "message_whatsapp");

  const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
  const messageWhatsapp = messageWhatsappObj?.description ?? null;

  const [modalOpen, setModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchMobile, setSearchMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Mega menu state
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activePlatform, setActivePlatform] = useState(null);

  // Additional states for mobile menu
  const [mobileActiveCat, setMobileActiveCat] = useState(null);
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const [showMobileSubmenu, setShowMobileSubmenu] = useState(false);
  
  // Filter state for applications
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Categories, Platforms, Families, Applications
  const categories = Array.from(new Set(items.map((item) => JSON.stringify(item.category)))).map((item) => {
    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  }).filter(category => category && category.name);

  // Debug logs
  // Obtener todas las plataformas únicas
  const platforms = Array.from(new Set(items.map((item) => JSON.stringify(item.platform)))).map((item) => {
    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  }).filter(platform => platform && platform.name)

  // Obtener todas las familias únicas
  const families = Array.from(new Set(items.map((item) => JSON.stringify(item.family)))).map((item) => {
    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  }).filter(family => family && family.name)

  // Obtener todas las aplicaciones únicas
  const applications = Array.from(new Set(items.map((item) => {
    if (item.applications && Array.isArray(item.applications)) {
      return item.applications.map(app => JSON.stringify(app))
    }
    return []
  }).flat())).map((item) => {
    try {
      return JSON.parse(item)
    } catch (e) {
      return null
    }
  }).filter(app => app && app.name)
  
  // Filtrar aplicaciones únicas por nombre para evitar duplicados
  const uniqueApplications = applications.filter((app, index, self) => 
    index === self.findIndex(a => a.name.trim().toUpperCase() === app.name.trim().toUpperCase())
  )



  // Función para obtener plataformas por categoría (con filtro de aplicación)
  const getPlatformsByCategory = (categoryId) => {
    let filteredItems = items || [];
    
    // Si hay una aplicación seleccionada, filtrar items por esa aplicación
    if (selectedApplication) {
      filteredItems = items?.filter(item => 
        item?.applications && 
        item.applications.some(app => app?.id === selectedApplication?.id)
      ) || [];
    }
    
    return platforms?.filter(platform =>
      filteredItems.some(item => item?.category?.id === categoryId && item?.platform?.id === platform?.id)
    ) || []
  }

  // Función para obtener familias por categoría y plataforma (con filtro de aplicación)
  const getFamiliesByCategoryAndPlatform = (categoryId, platformId) => {
    const categoryFamilies = [];
    const familyNames = new Set();
    
    let filteredItems = items || [];
    
    // Si hay una aplicación seleccionada, filtrar items por esa aplicación
    if (selectedApplication) {
      filteredItems = items?.filter(item => 
        item?.applications && 
        item.applications.some(app => app?.id === selectedApplication?.id)
      ) || [];
    }
    
    filteredItems.forEach(item => {
      if (
        item?.category?.id === categoryId &&
        item?.platform?.id === platformId &&
        item?.family
      ) {
        const familyName = item.family?.name?.trim()?.toUpperCase();
        if (familyName && !familyNames.has(familyName)) {
          categoryFamilies.push(item.family);
          familyNames.add(familyName);
        }
      }
    });
    return categoryFamilies;
  }

  // Función para obtener familias por categoría (cuando no hay plataformas, con filtro de aplicación)
  const getFamiliesByCategory = (categoryId) => {
    const categoryFamilies = [];
    const familyNames = new Set();
    
    let filteredItems = items || [];
    
    // Si hay una aplicación seleccionada, filtrar items por esa aplicación
    if (selectedApplication) {
      filteredItems = items?.filter(item => 
        item?.applications && 
        item.applications.some(app => app?.id === selectedApplication?.id)
      ) || [];
    }
    
    filteredItems.forEach(item => {
      if (item?.category?.id === categoryId && item?.family) {
        const familyName = item.family?.name?.trim()?.toUpperCase();
        if (familyName && !familyNames.has(familyName)) {
          categoryFamilies.push(item.family);
          familyNames.add(familyName);
        }
      }
    });
    return categoryFamilies;
  }

  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchMobile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsFixed(true)
      } else {
        setIsFixed(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const menuItems = [
    {
      icon: <User size={16} />,
      label: "Mi Perfil",
      href: "/profile",
    },
    {
      icon: <ShoppingCart size={16} />,
      label: "Mis Pedidos",
      href: "/customer/dashboard",
    },
    {
      icon: <Settings size={16} />,
      label: "Configuración",
      href: "/account",
    },
    {
      icon: <DoorClosed size={16} />,
      label: "Cerrar Sesión",
      onClick: Logout,
    },
  ];

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
  `;

  // Mobile menu handlers
  const handleMobileMenuItemClick = (category) => {
    setMobileActiveCat(category);
    setShowMobileSubmenu(true);
  };

  const handleBackToMainMenu = () => {
    setShowMobileSubmenu(false);
    setMobileActiveCat(null);
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <header
        className={`w-full top-0 left-0 z-50 transition-all duration-300 ${isFixed ? "fixed" : "relative"} bg-primary`}
        style={{ boxShadow: isFixed ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex px-4 2xl:px-0 2xl:max-w-7xl items-center justify-between mx-auto py-3 font-paragraph text-base font-semibold text-white">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 z-[51] py-2 rounded">
            <img
              src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
              alt={Global.APP_NAME}
              className="h-8 object-contain object-center"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/assets/img/logo-bk.svg"
              }}
            />
          </a>

          {/* Navigation Menu */}
          <nav className="flex gap-1 relative flex-1 justify-center">
            {categories.map((cat) => (
              <div key={cat.id} className="relative">
                <button
                  className={`font-medium px-4 py-2 text-sm uppercase tracking-wide hover:bg-white/10 transition-colors duration-200 ${activeCategory?.id === cat.id && showMegaMenu ? "bg-white/20" : ""}`}
                  onClick={() => {
                    setShowSearch(false)
                    if (activeCategory?.id === cat.id && showMegaMenu) {
                      setShowMegaMenu(false)
                      setActiveCategory(null)
                    } else {
                      setShowMegaMenu(true)
                      setActiveCategory(cat)
                      setActivePlatform(null)
                    }
                  }}
                >
                  {cat.name}
                </button>
              </div>
            ))}
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <button onClick={() => {
                setShowMegaMenu(false)
                setActiveCategory(null); setShowSearch(!showSearch)
              }} className="p-2 bg-secondary hover:bg-secondary rounded transition-colors">
                <Search size={20} />
              </button>
            </div>

            {/* Account and Cart */}
            {data?.showLoginCart && (
              <div className="flex items-center gap-4 relative text-sm">
                <div ref={menuRef}>
                  {isUser ? (
                    <button
                      aria-label="user"
                      className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded transition-colors duration-300"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <CircleUser size={20} />
                      <span className="hidden lg:inline">{isUser.name}</span>
                    </button>
                  ) : (
                    <a
                      href="/iniciar-sesion"
                      className="flex items-center gap-2 text-sm hover:bg-white/10 px-3 py-2 rounded transition-colors duration-300"
                    >
                      <CircleUser size={20} />
                      <span className="hidden lg:inline">Iniciar Sesión</span>
                    </a>
                  )}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        className="absolute z-50 top-full right-0 bg-white shadow-xl border rounded-lg w-48 mt-2"
                      >
                        <div className="p-4">
                          <ul className="space-y-3">
                            {menuItems.map((item, index) => (
                              <li key={index}>
                                {item.onClick ? (
                                  <button
                                    aria-label="menu-items"
                                    onClick={item.onClick}
                                    className="flex w-full items-center gap-3 text-gray-700 text-sm hover:text-[#00B5CE] transition-colors duration-300"
                                  >
                                    {item.icon}
                                    <span>{item.label}</span>
                                  </button>
                                ) : (
                                  <a
                                    href={item.href}
                                    className="flex items-center gap-3 text-gray-700 text-sm hover:text-[#00B5CE] transition-colors duration-300"
                                  >
                                    {item.icon}
                                    <span>{item.label}</span>
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  aria-label="cart"
                  onClick={() => setModalOpen(true)}
                  className="flex items-center relative p-2 hover:bg-white/10 rounded transition-colors"
                >
                  <ShoppingCart size={20} />
                  {totalCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold">
                      {totalCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header - Simplified with just logo and menu button */}
        <div className="flex md:hidden items-center justify-between px-4 py-2">


          {/* Logo - centered */}
          <a href="/" className="flex items-center justify-start z-[51]">
            <img
              src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
              alt={Global.APP_NAME}
              className="h-10 object-contain object-center"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/assets/img/logo-bk.svg"
              }}
            />
          </a>

          {/* Menu button */}
          <button
            aria-label="Menú"
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center justify-center bg-secondary p-2 rounded-lg text-white z-[51]"
          >
            {!openMenu ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M10 5H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 12H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 19H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <XIcon size={24} />
            )}
          </button>


        </div>



        <CartModal data={data} cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} />

        {/* WhatsApp floating button */}
        <div className="flex justify-end w-full mx-auto z-[100] relative">
          <div className="hidden lg:block fixed bottom-6 sm:bottom-[2rem] lg:bottom-[4rem] z-20 cursor-pointer">
            <a
              target="_blank"
              id="whatsapp-toggle"
              href={`https://api.whatsapp.com/send?phone=${phoneWhatsapp}&text=${messageWhatsapp}`}
              rel="noreferrer"
            >
              <img
                src="/assets/img/whatsapp.svg"
                alt="whatsapp"
                className="mr-3 w-16 h-16 animate-bounce duration-300"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Keep the desktop Mega Menu Modal */}
      <AnimatePresence>
        {showMegaMenu && activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed left-0 right-0 z-40 w-full bg-secondary text-white shadow-2xl hidden md:block`}
            style={{
              top: isFixed ? 64 : 120, // 64px when fixed, 120px otherwise
            }}
          >
            {/* Botón cerrar */}
            <div className="relative max-w-7xl mx-auto pt-4 ">
              <button
                onClick={() => {
                  setShowMegaMenu(false)
                  setActiveCategory(null)
                  setSelectedApplication(null)
                }}
                className="text-white absolute right-0 hover:text-[#00B5CE] transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Cerrar menú"
              >
                <XIcon size={24} />
              </button>
            </div>
            
            {/* Contenido principal del mega menú */}
            <div className="max-w-7xl mx-auto px-6 pb-8 max-h-[calc(80vh-100px)] overflow-hidden">
              {/* Si hay plataformas para esta categoría, mostrarlas en scroll horizontal */}
              {getPlatformsByCategory(activeCategory?.id).length > 0 ? (
                <div
                  className="flex gap-8 overflow-x-auto pb-2 custom-scrollbar"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    maxWidth: '100%',
                    overflowX: 'auto',
                  }}
                >
                  {getPlatformsByCategory(activeCategory?.id).map((platform) => {
                    // Cada card ocupa 1/3 del contenedor (por ejemplo, 33vw menos el gap)
                    const cardWidth = 'min(400px, 33vw)';
                    return (
                      <div
                        key={platform.id}
                        className="flex-shrink-0 space-y-4 bg-secondary rounded-lg p-4"
                        style={{
                          minWidth: cardWidth,
                          maxWidth: cardWidth,
                          width: cardWidth,
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Encabezado de la plataforma */}
                        <div className="pb-2 flex gap-4">
                          <img src={`/storage/images/platform/${platform?.image}`} alt={platform?.name || 'Plataforma'} className="h-10 object-contain" onError={(e) =>
                          (e.target.src =
                            "/api/cover/thumbnail/null")
                          } />
                          <h3 className="text-white font-bold text-lg mt-2">{platform?.description || platform?.name || 'Sin nombre'}</h3>
                        </div>
                        {/* Lista de familias */}
                        <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                          {/* Scrollbar mejorado con estilo más redondeado */}
                          {getFamiliesByCategoryAndPlatform(activeCategory?.id, platform?.id).length > 0 ? (
                            getFamiliesByCategoryAndPlatform(activeCategory?.id, platform?.id).map((family) => (
                              <li key={family?.id}>
                                <a
                                  href={`/catalogo?category=${activeCategory?.slug}&platform=${platform?.slug}&family=${family?.slug}`}
                                  className="text-white hover:text-[#00B5CE] border-b pb-2 border-white/40 transition-colors text-sm flex items-center gap-2"
                                >
                                  <span className="text-[#00B5CE]">•</span>
                                  <span>{family?.name || 'Sin nombre'}</span>
                                </a>
                              </li>
                            ))
                          ) : (
                            <li className="flex flex-col items-center justify-center py-6 text-white/70">
                              <svg className="w-10 h-10 text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <p className="text-xs font-medium text-center">Sin familias disponibles</p>
                              <p className="text-xs text-white/50 text-center">No hay familias para esta plataforma</p>
                            </li>
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Si no hay plataformas, mostrar familias directamente en grid */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {getFamiliesByCategory(activeCategory?.id).length > 0 ? (
                    getFamiliesByCategory(activeCategory?.id).map((family) => (
                      <a
                        key={family?.id}
                        href={`/categoria/${activeCategory?.slug}/${family?.slug}`}
                        className="bg-secondary hover:bg-white/10 rounded-lg p-4 transition-colors"
                      >
                        <h3 className="text-white font-medium text-sm">{family?.name || 'Sin nombre'}</h3>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-white/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <div className="text-white/70 text-lg mb-2 font-medium">
                          No hay productos disponibles
                        </div>
                        <p className="text-white/50 text-sm max-w-md">
                          {selectedApplication ? 
                            `No se encontraron productos para la aplicación "${selectedApplication?.name}" en esta categoría.` :
                            'No hay familias de productos disponibles en esta categoría en este momento.'
                          }
                        </p>
                        {selectedApplication && (
                          <button
                            onClick={() => setSelectedApplication(null)}
                            className="mt-4 px-4 py-2 bg-[#00B5CE] text-white hover:bg-[#00A0B8] transition-colors text-sm inline-flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Ver todos los productos
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sección inferior - Aplicaciones */}
            <div className="bg-secondary border-t border-gray-600">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h4 className="text-2xl font-bold text-white">Filtrar por Aplicación:</h4>
                    {selectedApplication && (
                      <button
                        onClick={() => setSelectedApplication(null)}
                        className="text-[#00B5CE] hover:text-white transition-colors text-sm font-medium px-3 py-1 border border-[#00B5CE] rounded-full"
                      >
                        Limpiar filtro
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {uniqueApplications.map((application, index, array) => (
                      <React.Fragment key={application.id || application.name}>
                        <button
                          onClick={() => {
                            setSelectedApplication(selectedApplication?.id === application.id ? null : application);
                          }}
                          className={`transition-colors  text-sm font-medium uppercase tracking-wide px-3 py-2  ${
                            selectedApplication?.id === application.id 
                              ? 'bg-[#00B5CE] text-white' 
                              : 'text-white hover:text-[#00B5CE] hover:bg-white/10'
                          }`}
                        >
                          {application.name}
                        </button>
                        {index < array.length - 1 && <span className="text-white hidden md:inline">|</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Search Menu */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed left-0 right-0 z-40 w-full bg-white text-black shadow-2xl hidden md:block`}
            style={{
              top: isFixed ? 64 : 125, // 64px when fixed, 120px otherwise
            }}
            onMouseLeave={() => {
              setShowSearch(false)
            }}
          >
            {/* Contenido principal del mega menú */}
            <div className="max-w-7xl mx-auto px-6 py-8 max-h-[calc(80vh-100px)] overflow-hidden">
              <div className="block relative w-full max-w-xl">
                <a
                  href={search.trim() ? `/catalogo?search=${encodeURIComponent(search)}` : "#"}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 customtext-neutral-dark transition-colors"
                  aria-label="Buscar"
                >
                  <Search />
                </a>

                <input
                  type="search"
                  placeholder="Buscar productos"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-20 py-2 border-none rounded-full focus:ring-0 focus:outline-none"
                />

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* New Mobile Menu Overlay - Based on screenshots */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-primary fixed left-0 w-full h-[calc(100vh-56px)] z-[9999] overflow-hidden"
           style={{
              top: isFixed ? 50 : 110, // 64px when fixed, 120px otherwise
            }}
         
         >
           <div className="px-4 py-3 border-b border-white/10 bg-white">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 customtext-neutral-dark" size={20} />
                    <input
                      type="search"
                      placeholder="Búsqueda"
                      value={mobileSearchValue}
                      onChange={(e) => setMobileSearchValue(e.target.value)}
                      className="w-full pl-10 py-2 bg-transparent border-b border-white/40 customtext-neutral-dark placeholder-black focus:outline-none focus:border-white"
                    />
                 
                  </div>
                </div>
            {!showMobileSubmenu ? (
              // Main menu with search and categories
              <div className="h-full flex flex-col">
                {/* Search bar */}
               
                
                {/* Categories list */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <ul className="divide-y divide-white/10">
                    {categories.map((category) => (
                      <li key={category.id} className="border-b border-white/10 text-white">
                        <button
                          onClick={() => handleMobileMenuItemClick(category)}
                          className="flex items-center justify-between w-full p-4 text-left hover:bg-white/5"
                        >
                          <span className="text-base font-medium uppercase">{category.name}</span>
                          <ChevronRight size={20} />
                        </button>
                      </li>
                    ))}

                    {/* Additional static menu items */}
                    <li className="border-b border-white/10 text-white">
                      <a
                        href="/blog"
                        className="flex items-center justify-between w-full p-4 text-left hover:bg-white/5"
                      >
                        <span className="text-base font-medium uppercase">NUESTRO BLOG</span>
                        <ChevronRight size={20} />
                      </a>
                    </li>
                    
            

                  </ul>
                </div>
              </div>
            ) : (
              // Submenu showing brands and subcategories
              <div className="h-full flex flex-col bg-secondary">
                {/* Header with back button */}
                <div className="sticky top-0 bg-secondary border-b border-white/10">
                  <button
                    onClick={handleBackToMainMenu}
                    className="flex items-center gap-2 p-4 text-white"
                  >
                    <ChevronLeft size={20} />
                    <span className="text-sm font-medium uppercase">{mobileActiveCat?.name}</span>
                  </button>
                </div>

                {/* Brands and subcategories */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 pb-14">
                  {getBrandsByCategory(mobileActiveCat?.id).length > 0 ? (
                    <div className="p-4 space-y-6">
                      {getBrandsByCategory(mobileActiveCat?.id).map((brand) => (
                        <div key={brand.id} className="space-y-3">
                          {/* Brand header */}
                          <div className="flex items-center gap-2">
                            <img
                              src={`/storage/images/brand/${brand.image}`}
                              alt={brand.name}
                              className="h-6 w-auto object-contain"
                              onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                            />
                        
                          </div>

                          {/* Subcategories */}
                          <ul className="pl-4 space-y-2">
                            {getSubcategoriesByCategoryAndBrand(mobileActiveCat?.id, brand.id).map((subcategory) => (
                              <li key={subcategory.id}>
                                 <a
                                href={`/categoria/${subcategory.slug}/${subcategory.slug}`}
                                className="text-white hover:customtext-primary border-b pb-2 border-white/40 transition-colors text-sm flex items-center gap-2"
                              >
                                <span className="text-[#00B5CE]">•</span>
                                <span>{subcategory.name}</span>
                              </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Display subcategories directly if no brands
                    <ul className="p-4 space-y-2">
                      {getSubcategoriesByCategory(mobileActiveCat?.id).map((subcategory) => (
                        <li key={subcategory.id}>
                            <a
                                href={`/categoria/${subcategory.slug}/${subcategory.slug}`}
                                className="text-white hover:customtext-primary border-b pb-2 border-white/40 transition-colors text-sm flex items-center gap-2"
                              >
                                <span className="text-[#00B5CE]">•</span>
                                <span>{subcategory.name}</span>
                              </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderMakita;