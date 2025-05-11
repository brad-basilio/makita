import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import {
    CircleUser,
    DoorClosed,
    Search,
    ShoppingCart,
    XIcon,
} from "lucide-react";
import CartModal from "../Components/CartModal";
import Logout from "../../../Actions/Logout";
import MobileMenu from "./Components/MobileMenu";
const HeaderSearchB = ({
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
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [search, setSearch] = useState("");

    return (
        <header
            className={`w-full ${
                openMenu ? "fixed w-screen h-screen bg-white  z-50" : "relative"
            } `}
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 font-font-secondary text-base font-semibold">
                <div className=" flex items-center justify-between gap-4 ">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            className="h-14  object-contain object-center"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/logo-bk.svg";
                            }}
                        />
                    </a>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex  md:hidden items-center justify-center bg-primary rounded-lg w-auto h-auto p-2 text-white fill-white transition-all duration-300"
                    >
                        {!openMenu ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M10 5H20"
                                    stroke="white"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M4 12H20"
                                    stroke="white"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M4 19H14"
                                    stroke="white"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        ) : (
                            <XIcon />
                        )}
                    </button>
                    {/* Navigation */}

                    {/* Search Bar */}
                    <div className="hidden md:block relative w-full max-w-xl mx-auto">
                        <input
                            type="search"
                            placeholder="Buscar productos"
                            value={search} // Vincula el valor del input al estado
                            onChange={(e) => setSearch(e.target.value)} // Actualiza el estado cuando el usuario escribe
                            className="w-full pr-14 py-4  pl-4 border rounded-full focus:ring-0 focus:outline-none"
                        />
                        <a
                            href={
                                search.trim()
                                    ? `/catalogo?search=${encodeURIComponent(
                                          search
                                      )}`
                                    : "#"
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg"
                            aria-label="Buscar"
                        >
                            <Search />
                        </a>
                    </div>

                    {/* Account and Cart */}
                    <div className="hidden md:flex items-center gap-4 relative text-sm">
                        {isUser ? (
                            <button
                                className="customtext-neutral-dark flex items-center gap-2 hover:customtext-primary  pr-6 transition-colors duration-300"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <CircleUser className="customtext-primary" />
                                <span className="hidden md:inline">
                                    {isUser.name}
                                </span>
                            </button>
                        ) : (
                            <a
                                href="/iniciar-sesion"
                                className="flex items-center gap-2 text-sm"
                            >
                                <CircleUser className="customtext-primary" />
                                <span className="hidden md:inline">
                                    Iniciar Sesión
                                </span>
                            </a>
                        )}
                        {isMenuOpen && (
                            <div className="absolute z-50 top-full left-0 bg-white shadow-xl border-t rounded-xl transition-all duration-300 ease-in-out w-40 mt-2">
                                <div className="p-4">
                                    <ul className="space-y-2">
                                        <li>
                                            <a
                                                href="/customer/dashboard"
                                                target="_blank"
                                                className="flex items-center gap-2 customtext-neutral-dark text-xs hover:customtext-primary transition-colors duration-300 cursor-pointer"
                                            >
                                                <ShoppingCart
                                                    className="customtext-primary"
                                                    height="1rem"
                                                />
                                                <span>Mis pedidos</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={Logout}
                                                className="flex items-center gap-2 customtext-neutral-dark text-xs hover:customtext-primary transition-colors duration-300 cursor-pointer"
                                            >
                                                <DoorClosed
                                                    className="customtext-primary"
                                                    height="1rem"
                                                />
                                                <span>Cerrar sesión</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 text-sm relative"
                        >
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
                <div className="flex justify-between items-center mt-4">
                    {/* Search Bar */}
                    <div className="flex  md:hidden relative w-auto">
                        <button
                            onClick={() => setSearchMobile(!searchMobile)}
                            className={`${
                                searchMobile ? "hidden" : "block"
                            } px-3 py-2 bg-primary text-white rounded-lg`}
                            aria-label="Buscar"
                        >
                            <Search width="1rem" />
                        </button>
                    </div>

                    {/* Account and Cart  href={
                                search.trim()
                                    ? `/catalogo?search=${encodeURIComponent(
                                          search
                                      )}`
                                    : "#"
                            }*/}
                    <div
                        className={`${
                            searchMobile ? "block" : "hidden"
                        }  relative w-full max-w-xl mx-auto`}
                    >
                        <input
                            type="search"
                            placeholder="Buscar productos"
                            value={search} // Vincula el valor del input al estado
                            onChange={(e) => setSearch(e.target.value)} // Actualiza el estado cuando el usuario escribe
                            className="w-full pr-14 py-4  pl-4 border rounded-full focus:ring-0 focus:outline-none"
                        />
                        <a
                            href={
                                search.trim()
                                    ? `/catalogo?search=${encodeURIComponent(
                                          search
                                      )}`
                                    : "#"
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg"
                            aria-label="Buscar"
                        >
                            <Search />
                        </a>
                    </div>
                    <div
                        className={`${
                            searchMobile ? "hidden" : "flex"
                        }  md:hidden items-center gap-4 relative text-sm`}
                    >
                        {isUser ? (
                            <button
                                className="customtext-neutral-dark flex items-center gap-2 hover:customtext-primary  pr-6 transition-colors duration-300"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <CircleUser className="customtext-primary" />
                                <span className="hidden md:inline">
                                    {isUser.name}
                                </span>
                            </button>
                        ) : (
                            <a
                                href="/iniciar-sesion"
                                className="flex items-center gap-2 text-sm"
                            >
                                <CircleUser
                                    className="customtext-primary"
                                    width="1.3rem"
                                />
                                <span className=" md:inline">
                                    Iniciar Sesión
                                </span>
                            </a>
                        )}
                        {isMenuOpen && (
                            <div className="absolute z-50 top-full left-0 bg-white shadow-xl border-t rounded-xl transition-all duration-300 ease-in-out w-40 mt-2">
                                <div className="p-4">
                                    <ul className="space-y-2">
                                        {/* <li>
                                            <a
                                                href="#"
                                                className="flex items-center gap-2 customtext-neutral-dark text-xs hover:customtext-primary transition-colors duration-300 cursor-pointer"
                                            >
                                                <CircleUser
                                                    className="customtext-primary"
                                                    height="1rem"
                                                />
                                                <span>Mi cuenta</span>
                                            </a>
                                        </li> */}

                                        <li>
                                            <a
                                                href="#"
                                                onClick={Logout}
                                                className="flex items-center gap-2 customtext-neutral-dark text-xs hover:customtext-primary transition-colors duration-300 cursor-pointer"
                                            >
                                                <DoorClosed
                                                    className="customtext-primary"
                                                    height="1rem"
                                                />
                                                <span>Cerrar sesión</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex  items-center gap-2 text-sm relative"
                        >
                            <div className="customtext-primary">
                                <ShoppingCart width="1.3rem" />
                            </div>
                            <span className="text-wrap md:inline">
                                Mi Carrito
                            </span>
                            <span className="absolute -right-2 -top-3 inline-flex items-center justify-center w-4 h-4  bg-primary text-white rounded-full text-[8px]">
                                {totalCount}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`${
                    openMenu ? "block" : "hidden"
                }  lg:hidden bg-white text-textWhite shadow-lg w-full min-h-screen absolute z-10 top-20`}
            >
                <MobileMenu
                    search={search}
                    setSearch={setSearch}
                    pages={pages}
                    items={items}
                />
            </div>
            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
            <div className="flex justify-end w-full mx-auto z-[100] relative">
                <div className="fixed bottom-6 sm:bottom-[2rem] lg:bottom-[4rem] z-20 cursor-pointer">
                    <a
                        target="_blank"
                        id="whatsapp-toggle"
                        href={`https://api.whatsapp.com/send?phone=${phoneWhatsapp}&text=${messageWhatsapp}`}
                    >
                        <img
                            src="/assets/img/whatsapp.svg"
                            alt="whatsapp"
                            className="mr-3 w-16 h-16 md:w-[100px] md:h-[100px]  animate-bounce duration-300"
                        />
                    </a>
                </div>
            </div>
        </header>
    );
};
export default HeaderSearchB;
