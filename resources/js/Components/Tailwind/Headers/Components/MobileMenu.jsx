import { useState } from "react";
import { Search, X, ChevronRight, ChevronLeft } from "lucide-react";

export default function MobileMenu({ search, setSearch, pages, items }) {
    const [menuLevel, setMenuLevel] = useState("main"); // main, categories, subcategories
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [previousMenus, setPreviousMenus] = useState([]); // Para mejor seguimiento de la navegación

    const handleCategoryClick = (category) => {
        // Guardar el nombre y el objeto completo de la categoría
        setSelectedSubcategory(category.name);
        setSelectedCategory(category.name);
        // Guardar el nivel anterior para la navegación
        setPreviousMenus([...previousMenus, { level: menuLevel, name: "Categorías" }]);
        setMenuLevel("subcategories");
    };

    const handleBackClick = () => {
        if (previousMenus.length > 0) {
            // Obtener el último menú visitado
            const lastMenu = previousMenus[previousMenus.length - 1];
            setMenuLevel(lastMenu.level);
            // Eliminar el último elemento del historial
            setPreviousMenus(previousMenus.slice(0, -1));
        } else {
            // Comportamiento predeterminado si no hay historial
            if (menuLevel === "subcategories") {
                setMenuLevel("categories");
            } else if (menuLevel === "categories") {
                setMenuLevel("main");
            }
        }
    };

    const handleMainMenuItemClick = (itemId) => {
        if (itemId === "categories") {
            setMenuLevel("categories");
        }
    };

    const [category, setCategory] = useState();

    const renderMenuItems = () => {
        if (menuLevel === "main") {
            return (
                <>
                    <div className=" customtext-neutral-dark">
                        <button
                            className="py-4 border-b border-gray-100 w-full flex justify-between items-center"
                            onClick={() =>
                                handleMainMenuItemClick("categories")
                            }
                        >
                            <span>Categorias</span>
                            <ChevronRight className="h-5 w-5 customtext-neutral-dark" />
                        </button>
                    </div>
                    {pages.map(
                        (page, index) =>
                            page.menuable && (
                                <a
                                    key={index}
                                    href={page.path}
                                    className="customtext-neutral-dark py-4 border-b border-gray-100 flex justify-between items-center w-full"
                                >
                                    <span>{page.name}</span>
                                </a>
                            )
                    )}
                </>
            );
        } else if (menuLevel === "categories") {
            return items.map((category) => (
                <div
                    key={category.id}
                    className="py-5 border-b customtext-neutral-dark border-gray-100 flex justify-between items-center cursor-pointer active:bg-gray-50"
                    onClick={() => handleCategoryClick(category)}
                >
                    <span className="text-base">{category.name}</span>
                    <ChevronRight className="h-5 w-5 customtext-neutral-dark" />
                </div>
            ));
        } else if (menuLevel === "subcategories" && selectedCategory) {
            // Por simplicidad, solo mostramos subcategorías para "audio"
            // En una implementación real, usaríamos selectedCategory para mostrar las subcategorías correspondientes
            const selectedSubcategory = items.find(
                (category) => category.name === selectedCategory
            );
            return selectedSubcategory.subcategories.map((subcat, index) => (
                <a
                    href={`/catalogo?subcategory=${subcat.slug}`}
                    key={index}
                    className="flex w-full py-5 customtext-neutral-dark border-b border-gray-100 justify-between items-center active:bg-gray-50"
                >
                    <span className="text-base">{subcat.name}</span>
                    <ChevronRight className="h-5 w-5 customtext-neutral-dark" />
                </a>
            ));
        }
    };

    return (
        <div className="w-full fixed h-screen customtext-neutral-dark bg-black/20  max-w-md mx-auto  ">
            <div className="bg-white shadow-lg rounded-lg z-[999]">
                <div className="p-4 bg-white flex justify-between items-center border-b border-gray-200">
                    <h1 className="text-xl font-medium customtext-neutral-dark">
                       Menú principal
                      
                    </h1>
                </div>

                <div className="p-4">
                    <div className="relative mb-4">
                        <div className={` relative w-full max-w-xl mx-auto`}>
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
                    </div>

                    {menuLevel !== "main" && (
                        <button
                            onClick={handleBackClick}
                            className="flex items-center customtext-primary mb-4 font-semibold"
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" />
                         { 
                         menuLevel === "categories" ? "Categorías" : 
                         selectedCategory}
                        </button>
                    )}

                    <div className="space-y-0 max-h-[350px]  overflow-scroll">
                        {renderMenuItems()}
                    </div>
                </div>
            </div>
        </div>
    );
}
