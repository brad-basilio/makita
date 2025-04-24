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
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "./Components/SelectForm";
import ProductCard from "../Components/ProductCard";
import ProductCardSimple from "../Products/Components/ProductCardSimple";

const itemsRest = new ItemsRest();

//const FilterSalaFabulosa = ({ items, data, categories, brands, prices, cart, setCart }) => {
const FilterSalaFabulosa = ({ items, data, filteredData, cart, setCart }) => {
    const { collections, categories, brands, priceRanges } = filteredData;
    console.log(collections);
    const [sections, setSections] = useState({
        collection: true,
        marca: true,
        precio: true,
        categoria: true,
        colores: false,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        collection_id: [],
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
        totalItems: 0,
        itemsPerPage: 21,
        from: 0,
        to: 0,
    });

    const transformFilters = (filters) => {
        const transformedFilters = [];

        if (filters.collection_id.length > 0) {
            const collectionConditions = filters.collection_id.map((id) => [
                "collection_id",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...collectionConditions]);
        }
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

        const collectionParam = params.get("collection");

        if (collectionParam) {
            const collection = collections.find(
                (item) => item.slug === collectionParam
            ); // Usa .find() en lugar de .filter()

            if (collection) {
                setSelectedFilters((prev) => ({
                    ...prev,
                    collection_id: [collection.id], // Asegúrate de que `category.id` exista
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
    const [searchCollection, setSearchCollection] = useState("");
    const [searchBrand, setSearchBrand] = useState("");
    const filteredCollections = collections.filter((collection) =>
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

    return (
        <section className="py-6  font-font-general customtext-primary">
            <div className="mx-auto px-primary">
                <div className="relative flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/5 bg-white p-4 rounded-lg h-max">
                        <p className="customtext-primary text-2xl font-bold pb-4 mb-4 border-b">
                            Combina como desees tu sala
                        </p>

                        {/* <div className="mb-6">
                            <button
                                onClick={() => toggleSection("marca")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-semibold text-lg">
                                    Marca
                                </span>
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
                                    <div className="space-y-3">
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
                        </div> */}
                        
                        {/*Categoria Seccion */}
                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("collection")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Colecciones</span>
                                <ChevronUp
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.collection ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.collection && (
                                <div className="space-y-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            className={`w-full px-4 pl-10 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300`}
                                            value={searchCollection}
                                            onChange={(e) =>
                                                setSearchCollection(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    {filteredCollections.map((collection) => {
                                        const isChecked =
                                            selectedFilters.collection_id?.includes(
                                                collection.id
                                            );
                                        return (
                                            <div
                                                key={collection.id}
                                                className={`group py-1 rounded-md ${
                                                    isChecked
                                                        ? "bg-secondary"
                                                        : "bg-transparent"
                                                }`}
                                            >
                                                <label className="flex items-center space-x-3 ">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 hidden w-4 rounded border-gray-300"
                                                        onChange={() =>
                                                            handleFilterChange(
                                                                "collection_id",
                                                                collection.id
                                                            )
                                                        }
                                                        checked={selectedFilters.collection_id?.includes(
                                                            collection.id
                                                        )}
                                                    />
                                                    <img
                                                        src={`/storage/images/collection/${collection.image}`}
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "assets/img/noimage/no_imagen_circular.png")
                                                        }
                                                        alt={collection.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                        loading="lazy"
                                                    />
                                                    <span>
                                                        {collection.name}
                                                    </span>
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("categoria")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Categorias</span>
                                <ChevronUp
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.categoria ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.categoria && (
                                <div className="space-y-1">
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
                                    {filteredCategories.map((category) => {
                                        const isChecked =
                                            selectedFilters.category_id?.includes(
                                                category.id
                                            );
                                        return (
                                            <div
                                                key={category.id}
                                                className={`group py-2 rounded-md ${
                                                    isChecked
                                                        ? "bg-secondary"
                                                        : "bg-transparent"
                                                }`}
                                            >
                                                <label className="flex items-center space-x-3 ">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 hidden w-4 rounded border-gray-300"
                                                        onChange={() =>
                                                            handleFilterChange(
                                                                "category_id",
                                                                category.id
                                                            )
                                                        }
                                                        checked={selectedFilters.category_id?.includes(
                                                            category.id
                                                        )}
                                                    />
                                                    <img
                                                        src={`/storage/images/category/${category.image}`}
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "assets/img/noimage/no_imagen_circular.png")
                                                        }
                                                        alt={category.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                        loading="lazy"
                                                    />
                                                    <span>{category.name}</span>
                                                </label>
                                            </div>
                                        );
                                    })}
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
                                <ChevronUp
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
                    </div>

                    <div className="w-full sm:w-4/5 py-4">
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
                                                className={`p-4 inline-flex items-center ${
                                                    pagination.currentPage === 1
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
                                            ${
                                                page === pagination.currentPage
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
                                                className={`p-4 inline-flex items-center ${
                                                    pagination.currentPage ===
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
                            <div className="flex items-center flex-wrap gap-y-2 lg:gap-y-3 transition-all duration-300 ease-in-out">
                                {Array.isArray(products) &&
                                products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCardSimple
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
                                                className={`p-4 inline-flex items-center ${
                                                    pagination.currentPage === 1
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
                                            ${
                                                page === pagination.currentPage
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
                                                className={`p-4 inline-flex items-center ${
                                                    pagination.currentPage ===
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
