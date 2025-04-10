import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";

import CartModal from "../Components/CartModal";
import AuthRest from "../../../Actions/AuthRest";
import Logout from "../../../Actions/Logout";
const HeaderBananaLab = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    generals = [],
}) => {
    const menuItems = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/catalog" },
        { name: "Colecciones", href: "/collections" },
        { name: "Nosotros", href: "/about" },
        { name: "Contacto", href: "/contact" },
    ];

    const phoneWhatsappObj = generals.find(
        (item) => item.correlative === "phone_whatsapp"
    );
    const messageWhatsappObj = generals.find(
        (item) => item.correlative === "message_whatsapp"
    );

    const phoneWhatsapp = phoneWhatsappObj
        ? phoneWhatsappObj.description
        : null;
    const messageWhatsapp = messageWhatsappObj
        ? messageWhatsappObj.description
        : null;

    const [modalOpen, setModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [searchMobile, setSearchMobile] = useState(false);
    const totalCount = cart.reduce((acc, item) => {
        return Number(acc) + Number(item.quantity);
    }, 0);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [search, setSearch] = useState("");

    return (
        <nav className="bg-[#F8F9FA] shadow-md fonts-paragraph ">
            {/* Desktop HeaderBananaLab */}
            <div className="max-w-7xl mx-auto px-primary  lg:px-0">
                <div className="flex items-center justify-between h-20 lg:h-16">
                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            className="inline-flex items-center justify-center py-2 rounded-md customtext-neutral-light hover:customtext-primary transition-colors duration-200"
                        >
                            {openMenu ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img
                            className="h-8 w-auto"
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            onError={(e) =>
                                (e.target.src = "/api/thumbnail/null")
                            }
                        />
                    </div>
                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button className="inline-flex items-center justify-center p-2 rounded-md customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <Search className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                        <div className=" relative w-[450px] mx-auto">
                        <input
                            type="search"
                            placeholder="Buscar productos"
                            value={search} // Vincula el valor del input al estado
                            onChange={(e) => setSearch(e.target.value)} // Actualiza el estado cuando el usuario escribe
                            className="w-full pr-14 py-3  pl-4 border-0 rounded-full focus:ring-0 focus:outline-none ring-0 bg-sections-color"
                        />
                        <a
                            href={
                                search.trim()
                                    ? `/catalogo?search=${encodeURIComponent(
                                          search
                                      )}`
                                    : "#"
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2  customtext-neutral-dark rounded-lg"
                            aria-label="Buscar"
                        >
                            <Search />
                        </a>
                    </div>
                        </div>
                    </div>

                    {/* Desktop Right Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <User className="h-5 w-5" />
                        </button>
                        <button className="relative customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <Heart className="h-5 w-5" />
                            <span className="h-3 w-3 bg-secondary absolute -top-1 -right-2 text-[10px] flex items-center justify-center text-white rounded-full">0</span>
                        </button>
                        <button className="relative customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="h-3 w-3 bg-secondary absolute -top-1 -right-2 text-[10px] flex items-center justify-center text-white rounded-full">0</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${openMenu ? "block" : "hidden"}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#F8F9FA]">
                    {menuItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="fonts-paragraph customtext-neutral-dark hover:customtext-primaryy block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        >
                            {item.name}
                        </a>
                    ))}
                    <div className="flex items-center space-x-4 px-3 py-2">
                        <button className="customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <User className="h-5 w-5" />
                        </button>
                        <button className="customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <Heart className="h-5 w-5" />
                            <span className="h-2 w-2 bg-secondary absolute top-0">0</span>
                        </button>
                        <button className="customtext-neutral-light hover:customtext-primary transition-colors duration-200">
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HeaderBananaLab;
