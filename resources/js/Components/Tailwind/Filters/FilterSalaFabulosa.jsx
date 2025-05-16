import React, { useEffect, useState } from "react";

import CardHoverBtn from "../Products/Components/CardHoverBtn";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Filter,
    Search,
    Tag,
    X,
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "./Components/SelectForm";
import ProductCard from "../Components/ProductCard";
import ProductCardSimple from "../Products/Components/ProductCardSimple";
import ProductCardColors from "../Products/Components/ProductCardColors";
import { GET } from "sode-extend-react";

const itemsRest = new ItemsRest();

//const FilterSalaFabulosa = ({ items, data, categories, brands, prices, cart, setCart }) => {
const FilterSalaFabulosa = ({ items, data, filteredData, cart, setCart }) => {
    // const { collections, categories, brands, priceRanges } = filteredData;
    const [collections, setCollections] = useState([]);
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);




    const [sections, setSections] = useState({
        collection: true,
        marca: true,
        precio: true,
        categoria: true,
        colores: false,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        collection_id: GET.collection ? GET.collection.split(',') : [],
        category_id: GET.category ? GET.category.split(',') : [],
        brand_id: GET.brand ? GET.brand.split(',') : [],
        subcategory_id: GET.subcategory ? GET.subcategory.split(',') : [],
        price: null,
        name: GET.search || null,
        sort_by: "created_at",
        order: "desc",
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 21,
        from: 0,
        to: 0,
    });

    const transformFilters = (filters) => {
        const transformedFilters = [];

        if (filters.collection_id.length > 0) {
            const collectionConditions = filters.collection_id.map((id) => [
                "collection.slug",
                "=",
                id,
            ]);
            transformedFilters.push([...collectionConditions]);
        }
        // Categorías

        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category.slug",
                "=",
                id,
            ]);
            transformedFilters.push([...categoryConditions]);
        }
        //subcategorias
        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => [
                "subcategory.slug",
                "=",
                id,
            ]);
            transformedFilters.push([...subcategoryConditions]);
        }
        // Marcas
        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((id) => [
                "brand.slug",
                "=",
                id,
            ]);
            transformedFilters.push([...brandConditions]);
        }

        // Precio

        if (filters.price) {
            transformedFilters.push([
                "or",
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
        return ArrayJoin(transformedFilters, 'and');
    };
    // Obtener productos filtrados desde el backend
    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            // Transformar los filtros al formato esperado por el backend
            const filters = transformFilters(selectedFilters);
            console.log(filters);
            const params = {
                filter: filters, // Envía los filtros transformados
                sort: selectedFilters.sort, // Enviar el parámetro de ordenación
                // page,
                skip: (page - 1) * pagination.itemsPerPage,
                take: pagination.itemsPerPage,
                requireTotalCount: true, // Número de productos por página
            };

            const response = await itemsRest.paginate(params);

            setProducts(response.data);
            setPagination({
                currentPage: page,
                totalPages: Math.ceil(
                    response.totalCount / pagination.itemsPerPage
                ),
                totalItems: response.totalCount,
                itemsPerPage: pagination.itemsPerPage,
                from: (page - 1) * pagination.itemsPerPage + 1,
                to: Math.min(
                    page * pagination.itemsPerPage,
                    response.totalCount
                ),
            });
            console.log(response);
            setCollections(response?.summary.collections);
            setBrands(response?.summary.brands);
            setCategories(response?.summary.categories);
            setSubcategories(response?.summary.subcategories);
            setPriceRanges(response?.summary.priceRanges);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(pagination.currentPage);
    }, [selectedFilters]);

    // Función para manejar el cambio de página
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchProducts(page);
        }
    };

    // Función para generar los números de página a mostrar
    const getPageNumbers = () => {
        const pages = [];
        const total = pagination.totalPages;
        const current = pagination.currentPage;
        const delta = 2; // Número de páginas a mostrar alrededor de la actual

        for (let i = 1; i <= total; i++) {
            if (
                i === 1 ||
                i === total ||
                (i >= current - delta && i <= current + delta)
            ) {
                pages.push(i);
            } else if (i === current - delta - 1 || i === current + delta + 1) {
                pages.push("...");
            }
        }

        return pages.filter((page, index, array) => {
            return page !== "..." || array[index - 1] !== "...";
        });
    };



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
    const [searchCollection, setSearchCollection] = useState("");
    const [searchBrand, setSearchBrand] = useState("");
    const filteredCollections = collections?.filter((collection) =>
        collection.name.toLowerCase().includes(searchCollection.toLowerCase())
    );
    // Filtrar categorías según el input
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchCategory.toLowerCase())
    );

    // Filtrar marcas según el input
    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );
    const [filtersOpen, setFiltersOpen] = useState(false); // Añadir estado para mobile
    return (
        <section className="py-6 font-font-general customtext-primary">
            <div className="mx-auto px-primary">
                {/* Botón para móvil */}
                <button
                    onClick={() => setFiltersOpen(true)}
                    className="w-full lg:hidden flex gap-2 items-center mb-4 p-3 bg-white rounded-lg shadow-sm"
                >
                    <Filter className="h-5 w-5" />
                    <span className="font-semibold">Mostrar filtros</span>
                </button>

                <div className="relative flex flex-col sm:flex-row gap-4">
                    {/* Contenedor de Filtros (Modificado para mobile) */}
                    <div className={`${filtersOpen
                        ? "fixed inset-0 z-50 bg-white flex flex-col h-screen"
                        : "hidden"
                        } lg:block lg:w-1/4 lg:bg-white lg:p-4 lg:rounded-lg lg:h-max`}
                    >
                        {/* Header móvil */}
                        <div className="fixed top-0 left-0 right-0 bg-white p-4 border-b z-10 h-16 flex items-center justify-between lg:hidden">
                            <h2 className="text-xl font-bold">Filtros</h2>
                            <button onClick={() => setFiltersOpen(false)}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="flex-1 overflow-y-auto px-4 mt-16 pb-20 lg:mt-0 lg:pb-0 lg:px-0">
                            <p className="customtext-primary text-2xl font-bold pb-4 mb-4 border-b lg:block hidden">
                                Combina como desees tu sala
                            </p>

                            {/* Colecciones (Mejorado) */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection("collection")}
                                    className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                >
                                    <span className="font-medium">Colecciones</span>
                                    <ChevronUp
                                        className={`h-5 w-5 transform transition-transform ${sections.collection ? "" : "-rotate-180"
                                            }`}
                                    />
                                </button>
                                {sections.collection && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar"
                                                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-0 focus:outline-0"
                                                value={searchCollection}
                                                onChange={(e) => setSearchCollection(e.target.value)}
                                            />
                                        </div>
                                        <div className="max-h-[200px] overflow-y-auto space-y-2 p-1">
                                            {filteredCollections.map((collection) =>{ 
                                                      const isChecked = selectedFilters.collection_id?.includes(collection.slug);
                                                return(
                                                <div
                                                    key={collection.id}
                                                    className={`group flex items-center gap-3 p-2 rounded-lg ${ isChecked
                                                        ? "bg-secondary"
                                                        : "hover:bg-gray-50"
                                                        }`}
                                                >
                                                     <label className="flex items-center gap-2 px-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 rounded border-gray-300 accent-primary hidden "
                                                        onChange={() => handleFilterChange("collection_id", collection.slug)}
                                                        checked={isChecked}
                                                    />
                                                    <img
                                                        src={`/storage/images/collection/${collection.image}`}
                                                        onError={(e) => e.target.src = "assets/img/noimage/no_imagen_circular.png"}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                        alt={collection.name}
                                                    />
                                                    <span className="text-sm lg:text-base">{collection.name}</span></label>
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Categorías (Mejorado) */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection("categoria")}
                                    className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                >
                                    <span className="font-medium">Categorías</span>
                                    <ChevronUp
                                        className={`h-5 w-5 transform transition-transform ${sections.categoria ? "" : "-rotate-180"
                                            }`}
                                    />
                                </button>
                                {sections.categoria && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar"
                                                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-0 focus:outline-0"
                                                value={searchCategory}
                                                onChange={(e) => setSearchCategory(e.target.value)}
                                            />
                                        </div>
                                        <div className="max-h-[200px] overflow-y-auto space-y-2 p-1">
                                            
                                            {filteredCategories.map((category) => {
                                              
                                                   const isChecked = selectedFilters.category_id?.includes(category.slug);
                                            return(
                                                <div
                                                key={category.id}
                                                className={`group flex items-center gap-3 p-2 rounded-lg ${isChecked
                                                    ? "bg-secondary"
                                                    : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                   <label className="flex items-center gap-2 px-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded border-gray-300 accent-primary hidden"
                                                    onChange={() => handleFilterChange("category_id", category.slug)}
                                                    checked={isChecked}
                                                   // checked={selectedFilters.category_id?.includes(category.id)}
                                                />
                                                <img
                                                    src={`/storage/images/category/${category.image}`}
                                                    onError={(e) => e.target.src = "assets/img/noimage/no_imagen_circular.png"}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    alt={category.name}
                                                />
                                                <span className="text-sm lg:text-base">{category.name}</span></label>
                                            </div>
                                            )
})}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Precio (Mejorado) */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection("precio")}
                                    className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                >
                                    <span className="font-medium">Precio</span>
                                    <ChevronUp
                                        className={`h-5 w-5 transform transition-transform ${sections.precio ? "" : "-rotate-180"
                                            }`}
                                    />
                                </button>
                                {sections.precio && (
                                    <div className="space-y-3 p-1">
                                        {priceRanges.map((range) => (
                                            <label
                                                key={`${range.min}-${range.max}`}
                                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded border-gray-300 accent-primary"
                                                    onChange={() => handleFilterChange("price", range)}
                                                    checked={
                                                        selectedFilters.price?.min === range.min &&
                                                        selectedFilters.price?.max === range.max
                                                    }
                                                />
                                                <span className="text-sm lg:text-base">{`S/ ${range.min} - S/ ${range.max}`}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer móvil */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 h-20 flex items-center lg:hidden">
                            <button
                                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                                onClick={() => setFiltersOpen(false)}
                            >
                                Ver resultados
                            </button>
                        </div>
                    </div>

                    <div className="w-full sm:w-3/4 py-4">
                        <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-4 w-full">
                            {/* Ordenación <span className='block w-6/12'>Productos seleccionados: <strong>{products?.length}</strong></span>*/}
                            <div className="flex gap-4 items-center">
                                <label className="font-semibold text-sm w-[150px]">
                                    Ordenar por
                                </label>
                                <SelectForm
                                    options={sortOptions}
                                    placeholder="Recomendados"
                                    onChange={(value) => {
                                        const [selector, order] =
                                            value.split(":");
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
                                    className="border-primary rounded-full customtext-primary"
                                />
                            </div>
                            <div className="customtext-primary font-semibold">
                                <div className="flex justify-between items-center w-full">
                                    <div className="customtext-primary font-semibold">
                                        <nav className="flex items-center gap-x-2 min-w-max">
                                            <button
                                                className={`p-4 inline-flex items-center ${pagination.currentPage === 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.currentPage -
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    pagination.currentPage === 1
                                                }
                                            >
                                                <ChevronLeft />
                                            </button>

                                            {getPageNumbers().map(
                                                (page, index) => (
                                                    <React.Fragment key={index}>
                                                        {page === "..." ? (
                                                            <span className="w-10 h-10 bg-transparent p-2 inline-flex items-center justify-center rounded-full">
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <button
                                                                className={`w-10 h-10 p-2 inline-flex items-center justify-center rounded-full transition-all duration-300 
                                            ${page === pagination.currentPage
                                                                        ? "bg-primary text-white"
                                                                        : "bg-transparent hover:text-white hover:bg-primary"
                                                                    }`}
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        page
                                                                    )
                                                                }
                                                            >
                                                                {page}
                                                            </button>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            )}

                                            <button
                                                className={`p-4 inline-flex items-center ${pagination.currentPage ===
                                                    pagination.totalPages
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.currentPage +
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    pagination.currentPage ===
                                                    pagination.totalPages
                                                }
                                            >
                                                <ChevronRight />
                                            </button>
                                        </nav>
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {pagination.from} - {pagination.to}{" "}
                                            de {pagination.totalItems}{" "}
                                            Resultados
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Productos */}
                        {loading ? (
                            <Loading />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 gap-y-2 lg:gap-y-3 transition-all duration-300 ease-in-out">
                                {Array.isArray(products) &&
                                    products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCardColors
                                            key={product.id}
                                            product={product}
                                            widthClass="lg:w-1/3"
                                            cart={cart}
                                            setCart={setCart}
                                        />
                                    ))
                                ) : (
                                    <NoResults />
                                )}
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-4 w-full mt-8">
                            <div className="customtext-primary font-semibold">
                                <div className="flex justify-between items-center mb-4 w-full mt-8">
                                    <div className="customtext-primary font-semibold">
                                        <nav className="flex items-center gap-x-2 min-w-max">
                                            <button
                                                className={`p-4 inline-flex items-center ${pagination.currentPage === 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.currentPage -
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    pagination.currentPage === 1
                                                }
                                            >
                                                <ChevronLeft />
                                            </button>

                                            {getPageNumbers().map(
                                                (page, index) => (
                                                    <React.Fragment key={index}>
                                                        {page === "..." ? (
                                                            <span className="w-10 h-10 bg-transparent p-2 inline-flex items-center justify-center rounded-full">
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <button
                                                                className={`w-10 h-10 p-2 inline-flex items-center justify-center rounded-full transition-all duration-300 
                                            ${page === pagination.currentPage
                                                                        ? "bg-primary text-white"
                                                                        : "bg-transparent hover:text-white hover:bg-primary"
                                                                    }`}
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        page
                                                                    )
                                                                }
                                                            >
                                                                {page}
                                                            </button>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            )}

                                            <button
                                                className={`p-4 inline-flex items-center ${pagination.currentPage ===
                                                    pagination.totalPages
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.currentPage +
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    pagination.currentPage ===
                                                    pagination.totalPages
                                                }
                                            >
                                                <ChevronRight />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">
                                    {pagination.from} - {pagination.to} de{" "}
                                    {pagination.totalItems} Resultados
                                </p>
                            </div>
                        </div>
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

export default FilterSalaFabulosa;
