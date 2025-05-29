import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardHoverBtn from "../Products/Components/CardHoverBtn";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Search, Tag, X } from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "./Components/SelectForm";
import { GET } from "sode-extend-react";

const itemsRest = new ItemsRest();

const SkeletonCard = () => {
    return (
        <div className={`group animate-pulse transition-transform duration-300 hover:scale-105 w-1/2 lg:w-1/4 flex-shrink-0 font-font-general customtext-primary cursor-pointer`}>
            <div className="px-4">
                <div className="bg-white rounded-3xl">
                    <div className="relative">
                        <div className="aspect-square bg-gray-300 rounded-3xl overflow-hidden flex items-center justify-center bg-secondary">
                            <svg className="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CatalagoFiltros = ({ items, data, filteredData, cart, setCart }) => {
    // Estado para el filtro padre (independiente)
    const [independentFilter, setIndependentFilter] = useState(null);
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);
    const [activeSection, setActiveSection] = useState(null);

    const [sections, setSections] = useState({
        marca: true,
        precio: true,
        categoria: true,
        subcategoria: true,
        colores: false,
        coleccion: true,
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

    // Track the order in which filters are activated
    const [filterSequence, setFilterSequence] = useState([]);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 24,
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
            transformedFilters.push(ArrayJoin(collectionConditions, 'or'));
        }

        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category.slug",
                "=",
                id,
            ]);
            transformedFilters.push(ArrayJoin(categoryConditions, 'or'));
        }

        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => [
                "subcategory.slug",
                "=",
                id,
            ]);
            transformedFilters.push(ArrayJoin(subcategoryConditions, 'or'));
        }

        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((id) => [
                "brand.slug",
                "=",
                id,
            ]);
            transformedFilters.push([...brandConditions]);
        }

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

        if (filters.name) {
            transformedFilters.push(["name", "contains", filters.name]);
        }

        return ArrayJoin(transformedFilters, 'and');
    };
    // Obtener productos filtrados desde el backend
    const fetchProducts = async (page = 1, shouldScroll = false) => {
        setLoading(true);
        // Si estamos cambiando los filtros (no solo la página), desplazar hacia arriba
        if (shouldScroll) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        try {
            const filters = transformFilters(selectedFilters);
            // Extraer los IDs de los filtros seleccionados (no slugs)
            const params = {
                filter: filters,
                sort: selectedFilters.sort,
                skip: (page - 1) * pagination.itemsPerPage,
                take: pagination.itemsPerPage,
                requireTotalCount: true,
                filterSequence: filterSequence,
                // Enviar los IDs de marcas/categorías/colecciones seleccionadas
                brand_id: brands
                    .filter(b => selectedFilters.brand_id.includes(b.slug))
                    .map(b => b.id),
                category_id: categories
                    .filter(c => selectedFilters.category_id.includes(c.slug))
                    .map(c => c.id),
                collection_id: collections
                    ? collections.filter(col => selectedFilters.collection_id.includes(col.slug)).map(col => col.id)
                    : [],
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
            // Update all filter options from backend summary
            setBrands(response?.summary.brands || []);
            setCategories(response?.summary.categories || []);
            setSubcategories(response?.summary.subcategories || []);
            setCollections(response?.summary.collections || []);
            setPriceRanges(response?.summary.priceRanges || []);
        } catch (error) {
            console.log("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };






    useEffect(() => {
        // Cuando cambian los filtros, volvemos a la primera página y desplazamos hacia arriba
        fetchProducts(1, true);
    }, [selectedFilters]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            // Primero, desplazar hacia arriba suavemente
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Luego, obtener productos de la nueva página
            fetchProducts(page);
        }
    };

    // Generar números de página para la paginación
    const getPageNumbers = () => {
        const pages = [];
        const total = pagination.totalPages;
        const current = pagination.currentPage;
        const delta = 2;

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
    // Opciones de ordenación
    const sortOptions = [
        { value: "created_at:desc", label: "Más reciente" },
        { value: "created_at:asc", label: "Mas antiguo" },
        { value: "final_price:asc", label: "Precio: Menor a Mayor" },
        { value: "final_price:desc", label: "Precio: Mayor a Menor" },
        { value: "name:asc", label: "Nombre: A-Z" },
        { value: "name:desc", label: "Nombre: Z-A" },
    ];


    //}, [items]);
    // Manejar cambios en los filtros y mantener filterSequence
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
            let newValues;
            if (currentValues.includes(value)) {
                // Deseleccionar
                newValues = currentValues.filter((item) => item !== value);
            } else {
                // Seleccionar
                newValues = [...currentValues, value];
            }

            return { ...prev, [type]: newValues };
        });

        // Update filterSequence
        setFilterSequence((prevSeq) => {
            // Only track these filter types in the sequence
            const trackedTypes = ["brand_id", "category_id", "collection_id"];
            if (!trackedTypes.includes(type)) return prevSeq;

            // If selecting (not removing)
            if (!selectedFilters[type]?.includes(value)) {
                // If not already in sequence, add to end
                if (!prevSeq.includes(type)) {
                    return [...prevSeq, type];
                }
                return prevSeq;
            } else {
                // If removing, check if any values left for this type
                const remaining = selectedFilters[type]?.filter((item) => item !== value) || [];
                if (remaining.length === 0) {
                    // Remove from sequence
                    return prevSeq.filter((t) => t !== type);
                }
                return prevSeq;
            }
        });
    };

    // Alternar secciones de filtros
    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const [searchCategory, setSearchCategory] = useState("");
    const [searchSubcategory, setSearchSubcategory] = useState("");
    const [searchBrand, setSearchBrand] = useState("");

    // Filtrar categorías según el input
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchCategory.toLowerCase())
    );
    const filteredSubcategories = subcategories.filter((subcategory) =>
        subcategory.name.toLowerCase().includes(searchSubcategory.toLowerCase())
    );

    // Filtrar marcas según el input
    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );

    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <section className="py-12 bg-sections-color customtext-neutral-dark">
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 pb-4 border-b-2">
                    <h2 className="text-[32px] md:text-4xl font-bold md:w-6/12">
                        {data?.title}
                    </h2>
                    <div className="flex flex-col w-full  items-center gap-4 md:flex-row md:w-5/12">
                        <span className="block md:w-6/12 order-1 md:order-none">
                            Productos seleccionados:{" "}
                            <strong>{products?.length}</strong>
                        </span>
                        {/* Ordenación */}
                        <div className="w-full md:w-6/12">
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

                <div className="relative flex flex-col lg:flex-row gap-4">
                    <button
                        className="w-full flex lg:hidden gap-2 items-center"
                        onClick={() => setFiltersOpen(true)}
                    >
                        <h2 className="text-2xl font-bold">Filtros</h2>
                        <Filter className="h-5 w-5" />
                    </button>
                    <div className={`${filtersOpen
                        ? "fixed inset-0  bg-white flex flex-col h-screen z-[999]"
                        : "hidden"
                        } lg:block lg:w-3/12 lg:bg-white lg:p-4 lg:rounded-lg lg:h-max`}
                    >
                        {/* Header fijo para mobile */}
                        <div className="fixed top-0 left-0 right-0 bg-white p-4 border-b z-10 h-16 flex items-center justify-between lg:relative lg:p-0 lg:border-none lg:h-auto">
                            <h2 className="text-xl font-bold">Filtros</h2>
                            <button
                                className="lg:hidden"
                                onClick={() => setFiltersOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <Filter className="hidden lg:block h-5 w-5" />
                        </div>

                        {/* Contenido principal con scroll */}
                        <div className="flex-1 overflow-y-auto px-4 mt-16 pb-20 lg:mt-0 lg:pb-0 lg:px-0">
                            {/* Sección Marcas */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection("marca")}
                                    className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                >
                                    <span className="font-medium">Marca</span>
                                    <ChevronDown
                                        className={`h-5 w-5 transform transition-transform ${sections.marca ? "" : "-rotate-180"
                                            }`}
                                    />
                                </button>
                                {sections.marca && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar"
                                                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-0 focus:outline-0"
                                                value={searchBrand}
                                                onChange={(e) => setSearchBrand(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto p-1">
                                            {filteredBrands.map((brand) => (
                                                <label
                                                    key={brand.id}
                                                    className="flex items-center gap-2 py-1.5"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 rounded border-gray-300 accent-primary"
                                                        onChange={() => handleFilterChange("brand_id", brand.slug)}
                                                    />
                                                    <span className="text-sm lg:text-base">{brand.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sección Categorías */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection("categoria")}
                                    className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                >
                                    <span className="font-medium">Categoría</span>
                                    <ChevronDown
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
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto p-1">
                                            {filteredCategories.map((category) => (
                                                <div key={category.id}>
                                                    <label className="flex items-center gap-2 py-1.5">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-gray-300 accent-primary"
                                                            onChange={() => handleFilterChange("category_id", category.slug)}
                                                            checked={selectedFilters.category_id?.includes(category.slug)}
                                                        />
                                                        <span className="text-sm lg:text-base">{category.name}</span>
                                                    </label>

                                                    {selectedFilters.category_id?.includes(category.slug) && (
                                                        <ul className="ml-4 pl-3 mt-1 space-y-2 border-l-2 border-gray-200">
                                                            {category.subcategories?.map((sub) => (
                                                                <label key={sub.id} className="flex items-center gap-2 py-1.5">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="h-4 w-4 rounded border-gray-300 accent-primary"
                                                                        onChange={() => handleFilterChange("subcategory_id", sub.slug)}
                                                                        checked={selectedFilters.subcategory_id?.includes(sub.slug)}
                                                                    />
                                                                    <span className="text-sm lg:text-base">{sub.name}</span>
                                                                </label>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sección Subcategorías */}
                            <motion.div className="mb-6">
                                <motion.button
                                    onClick={() => toggleSection("subcategoria")}
                                    className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                    whileHover={{ x: 3 }}
                                >
                                    <span className="font-medium">Sub Categorías</span>
                                    <ChevronDown
                                        className={`h-5 w-5 transform transition-transform ${sections.subcategoria ? "" : "-rotate-180"
                                            }`}
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {sections.subcategoria && (
                                        <motion.div
                                            className="space-y-1"
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={{
                                                hidden: { opacity: 0, height: 0 },
                                                visible: { opacity: 1, height: "auto" }
                                            }}
                                        >
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar"
                                                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-0 focus:outline-0"
                                                    value={searchSubcategory}
                                                    onChange={(e) => setSearchSubcategory(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-3 max-h-[200px] overflow-y-auto p-1">
                                                {filteredSubcategories.map((subcategory) => (
                                                    <label
                                                        key={subcategory.id}
                                                        className="flex items-center gap-2 py-1.5"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-gray-300 accent-primary"
                                                            onChange={() => handleFilterChange("subcategory_id", subcategory.slug)}
                                                            checked={selectedFilters.subcategory_id?.includes(subcategory.slug)}
                                                        />
                                                        <span className="text-sm lg:text-base">{subcategory.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Sección Precio */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection("precio")}
                                    className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                >
                                    <span className="font-medium">Precio</span>
                                    <ChevronDown
                                        className={`h-5 w-5 transform transition-transform ${sections.precio ? "" : "-rotate-180"
                                            }`}
                                    />
                                </button>
                                {sections.precio && (
                                    <div className="space-y-3 p-1">
                                        {priceRanges.map((range) => (
                                            <label
                                                key={`${range.min}-${range.max}`}
                                                className="flex items-center gap-2 py-1.5"
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
                                onClick={() => {
                                    // Cerrar filtros y desplazar hacia arriba
                                    setFiltersOpen(false);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth'
                                    });
                                }}
                            >
                                Ver resultados
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-9/12 py-4">
                        {/* Productos */}
                        {loading ? (
                            <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                    (index) => (
                                        <SkeletonCard key={index} />
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out">
                                {Array.isArray(products) &&
                                    products.length > 0 ? (
                                    products.map((product) => (
                                        <div
                                            className="   w-1/2 lg:w-1/3 xl:w-1/4 lg:h-[460px] lg:max-h-[460px]  xl:h-[400px] xl:max-h-[400px] 2xl:h-[430px] 2xl:max-h-[430px] flex items-center justify-center"
                                            // className="   w-1/2 lg:w-1/3 xl:w-1/4"
                                            key={product.id}
                                        >
                                            <CardHoverBtn
                                                data={data}
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
                        {/* Paginación inferior */}
                        <motion.div
                            className="flex flex-col md:flex-row justify-between items-center mb-4 w-full mt-8 gap-4"
                        >
                            <div className="customtext-primary font-semibold w-full md:w-auto">
                                <div className="overflow-x-auto pb-2">
                                    <nav className="flex items-center gap-x-2 min-w-max">
                                        <motion.button
                                            className={`p-4 inline-flex items-center ${pagination.currentPage === 1
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.currentPage - 1
                                                )
                                            }
                                            disabled={pagination.currentPage === 1}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <ChevronLeft />
                                        </motion.button>

                                        {getPageNumbers().map((page, index) => (
                                            <React.Fragment key={index}>
                                                {page === "..." ? (
                                                    <span className="w-10 h-10 bg-transparent p-2 inline-flex items-center justify-center rounded-full">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <motion.button
                                                        className={`w-10 h-10 p-2 inline-flex items-center justify-center rounded-full transition-all duration-300 
                                                        ${page ===
                                                                pagination.currentPage
                                                                ? "bg-primary text-white"
                                                                : "bg-transparent hover:text-white hover:bg-primary"
                                                            }`}
                                                        onClick={() =>
                                                            handlePageChange(page)
                                                        }
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {page}
                                                    </motion.button>
                                                )}
                                            </React.Fragment>
                                        ))}

                                        <motion.button
                                            className={`p-4 inline-flex items-center ${pagination.currentPage ===
                                                pagination.totalPages
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.currentPage + 1
                                                )
                                            }
                                            disabled={
                                                pagination.currentPage ===
                                                pagination.totalPages
                                            }
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <ChevronRight />
                                        </motion.button>
                                    </nav>
                                </div>
                            </div>
                            <div className="w-full md:w-auto text-center md:text-right">
                                <p className="font-semibold">
                                    {pagination.from} - {pagination.to} de{" "}
                                    {pagination.totalItems} Resultados
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CatalagoFiltros;
