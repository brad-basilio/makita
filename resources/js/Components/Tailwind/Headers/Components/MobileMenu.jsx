import { useState, useEffect } from "react";
import { Search, X, ChevronRight, ChevronLeft, Home, ShoppingCart, User, Menu } from "lucide-react";

export default function MobileMenu({ search, setSearch, pages, items, onClose }) {
    const [menuLevel, setMenuLevel] = useState("main");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [previousMenus, setPreviousMenus] = useState([]);
    const [animationDirection, setAnimationDirection] = useState("right"); // "right" o "left" para las animaciones

    // Función para manejar la navegación con animaciones
    const navigateTo = (level, direction = "right", categoryName = null) => {
        setAnimationDirection(direction);
        
        if (categoryName) {
            setSelectedCategory(categoryName);
        }
        
        setTimeout(() => {
            setMenuLevel(level);
        }, 50); // Pequeño retraso para la animación
    };

    const handleCategoryClick = (category) => {
        setSelectedSubcategory(category.name);
        setPreviousMenus([...previousMenus, { level: menuLevel, name: "Categorías" }]);
        navigateTo("subcategories", "right", category.name);
    };

    const handleBackClick = () => {
        if (previousMenus.length > 0) {
            const lastMenu = previousMenus[previousMenus.length - 1];
            navigateTo(lastMenu.level, "left");
            setPreviousMenus(previousMenus.slice(0, -1));
        } else {
            if (menuLevel === "subcategories") {
                navigateTo("categories", "left");
            } else if (menuLevel === "categories") {
                navigateTo("main", "left");
            }
        }
    };

    const handleMainMenuItemClick = (itemId) => {
        if (itemId === "categories") {
            navigateTo("categories", "right");
        }
    };

    // Determina el título según el nivel
    const getMenuTitle = () => {
       return "Menú principal";
       // if (menuLevel === "categories") return "Categorías";
        return selectedCategory;
    };

    const renderMenuItems = () => {
        if (menuLevel === "main") {
            return (
                <div className="animate-fade animate-duration-300">
                    <div className="bg-gray-50 rounded-xl mb-4 overflow-hidden">
                        <button
                            className="p-4 w-full flex justify-between items-center hover:bg-gray-100 transition-all"
                            onClick={() => handleMainMenuItemClick("categories")}
                        >
                            <div className="flex items-center">
                             
                                <span className="font-medium">Categorías</span>
                            </div>
                            <ChevronRight className="h-5 w-5 customtext-neutral-light" />
                        </button>
                  
                        {pages.map(
                            (page, index) =>
                                page.menuable && (
                                    <a
                                        key={index}
                                        href={page.path}
                                        className="p-4 border-b last:border-0 border-gray-100 flex justify-between items-center w-full hover:bg-gray-100 transition-all"
                                    >
                                        <span className="font-medium">{page.name}</span>
                                    </a>
                                )
                        )}
                    </div>
                </div>
            );
        } else if (menuLevel === "categories") {
            return (
                <div className={animationDirection === "right" ? "animate-fade-left animate-duration-300" : "animate-fade-right animate-duration-300"}>
                    {items.map((category) => (
                        <div
                            key={category.id}
                            className="p-4 border-b last:border-0 border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-all"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <span className="font-medium">{category.name}</span>
                            <ChevronRight className="h-5 w-5 customtext-neutral-light" />
                        </div>
                    ))}
                </div>
            );
        } else if (menuLevel === "subcategories" && selectedCategory) {
            const selectedSubcategory = items.find(
                (category) => category.name === selectedCategory
            );
            return (
                <div className={animationDirection === "right" ? "animate-fade-left animate-duration-300" : "animate-fade-right animate-duration-300"}>
                    {selectedSubcategory.subcategories.map((subcat, index) => (
                        <a
                            href={`/catalogo?subcategory=${subcat.slug}`}
                            key={index}
                            className="flex w-full p-4 border-b last:border-0 border-gray-100 justify-between items-center hover:bg-gray-50 active:bg-gray-100 transition-all"
                        >
                            <span className="font-medium">{subcat.name}</span>
                            <ChevronRight className="h-5 w-5 customtext-neutral-light" />
                        </a>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="w-full fixed inset-0 md:max-w-md md:mx-auto h-full bg-black/50 z-50 flex flex-col">
            <div className="bg-white rounded-t-xl mt-auto h-[85vh] flex flex-col shadow-xl overflow-hidden">
                {/* Header del menú */}
                <div className="p-4 bg-white flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
                    <h1 className="text-lg font-bold">{getMenuTitle()}</h1>
                    <button 
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Buscador */}
                    <div className="mb-5">
                        <div className="relative w-full">
                            <input
                                type="search"
                                placeholder="Buscar productos"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pr-12 py-3 pl-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                            <a
                                href={
                                    search.trim()
                                        ? `/catalogo?search=${encodeURIComponent(search)}`
                                        : "#"
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg"
                            >
                                <Search className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Botón de retroceso */}
                    {menuLevel !== "main" && (
                        <button
                            onClick={handleBackClick}
                            className="flex items-center customtext-primary mb-4 font-medium "
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" />
                             { 
                         menuLevel === "categories" ? "Categorías" : 
                         selectedCategory}

                        </button>
                    )}

                    {/* Lista de ítems */}
                    <div className="pb-20">
                        {renderMenuItems()}
                    </div>
                </div>

                {/* Barra inferior */}
               {/* <div className="flex justify-around items-center p-3 border-t border-gray-200 bg-white sticky bottom-0">
                    <a href="/" className="flex flex-col items-center p-2">
                        <Home className="h-5 w-5 customtext-primary" />
                        <span className="text-xs mt-1">Inicio</span>
                    </a>
                    
                    <a href="/catalogo" className="flex flex-col items-center p-2">
                        <Menu className="h-5 w-5" />
                        <span className="text-xs mt-1">Catálogo</span>
                    </a>
                    
                    <a href="/carrito" className="flex flex-col items-center p-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="text-xs mt-1">Carrito</span>
                    </a>
                    
                    <a href="/perfil" className="flex flex-col items-center p-2">
                        <User className="h-5 w-5" />
                        <span className="text-xs mt-1">Perfil</span>
                    </a>
                </div> */}
            </div>
        </div>
    );
}
