import { useState } from "react";
import { Search, X, ChevronRight, ChevronLeft } from "lucide-react";

export default function MobileMenu({ search, setSearch, pages, items }) {
    const [menuLevel, setMenuLevel] = useState("main"); // main, categories, subcategories
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    const handleCategoryClick = (categoryName) => {
        setSelectedSubcategory(categoryName);
        console.log(selectedSubcategory);
        setSelectedCategory(categoryName);
        setMenuLevel("subcategories");
    };

    const handleBackClick = () => {
        if (menuLevel === "subcategories") {
            setMenuLevel("categories");
        } else if (menuLevel === "categories") {
            setMenuLevel("main");
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
                    <div className="py-4 customtext-neutral-dark">
                        <button
                            className=" border-b border-gray-100 w-full flex justify-between items-center"
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
                                <button
                                    key={index}
                                    className="customtext-neutral-dark py-4 border-b border-gray-100 flex justify-between items-center"
                                    href={page.path}
                                >
                                    <span>{page.name}</span>
                                </button>
                            )
                    )}
                </>
            );
        } else if (menuLevel === "categories") {
            return items.map((category) => (
                <div
                    key={category.id}
                    className="py-4 border-b customtext-neutral-dark border-gray-100 flex justify-between items-center"
                    onClick={() => handleCategoryClick(category.name)}
                >
                    <span>{category.name}</span>

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
                <div
                    key={index}
                    className="py-4 customtext-neutral-dark border-b border-gray-100"
                >
                    <span>{subcat.name}</span>
                </div>
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
                            <span>Atrás</span>
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
