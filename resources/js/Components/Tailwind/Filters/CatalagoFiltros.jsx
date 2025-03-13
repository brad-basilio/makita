import React, { useEffect, useState } from "react";

import CardHoverBtn from "../Products/Components/CardHoverBtn";
import { ChevronDown, Filter, Search, Tag } from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "./Components/SelectForm";

const itemsRest = new ItemsRest();

//const CatalagoFiltros = ({ items, data, categories, brands, prices, cart, setCart }) => {
const CatalagoFiltros = ({ items, data, filteredData, cart, setCart }) => {
    const { categories, brands, priceRanges } = filteredData;
    const [sections, setSections] = useState({
        marca: true,
        precio: true,
        categoria: true,
        colores: false,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        category_id: [], // Array para múltiples categorías
        brand_id: [], // Array para múltiples marcas
        subcategory_id: [],
        price: null,
        name: null,
        sort_by: "created_at",
        order: "desc",
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });

    const transformFilters = (filters) => {
        const transformedFilters = [];

        // Categorías
        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category_id",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...categoryConditions]);
        }
        //subcategorias
        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => [
                "subcategory_id",
                "=",
                id,
            ]);
            transformedFilters.push(["and", ...subcategoryConditions]);
        }
        // Marcas
        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((id) => [
                "brand_id",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...brandConditions]);
        }

        // Precio
        if (filters.price) {
            transformedFilters.push([
                "and",
                [
                    ["final_price", ">=", filters.price.min],
                    "and",
                    ["final_price", "<=", filters.price.max],
                ],
            ]);
        }

        // Búsqueda (asumiendo que se filtra por título o contenido)
        if (filters.name) {
            transformedFilters.push(["name", "contains", filters.name]);
        }
        return transformedFilters;
    };
    // Obtener productos filtrados desde el backend
    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            // Transformar los filtros al formato esperado por el backend
            const filters = transformFilters(selectedFilters);
            const params = {
                filter: filters, // Envía los filtros transformados
                sort: selectedFilters.sort, // Enviar el parámetro de ordenación
                // page,
                take: 20, // Número de productos por página
            };

            const response = await itemsRest.paginate(params);

            setProducts(response.data);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.lastPage,
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedFilters]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoriaParam = params.get("category");

        if (categoriaParam) {
            const category = categories.find(
                (item) => item.slug === categoriaParam
            ); // Usa .find() en lugar de .filter()

            if (category) {
                setSelectedFilters((prev) => ({
                    ...prev,
                    category_id: [category.id], // Asegúrate de que `category.id` exista
                }));
            }
        }

        const searchParam = params.get("search");

        if (searchParam) {
            setSelectedFilters((prev) => ({
                ...prev,
                name: searchParam, // Asegúrate de que `category.id` exista
            }));
        }
    }, [items]); // Agrega `items` como dependencia

    // Manejar cambios en los filtros
    const handleFilterChange = (type, value) => {
        setSelectedFilters((prev) => {
            if (type === "price") {
                // Si el mismo rango ya está seleccionado, lo deseleccionamos; de lo contrario, lo asignamos
                return {
                    ...prev,
                    price:
                        prev.price &&
                        prev.price.min === value.min &&
                        prev.price.max === value.max
                            ? null
                            : value,
                };
            }

            // Asegúrate de que prev[type] sea un array antes de usar .includes()
            const currentValues = Array.isArray(prev[type]) ? prev[type] : [];

            // Manejar múltiples valores para categorías y marcas
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value) // Eliminar si ya está seleccionado
                : [...currentValues, value]; // Agregar si no está seleccionado

            return { ...prev, [type]: newValues };
        });
    };

    // Alternar secciones de filtros
    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const sortOptions = [
        { value: "created_at:desc", label: "Más reciente" },
        { value: "created_at:asc", label: "Mas antiguo" },
        { value: "final_price:asc", label: "Precio: Menor a Mayor" },
        { value: "final_price:desc", label: "Precio: Mayor a Menor" },
        { value: "name:asc", label: "Nombre: A-Z" },
        { value: "name:desc", label: "Nombre: Z-A" },
    ];

    const [searchCategory, setSearchCategory] = useState("");
    const [searchBrand, setSearchBrand] = useState("");

    // Filtrar categorías según el input
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchCategory.toLowerCase())
    );

    // Filtrar marcas según el input
    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );
    /* const [sections, setSections] = useState({
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
                 // Si el mismo rango ya está seleccionado, lo deseleccionamos, de lo contrario, lo asignamos
                 return { ...prev, precio: prev.precio && prev.precio.min === value.min && prev.precio.max === value.max ? null : value };
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
     });*/

    return (
        <section className="py-12 bg-[#F7F9FB]">
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 pb-4 border-b-2">
                    <h2 className="text-[32px] md:text-4xl font-bold md:w-6/12">
                        {data?.title}
                    </h2>
                    <div className="flex items-center gap-4 md:w-5/12">
                        <span className="block w-6/12">
                            Productos seleccionados:{" "}
                            <strong>{products?.length}</strong>
                        </span>
                        {/* Ordenación */}
                        <div className="w-6/12">
                            <SelectForm
                                options={sortOptions}
                                placeholder="Ordenar por"
                                onChange={(value) => {
                                    const [selector, order] = value.split(":");
                                    const sort = [
                                        {
                                            selector: selector,
                                            desc: order === "desc",
                                        },
                                    ];
                                    setSelectedFilters((prev) => ({
                                        ...prev,
                                        sort,
                                    }));
                                }}
                                labelKey="label"
                                valueKey="value"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative flex gap-4">
                    <div className="hidden md:block md:w-3/12 bg-white p-4 rounded-lg h-max">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Filtros</h2>
                            <Filter className="h-5 w-5" />
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("marca")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Marca</span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.marca ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.marca && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            className={`w-full px-4 pl-10 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300`}
                                            value={searchBrand}
                                            onChange={(e) =>
                                                setSearchBrand(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {filteredBrands.map((brand) => (
                                            <label
                                                key={brand.id}
                                                className="flex items-center space-x-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    onChange={() =>
                                                        handleFilterChange(
                                                            "brand_id",
                                                            brand.id
                                                        )
                                                    }
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
                            <button
                                onClick={() => toggleSection("precio")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Precio</span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.precio ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.precio && (
                                <div className="space-y-3">
                                    {priceRanges.map((range) => (
                                        <label
                                            key={`${range.min}-${range.max}`}
                                            className="flex items-center space-x-3"
                                        >
                                            <input
                                                type="checkbox"
                                                name="precio"
                                                className="h-4 w-4 rounded border-gray-300"
                                                onChange={() =>
                                                    handleFilterChange(
                                                        "price",
                                                        range
                                                    )
                                                }
                                                checked={
                                                    selectedFilters.price &&
                                                    selectedFilters.price
                                                        .min === range.min &&
                                                    selectedFilters.price
                                                        .max === range.max
                                                }
                                            />
                                            <span>{`S/ ${range.min} - S/ ${range.max}`}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("categoria")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Categoría</span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.categoria ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.categoria && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            className={`w-full px-4 pl-10 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300`}
                                            value={searchCategory}
                                            onChange={(e) =>
                                                setSearchCategory(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {filteredCategories.map((category) => (
                                            <div key={category.id}>
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300"
                                                        onChange={() =>
                                                            handleFilterChange(
                                                                "category_id",
                                                                category.id
                                                            )
                                                        }
                                                        checked={selectedFilters.category_id?.includes(
                                                            category.id
                                                        )} // <-- Agregado
                                                    />
                                                    <span>{category.name}</span>
                                                </label>

                                                {/* Mostrar subcategorías si la categoría está seleccionada */}
                                                {selectedFilters.category_id?.includes(
                                                    category.id
                                                ) &&
                                                    category.subcategories
                                                        ?.length > 0 && (
                                                        <ul className="ml-6 mt-2 space-y-2">
                                                            {category.subcategories.map(
                                                                (sub) => (
                                                                    <label
                                                                        key={
                                                                            sub.id
                                                                        }
                                                                        className="flex items-center space-x-3"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="h-4 w-4 rounded border-gray-300"
                                                                            onChange={() =>
                                                                                handleFilterChange(
                                                                                    "subcategory_id",
                                                                                    sub.id
                                                                                )
                                                                            } // <-- Corregido
                                                                            checked={selectedFilters.subcategory_id?.includes(
                                                                                sub.id
                                                                            )}
                                                                        />
                                                                        <span>
                                                                            {
                                                                                sub.name
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="w-full bg-primary text-white py-3 rounded-xl hover:brightness-90 transition-colors text-sm font-bold">
                            Aplicar Filtro
                        </button>
                    </div>

                    <div className="w-full md:w-9/12 py-4">
                        {/* Productos */}
                        {loading ? (
                            <Loading />
                        ) : (
                            <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out">
                                {Array.isArray(products) &&
                                products.length > 0 ? (
                                    products.map((product) => (
                                        <div
                                            className=" lg:h-[460px] lg:max-h-[460px]  xl:h-[400px] xl:max-h-[400px] 2xl:h-[430px] 2xl:max-h-[430px]  w-1/2 lg:w-1/3 xl:w-1/4"
                                            key={product.id}
                                        >
                                            <CardHoverBtn
                                                product={product}
                                                widthClass="w-full sm:w-full lg:w-full"
                                                cart={cart}
                                                setCart={setCart}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <NoResults />
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Paginación 
                <div>
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => fetchProducts(pagination.currentPage - 1)}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => fetchProducts(pagination.currentPage + 1)}
                    >
                        Siguiente
                    </button>
                </div>*/}
            </div>
        </section>
    );
};

export default CatalagoFiltros;
