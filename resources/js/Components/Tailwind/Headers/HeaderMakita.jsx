import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import {
    CircleUser,
    DoorClosed,
    Search,
    ShoppingCart,
    XIcon,
    User,
    Settings,
    CreditCard,
} from "lucide-react";
import CartModal from "../Components/CartModal";
import Logout from "../../../Actions/Logout";
import MobileMenu from "./Components/MobileMenu";
import { motion, AnimatePresence } from "framer-motion";

const HeaderMakita = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    generals = [],
}) => {
    const phoneWhatsappObj = generals.find(
        (item) => item.correlative === "phone_whatsapp"
    );
    const messageWhatsappObj = generals.find(
        (item) => item.correlative === "message_whatsapp"
    );

    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
    const messageWhatsapp = messageWhatsappObj?.description ?? null;

    const [modalOpen, setModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [searchMobile, setSearchMobile] = useState(false);
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    // Mega menu state
    // Mega menu modal state
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    // Para scroll horizontal de marcas
    const [hoveredBrand, setHoveredBrand] = useState(null);

    // Transform flat items array into nested categories/brands/subcategories structure
    const categoriesMenu = (() => {
        if (!Array.isArray(items)) return [];
        const catMap = new Map();
        items.forEach((item) => {
            const cat = item.category;
            const brand = item.brand;
            const subcat = item.subcategory;
            if (!cat || !cat.id) return;
            if (!catMap.has(cat.id)) {
                catMap.set(cat.id, {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    marcas: new Map(),
                    subcategorias: new Map(),
                });
            }
            const catObj = catMap.get(cat.id);
            if (brand && brand.id) {
                if (!catObj.marcas.has(brand.id)) {
                    catObj.marcas.set(brand.id, {
                        id: brand.id,
                        name: brand.name,
                        slug: brand.slug,
                        subcategorias: new Map(),
                    });
                }
                if (subcat && subcat.id) {
                    catObj.marcas.get(brand.id).subcategorias.set(subcat.id, {
                        id: subcat.id,
                        name: subcat.name,
                        slug: subcat.slug,
                    });
                }
            } else if (subcat && subcat.id) {
                catObj.subcategorias.set(subcat.id, {
                    id: subcat.id,
                    name: subcat.name,
                    slug: subcat.slug,
                });
            }
        });
        // Convert maps to arrays
        return Array.from(catMap.values()).map((cat) => ({
            ...cat,
            marcas: Array.from(cat.marcas.values()).map((brand) => ({
                ...brand,
                subcategorias: Array.from(brand.subcategorias.values()),
            })),
            subcategorias: Array.from(cat.subcategorias.values()),
        }));
    })();

    const menuRef = useRef(null);
    const searchRef = useRef(null);

    const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchMobile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15
            }
        }
    };

    const menuItems = [
        {
            icon: <User size={16} />,
            label: "Mi Perfil",
            href: "/profile"
        },
        {
            icon: <ShoppingCart size={16} />,
            label: "Mis Pedidos",
            href: "/customer/dashboard"
        },
        {
            icon: <Settings size={16} />,
            label: "Configuración",
            href: "/account"
        },
        {
            icon: <DoorClosed size={16} />,
            label: "Cerrar Sesión",
            onClick: Logout
        }
    ];
    console.log("HeaderMakita", items);
    return (
        <header className={`w-full top-0 left-0 z-50 transition-all duration-300 ${isFixed ? "fixed" : "relative"} bg-primary`} style={{ boxShadow: isFixed ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-2 md:py-4 font-paragraph text-base font-semibold text-white">
                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between gap-4 min-h-[72px]">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 z-[51]">
                        <img
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            className="h-14 object-contain object-center"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/logo-bk.svg";
                            }}
                        />
                    </a>
                    {/* Categorías como items en el header (usando categoriesMenu) */}
                    <nav className="flex gap-2 relative">
                        {categoriesMenu.map((cat) => (
                            <div key={cat.id} className="relative">
                                <button
                                    className={`font-medium px-4 py-2 rounded hover:bg-primary/80 transition-colors duration-200 ${activeCategory?.id === cat.id && showMegaMenu ? 'bg-primary/90' : ''}`}
                                    onClick={() => {
                                        if (activeCategory?.id === cat.id && showMegaMenu) {
                                            setShowMegaMenu(false);
                                            setActiveCategory(null);
                                        } else {
                                            setShowMegaMenu(true);
                                            setActiveCategory(cat);
                                            setHoveredBrand(null);
                                        }
                                    }}
                                >
                                    {cat.name}
                                </button>
                            </div>
                        ))}
                    </nav>
                    {/* Mega Menu Modal: ocupa toda la pantalla debajo del header */}
                    {showMegaMenu && activeCategory && (
                        <div
                            className="fixed left-0 right-0 top-[72px] z-30 w-full h-[calc(100vh-72px)] bg-black text-white flex flex-col"
                            style={{ maxWidth: '100vw' }}
                        >
                            <div className="flex-1 flex flex-col overflow-y-auto">
                                <div className="flex gap-12 px-10 pt-10">
                                    {activeCategory.marcas && activeCategory.marcas.length > 0 ? (
                                        <>
                                            {activeCategory.marcas.map((brand) => (
                                                <div key={brand.id} className="min-w-[260px] flex flex-col">
                                                    <img src="/assets/resources/logo.png" alt="Makita" className="h-8 w-auto mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
                                                    <ul className="flex-1 flex flex-col gap-0">
                                                        {brand.subcategorias.map((subcat) => (
                                                            <li key={subcat.id} className="flex items-center group border-b border-[#444] last:border-b-0 py-2">
                                                                <span className="mr-2 text-primary text-xs">•</span>
                                                                <a
                                                                    href={`/catalogo?subcategory=${subcat.slug}`}
                                                                    className="block text-base group-hover:underline group-hover:text-primary transition-colors"
                                                                >
                                                                    {subcat.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="min-w-[260px] flex flex-col">
                                            <img src="/assets/resources/logo.png" alt="Makita" className="h-8 w-auto mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
                                            <ul className="flex-1 flex flex-col gap-0">
                                                {activeCategory.subcategorias && activeCategory.subcategorias.length > 0 ? (
                                                    activeCategory.subcategorias.map((subcat) => (
                                                        <li key={subcat.id} className="flex items-center group border-b border-[#444] last:border-b-0 py-2">
                                                            <span className="mr-2 text-primary text-xs">•</span>
                                                            <a
                                                                href={`/catalogo?subcategory=${subcat.slug}`}
                                                                className="block text-base group-hover:underline group-hover:text-primary transition-colors"
                                                            >
                                                                {subcat.name}
                                                            </a>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-400 text-sm">No hay subcategorías</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Sección inferior: Nuestro blog y colecciones */}
                            <div className="flex items-center justify-between pt-10 px-10 pb-8 border-t border-[#444]">
                                <a href="/blog" className="font-bold text-2xl text-white hover:text-primary transition-colors">Nuestro blog</a>
                                <div className="flex gap-4 text-base font-semibold text-gray-200">
                                    {['CONSTRUCCIÓN', 'CARPINTERÍA', 'MAESTRANZA', 'MINERÍA'].map((col, i, arr) => (
                                        <>
                                            <a key={col} href={`/coleccion/${col.toLowerCase()}`} className="hover:text-primary transition-colors uppercase tracking-wide">{col}</a>
                                            {i < arr.length - 1 && <span className="mx-2 text-gray-500">|</span>}
                                        </>
                                    ))}
                                </div>
                                <button onClick={() => { setShowMegaMenu(false); setActiveCategory(null); }} className="ml-8 text-white hover:text-primary text-2xl font-bold">×</button>
                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative w-full max-w-xl mx-auto">
                        <input
                            type="search"
                            placeholder="Buscar productos"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-14 py-3 pl-4 border rounded-full focus:ring-0 focus:outline-none text-black"
                        />
                        <a
                            href={search.trim() ? `/catalogo?search=${encodeURIComponent(search)}` : "#"}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            aria-label="Buscar"
                        >
                            <Search />
                        </a>
                    </div>
                    {/* Account and Cart */}
                    {data?.showLoginCart && (
                        <div className="flex items-center gap-4 relative text-sm">
                            <div ref={menuRef}>
                                {isUser ? (
                                    <button
                                        aria-label="user"
                                        className="customtext-neutral-dark flex items-center gap-2 hover:customtext-primary pr-6 transition-colors duration-300"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    >
                                        <CircleUser className="customtext-primary" />
                                        <span className="hidden md:inline">{isUser.name}</span>
                                    </button>
                                ) : (
                                    <a href="/iniciar-sesion" className="flex items-center gap-2 text-sm hover:customtext-primary transition-colors duration-300">
                                        <CircleUser className="customtext-primary" />
                                        <span className="hidden md:inline">Iniciar Sesión</span>
                                    </a>
                                )}
                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={menuVariants}
                                            className="absolute z-50 top-full left-0 bg-white shadow-xl border-t rounded-xl w-48 mt-2"
                                        >
                                            <div className="p-4">
                                                <ul className="space-y-3">
                                                    {menuItems.map((item, index) => (
                                                        <li key={index}>
                                                            {item.onClick ? (
                                                                <button
                                                                    aria-label="menu-items"
                                                                    onClick={item.onClick}
                                                                    className="flex w-full items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary transition-colors duration-300"
                                                                >
                                                                    {item.icon}
                                                                    <span>{item.label}</span>
                                                                </button>
                                                            ) : (
                                                                <a
                                                                    href={item.href}
                                                                    className="flex items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary transition-colors duration-300"
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
                                aria-label=""
                                onClick={() => setModalOpen(true)}
                                className="flex items-center relative"
                            >
                                <ShoppingCart className="customtext-primary" />
                                <span className="absolute -right-2 -top-2 inline-flex items-center justify-center w-4 h-4 bg-primary text-white rounded-full text-[8px]">
                                    {totalCount}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Mobile Header */}
                    <div className="flex md:hidden items-center justify-between gap-2 min-h-[60px]">
                        {/* Menu button */}
                        <button
                            aria-label="Menú"
                            onClick={() => setOpenMenu(!openMenu)}
                            className="flex items-center justify-center bg-primary rounded-lg w-auto h-auto p-2 text-white fill-white transition-all duration-300 z-[51]"
                        >
                            {!openMenu ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path d="M10 5H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 12H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 19H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <XIcon />
                            )}
                        </button>
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 z-[51]">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className="h-12 object-contain object-center"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/img/logo-bk.svg";
                                }}
                            />
                        </a>
                        {/* Search and Cart */}
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Buscar"
                                onClick={() => setSearchMobile(true)}
                                className="flex items-center justify-center p-2"
                            >
                                <Search className="customtext-primary" size={24} />
                            </button>
                            <button
                                aria-label="Carrito"
                                onClick={() => setModalOpen(true)}
                                className="flex items-center relative"
                            >
                                <ShoppingCart className="customtext-primary" width="1.5rem" />
                                <span className="absolute -right-2 -top-2 inline-flex items-center justify-center w-4 h-4 bg-primary text-white rounded-full text-[8px]">
                                    {totalCount}
                                </span>
                            </button>
                            {data?.showLoginCart && (
                                isUser ? (
                                    <div ref={menuRef} className="relative">
                                        <button
                                            aria-label="user"
                                            className="flex items-center gap-2 hover:customtext-primary transition-colors duration-300"
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        >
                                            <CircleUser className="customtext-primary" width="1.5rem" />
                                        </button>
                                        <AnimatePresence>
                                            {isMenuOpen && (
                                                <motion.div
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={menuVariants}
                                                    className="absolute z-50 top-full right-0 bg-white shadow-xl border-t rounded-xl w-48 mt-2"
                                                >
                                                    <div className="p-4">
                                                        <ul className="space-y-3">
                                                            {menuItems.map((item, index) => (
                                                                <li key={index}>
                                                                    {item.onClick ? (
                                                                        <button
                                                                            aria-label="menu-items"
                                                                            onClick={item.onClick}
                                                                            className="flex w-full items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary transition-colors duration-300"
                                                                        >
                                                                            {item.icon}
                                                                            <span>{item.label}</span>
                                                                        </button>
                                                                    ) : (
                                                                        <a
                                                                            href={item.href}
                                                                            className="flex items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary transition-colors duration-300"
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
                                ) : (
                                    <a href="/iniciar-sesion" className="flex items-center">
                                        <CircleUser className="customtext-primary" width="1.5rem" />
                                    </a>
                                )
                            )}
                        </div>
                    </div>
                    {/* Mobile Search Overlay */}
                    <AnimatePresence>
                        {searchMobile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="fixed top-0 left-0 right-0 bg-white p-4 z-[100] shadow-lg"
                            >
                                <div className="relative w-full max-w-xl mx-auto">
                                    <input
                                        type="search"
                                        placeholder="Buscar productos"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pr-14 py-4 pl-4 border rounded-full focus:ring-0 focus:outline-none"
                                        autoFocus
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                        <button
                                            aria-label="Cerrar"
                                            onClick={() => setSearchMobile(false)}
                                            className="p-2 bg-gray-200 text-gray-600 rounded-lg"
                                        >
                                            <XIcon size={20} />
                                        </button>
                                        <a
                                            href={search.trim() ? `/catalogo?search=${encodeURIComponent(search)}` : "#"}
                                            className="p-2 bg-primary text-white rounded-lg"
                                            aria-label="Buscar"
                                        >
                                            <Search />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Mobile Menu Overlay */}
                    <AnimatePresence>
                        {openMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="md:hidden bg-white text-textWhite shadow-lg w-full min-h-screen fixed z-40 top-[60px] left-0"
                            >
                                <MobileMenu
                                    search={search}
                                    setSearch={setSearch}
                                    pages={pages}
                                    items={items}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <CartModal
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                    />
                    {/* WhatsApp floating button (desktop only) */}
                    <div className="flex justify-end w-full mx-auto z-[100] relative">
                        <div className="hidden lg:block fixed bottom-6 sm:bottom-[2rem] lg:bottom-[4rem] z-20 cursor-pointer">
                            <a
                                target="_blank"
                                id="whatsapp-toggle"
                                href={`https://api.whatsapp.com/send?phone=${phoneWhatsapp}&text=${messageWhatsapp}`}
                            >
                                <img
                                    src="/assets/img/whatsapp.svg"
                                    alt="whatsapp"
                                    className="mr-3 w-16 h-16 md:w-[100px] md:h-[100px] animate-bounce duration-300"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );

};

export default HeaderMakita;
