import React, { useEffect, useState } from 'react';

import CardHoverBtn from '../Products/Components/CardHoverBtn';
import { ChevronDown, Filter, Search, Tag } from 'lucide-react';


const CatalagoFiltros = ({ items, data, categories, brands, prices, cart, setCart }) => {




    const [sections, setSections] = useState({
        marca: true,
        precio: true,
        categoria: true,
        colores: false,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        marcas: [],
        categorias: [],
        subcategorias: [],
        precio: null,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoriaParam = params.get("category");

        if (categoriaParam) {
            setSelectedFilters((prev) => ({
                ...prev,
                categorias: [categoriaParam],
            }));
        }
    }, []);


    const [searchBrand, setSearchBrand] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [sortOption, setSortOption] = useState("reciente");

    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleFilterChange = (type, value) => {
        setSelectedFilters((prev) => {
            if (type === "precio") {
                const isSelected = prev.precio && prev.precio.min === value.min && prev.precio.max === value.max;
                return { ...prev, precio: isSelected ? null : value };
            }

            const newValues = prev[type].includes(value)
                ? prev[type].filter((item) => item !== value)
                : [...prev[type], value];

            return { ...prev, [type]: newValues };
        });
    };

    const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(searchBrand.toLowerCase()));
    const filteredCategories = categories.filter((category) => category.slug.toLowerCase().includes(searchCategory.toLowerCase()));

    let filteredItems = items.filter((item) => {
        const matchBrand = selectedFilters.marcas.length === 0 || selectedFilters.marcas.includes(item.brand?.name);
        const matchCategory = selectedFilters.categorias.length === 0 || selectedFilters.categorias.includes(item.category?.slug);
        const matchSubcategory = selectedFilters.subcategorias.length === 0 || selectedFilters.subcategorias.includes(item.subcategory?.name);
        const matchPrice = !selectedFilters.precio || (item.final_price >= selectedFilters.precio.min && item.final_price <= selectedFilters.precio.max);

        return matchBrand && matchCategory && matchSubcategory && matchPrice;
    });

    // Ordenar los productos según la opción seleccionada
    filteredItems = [...filteredItems].sort((a, b) => {
        switch (sortOption) {
            case "precio_mayor":
                return b.final_price - a.final_price;
            case "precio_menor":
                return a.final_price - b.final_price;
            case "reciente":
                return new Date(b.created_at) - new Date(a.created_at);
            case "antiguo":
                return new Date(a.created_at) - new Date(b.created_at);
            case "nombre_az":
                return a.name.localeCompare(b.name);
            case "nombre_za":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    return (
        <section className="py-12 bg-[#F7F9FB]">
            <div className="mx-auto px-primary">
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
                    <h2 className="text-4xl font-bold">{data?.title}</h2>
                    <div className="flex items-center gap-4">
                        <span>Productos seleccionados: <strong>{filteredItems.length}</strong></span>
                        <select
                            className="bg-primary text-white px-3 py-3 text-sm rounded-xl font-semibold"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="reciente">Más reciente</option>
                            <option value="antiguo">Más antiguo</option>
                            <option value="precio_mayor">Precio: Mayor a menor</option>
                            <option value="precio_menor">Precio: Menor a mayor</option>
                            <option value="nombre_az">Nombre: A-Z</option>
                            <option value="nombre_za">Nombre: Z-A</option>
                        </select>
                    </div>
                </div>


                <div className="relative flex gap-4">
                    <div className='w-3/12 bg-white p-4 rounded-lg'>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Filtros</h2>
                            <Filter className="h-5 w-5" />
                        </div>

                        <div className="mb-6">
                            <button onClick={() => toggleSection("marca")} className="flex items-center justify-between w-full mb-4">
                                <span className="font-medium">Marca</span>
                                <ChevronDown className={`h-5 w-5 transform transition-transform ${sections.marca ? "" : "-rotate-180"}`} />
                            </button>
                            {sections.marca && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
                                            value={searchBrand}
                                            onChange={(e) => setSearchBrand(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        {filteredBrands.map((brand) => (
                                            <label key={brand.id} className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    onChange={() => handleFilterChange("marcas", brand.name)}
                                                />
                                                <span>{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Precio Section */}
                        <div className="mb-6">
                            <button onClick={() => toggleSection("precio")} className="flex items-center justify-between w-full mb-4">
                                <span className="font-medium">Precio</span>
                                <ChevronDown className={`h-5 w-5 transform transition-transform ${sections.precio ? "" : "-rotate-180"}`} />
                            </button>
                            {sections.precio && (
                                <div className="space-y-3">
                                    {prices.map((range) => (
                                        <label key={`${range.min}-${range.max}`} className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name="precio"
                                                className="h-4 w-4 rounded border-gray-300"
                                                onChange={() => handleFilterChange("precio", range)}
                                                checked={selectedFilters.precio && selectedFilters.precio.min === range.min && selectedFilters.precio.max === range.max}
                                            />
                                            <span>{`S/ ${range.min} - S/ ${range.max}`}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>


                        <div className="mb-6">
                            <button onClick={() => toggleSection("categoria")} className="flex items-center justify-between w-full mb-4">
                                <span className="font-medium">Categoría</span>
                                <ChevronDown className={`h-5 w-5 transform transition-transform ${sections.categoria ? "" : "-rotate-180"}`} />
                            </button>
                            {sections.categoria && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
                                            value={searchCategory}
                                            onChange={(e) => setSearchCategory(e.target.value)}
                                        />
                                    </div>
                                    {filteredCategories.map((category) => (
                                        <div key={category.id}>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    onChange={() => handleFilterChange("categorias", category.slug)}
                                                />
                                                <span>{category.name}</span>
                                            </label>
                                            {selectedFilters.categorias.includes(category.slug) && (
                                                <ul className="ml-6 mt-2 space-y-2">
                                                    {category.subcategories.map((sub) => (
                                                        <label key={sub.id} className="flex items-center space-x-3">
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300"
                                                                onChange={() => handleFilterChange("subcategorias", sub.name)}
                                                            />
                                                            <span>{sub.name}</span>
                                                        </label>
                                                    ))}
                                                </ul>
                                            )}

                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="w-full bg-primary text-white py-3 rounded-lg hover:brightness-90 transition-colors text-sm font-bold">
                            Aplicar Filtro
                        </button>
                    </div>

                    <div className="w-9/12 py-4">
                        <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((product) => (
                                    <CardHoverBtn key={product.id} product={product} widthClass='lg:w-1/4' setCart={setCart} />
                                ))
                            ) : (
                                <p>No hay productos que coincidan con los filtros seleccionados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default CatalagoFiltros;
