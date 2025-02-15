import React, { useEffect, useState } from 'react';

import CardHoverBtn from '../Products/Components/CardHoverBtn';
import { ChevronDown, Filter, Search, Tag } from 'lucide-react';
import ItemsRest from '../../../Actions/ItemsRest';
import ArrayJoin from '../../../Utils/ArrayJoin';

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
        brand_id: [],    // Array para múltiples marcas

        price: null,
        sort_by: 'created_at',
        order: 'desc',
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
            const categoryConditions = filters.category_id.map((id) => ['category_id', '=', id]);
            transformedFilters.push(['or', ...categoryConditions]);
        }

        // Marcas
        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((id) => ['brand_id', '=', id]);
            transformedFilters.push(['or', ...brandConditions]);
        }

        // Precio
        if (filters.price) {
            transformedFilters.push([
                'and',
                [
                    ['final_price', '>=', filters.price.min], 'and',
                    ['final_price', '<=', filters.price.max],
                ],
            ]);
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
                page,
                take: 20, // Número de productos por página
            };

            console.log(params)
            const response = await itemsRest.paginate(params);
            console.log(response);
            setProducts(response.data);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.lastPage,
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedFilters]);

    // Manejar cambios en los filtros
    const handleFilterChange = (type, value) => {
        setSelectedFilters((prev) => {
            if (type === "price") {
                // Si el mismo rango ya está seleccionado, lo deseleccionamos; de lo contrario, lo asignamos
                return {
                    ...prev,
                    price: prev.price && prev.price.min === value.min && prev.price.max === value.max
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
    const [searchBrand, setSearchBrand] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

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
            <div className="mx-auto px-primary">
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
                    <h2 className="text-4xl font-bold">{data?.title}</h2>
                    <div className="flex items-center gap-4">
                        <span>Productos seleccionados: <strong>{products?.length}</strong></span>
                        {/* Ordenación */}
                        <select
                            value={selectedFilters.sort_by + ':' + selectedFilters.order}
                            onChange={(e) => {
                                const [sort_by, order] = e.target.value.split(':');
                                setSelectedFilters((prev) => ({
                                    ...prev,
                                    sort_by,
                                    order,
                                }));
                            }}
                        >
                            <option value="created_at:desc">Más reciente</option>
                            <option value="created_at:asc">Más antiguo</option>
                            <option value="price:asc">Precio: Menor a mayor</option>
                            <option value="price:desc">Precio: Mayor a menor</option>
                            <option value="name:asc">Nombre: A-Z</option>
                            <option value="name:desc">Nombre: Z-A</option>
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
                                        {brands.map((brand) => (
                                            <label key={brand.id} className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    onChange={() => handleFilterChange("brand_id", brand.id)}
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
                                    {priceRanges.map((range) => (
                                        <label key={`${range.min}-${range.max}`} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                name="precio"
                                                className="h-4 w-4 rounded border-gray-300"
                                                onChange={() => handleFilterChange("price", range)}
                                                checked={
                                                    selectedFilters.price &&
                                                    selectedFilters.price.min === range.min &&
                                                    selectedFilters.price.max === range.max
                                                }
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
                                    {categories.map((category) => (
                                        <div key={category.id}>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"

                                                    onChange={() => handleFilterChange("category_id", category.id)}
                                                // checked={categories.includes(category.slug)} // <-- Agregado
                                                />
                                                <span>{category.name}</span>
                                            </label>
                                            {categories.includes(category.id) && (
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


                        {/* Productos */}
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out">
                                {Array.isArray(products) && products.length > 0 ? (
                                    products.map((product) => (
                                        <CardHoverBtn key={product.id} product={product} widthClass='lg:w-1/4' cart={cart} setCart={setCart} />
                                    ))
                                ) : (
                                    <p>No hay productos que coincidan con los filtros seleccionados.</p>
                                )}
                            </div>
                        )}
                    </div>


                </div>
                {/* Paginación */}
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
                </div>
            </div>

        </section >
    );
};

export default CatalagoFiltros;
