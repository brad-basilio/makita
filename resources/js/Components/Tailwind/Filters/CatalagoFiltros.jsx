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
        <div
            className={`group  animate-pulse  transition-transform duration-300 hover:scale-105 w-1/2 lg:w-1/4 flex-shrink-0 font-font-general customtext-primary cursor-pointer`}
        >
            <div className=" px-4">
                <div className="bg-white rounded-3xl">
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative">
                        <div className="aspect-square bg-gray-300 rounded-3xl overflow-hidden flex items-center justify-center  bg-secondary">
                            <svg
                                class="w-10 h-10 text-gray-200 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 18"
                            >
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

//const CatalagoFiltros = ({ items, data, categories, brands, prices, cart, setCart }) => {
const CatalagoFiltros = ({ items, data, filteredData, cart, setCart }) => {
    //const { categories, brands, priceRanges } = filteredData;
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);

    const [sections, setSections] = useState({
        marca: true,
        precio: true,
        categoria: true,
        subcategoria: true,
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
    //filtros nuevos
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
            transformedFilters.push(["or", ...collectionConditions]);
        }

        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category.slug",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...categoryConditions]);
        }

        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => [
                "subcategory.slug",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...subcategoryConditions]);
        }

        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((id) => [
                "brand.slug",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...brandConditions]);
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

        return transformedFilters;
    };
    // Obtener productos filtrados desde el backend
    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const filters = transformFilters(selectedFilters);
            const params = {
                filter: filters,
                sort: selectedFilters.sort,
                skip: (page - 1) * pagination.itemsPerPage,
                take: pagination.itemsPerPage,
                requireTotalCount: true,
            };
            console.log(params);

            const response = await itemsRest.paginate(params);
            console.log(response)

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
           // console.log(response);
            setBrands(response?.summary.brands);
            setCategories(response?.summary.categories);
            setSubcategories(response?.summary.subcategories);
            setPriceRanges(response?.summary.priceRanges);
        } catch (error) {
            console.log("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };



   


    useEffect(() => {
        
        fetchProducts(pagination.currentPage);
    }, [selectedFilters]);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
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

                <div className="relative flex flex-col lg:flex-row gap-4">
                    <button
                        className="w-full flex lg:hidden gap-2 items-center"
                        onClick={() => setFiltersOpen(true)}
                    >
                        <h2 className="text-2xl font-bold">Filtros</h2>
                        <Filter className="h-5 w-5" />
                    </button>
                    <div
                        className={`${filtersOpen
                            ? "fixed inset-0 z-50 bg-white p-4 overflow-y-auto"
                            : "hidden"
                            } lg:block lg:w-3/12 bg-white p-4 rounded-lg h-max`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Filtros</h2>
                            <Filter className="hidden lg:block h-5 w-5" />
                            <button
                                className=" lg:hidden "
                                onClick={() => setFiltersOpen(!filtersOpen)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("marca")}
                                className="flex items-center justify-between w-full mb-4"
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
                                                className="flex items-center space-x-3 customtext-neutral-light"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    onChange={() =>
                                                        handleFilterChange(
                                                            "brand_id",
                                                            brand.slug
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
                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("categoria")}
                                className="flex items-center justify-between w-full mb-4"
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
                                                <label className="flex items-center space-x-3 customtext-neutral-light">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300"
                                                        onChange={() =>
                                                            handleFilterChange(
                                                                "category_id",
                                                                category.slug
                                                            )
                                                        }
                                                        checked={selectedFilters.category_id?.includes(
                                                            category.slug
                                                        )} // <-- Agregado
                                                    />
                                                    <span>{category.name}</span>
                                                </label>

                                                {/* Mostrar subcategorías si la categoría está seleccionada */}
                                                {selectedFilters.category_id?.includes(
                                                    category.slug
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
                                                                        className="flex items-center space-x-3 customtext-neutral-light"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="h-4 w-4 rounded border-gray-300"
                                                                            onChange={() =>
                                                                                handleFilterChange(
                                                                                    "subcategory_id",
                                                                                    sub.slug
                                                                                )
                                                                            } // <-- Corregido
                                                                            checked={selectedFilters.subcategory_id?.includes(
                                                                                sub.slug
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

                        <motion.div className="mb-6" >
                            <motion.button
                                onClick={() => toggleSection("subcategoria")}
                                className="flex items-center justify-between w-full mb-4"
                                whileHover={{ x: 3 }}
                            >
                                <span className="font-medium">
                                    Sub Categorías
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${sections.subcategoria
                                        ? ""
                                        : "-rotate-180"
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
                                            hidden: {
                                                opacity: 0,
                                                height: 0,
                                            },
                                            visible: {
                                                opacity: 1,
                                                height: "auto",
                                                transition: {
                                                    staggerChildren: 0.1,
                                                },
                                            },
                                        }}
                                    >
                                        <motion.div
                                            className="relative"

                                        >
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar"
                                                className="w-full px-4 pl-10 py-3 border customtext-neutral-dark border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0 transition-all duration-300"
                                                value={searchSubcategory}
                                                onChange={(e) =>
                                                    setSearchSubcategory(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </motion.div>

                                        {filteredSubcategories.map(
                                            (subcategory) => {
                                                const isChecked =
                                                    selectedFilters.subcategory_id?.includes(
                                                        subcategory.slug
                                                    );
                                                return (
                                                    <motion.div
                                                        key={subcategory.id}
                                                        className={`group py-2 rounded-md ${isChecked
                                                            ? "bg-primary "
                                                            : "bg-transparent"
                                                            }`}

                                                    >
                                                        <label className="flex items-center justify-between space-x-3 px-4 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                onChange={() =>
                                                                    handleFilterChange(
                                                                        "subcategory_id",
                                                                        subcategory.slug
                                                                    )
                                                                }
                                                                checked={
                                                                    isChecked
                                                                }
                                                            />

                                                            <span
                                                                className={`${isChecked
                                                                    ? "text-white"
                                                                    : "text-gray-700"
                                                                    }`}
                                                            >
                                                                {
                                                                    subcategory.name
                                                                }
                                                            </span>
                                                        </label>
                                                    </motion.div>
                                                );
                                            }
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Precio Section */}
                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("precio")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Precio</span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${sections.precio ? "" : "-rotate-180"
                                        }`}
                                />
                            </button>
                            {sections.precio && (
                                <div className="space-y-3">
                                    {priceRanges.map((range) => (
                                        <label
                                            key={`${range.min}-${range.max}`}
                                            className="flex items-center space-x-3 customtext-neutral-light"
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


                        {/* <button className="w-full bg-primary text-white py-3 rounded-xl hover:brightness-90 transition-colors text-sm font-bold">
                            Aplicar Filtro
                        </button>*/}
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
                            className="flex justify-between items-center mb-4 w-full mt-8"

                        >
                            <div className="customtext-primary font-semibold">
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
                            <div>
                                <p className="font-semibold">
                                    {pagination.from} - {pagination.to} de{" "}
                                    {pagination.totalItems} Resultados
                                </p>
                            </div>
                        </motion.div>
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
