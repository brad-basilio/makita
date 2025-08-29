import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ChevronDown, Filter, LayoutGrid, LucideListTodo, Search, Tag, X } from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import { GET } from "sode-extend-react";
import CardProductMakita from "../Products/Components/CardProductMakita";

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

const FilterMakita = ({ items, data, filteredData, cart, setCart }) => {
    const [allProducts, setAllProducts] = useState([]); // Todos los productos
    const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
    const [specifications, setSpecifications] = useState({});
    const [activeSection, setActiveSection] = useState(null);
    const [viewType, setViewType] = useState('grid'); // 'grid' o 'list'

    const [sections, setSections] = useState({
        especificaciones: true,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        specifications: {},
        name: GET.search || null,
    });

    const [loading, setLoading] = useState(true);

    // Función para filtrar productos del lado del cliente
    const filterProducts = (products, filters) => {
        // Validar que products sea un array
        if (!Array.isArray(products)) {
            console.log('filterProducts: products no es un array:', products);
            return [];
        }

        return products.filter(product => {
            // Validar que el producto existe
            if (!product) return false;

            // Filtro por nombre/búsqueda
            if (filters.name && filters.name.trim() !== '') {
                const searchTerm = filters.name.toLowerCase();
                const productName = (product.name || '').toLowerCase();
                const productDescription = (product.description || '').toLowerCase();
                const productSummary = (product.summary || '').toLowerCase();

                if (!productName.includes(searchTerm) &&
                    !productDescription.includes(searchTerm) &&
                    !productSummary.includes(searchTerm)) {
                    return false;
                }
            }

            // Filtros por especificaciones técnicas
            if (filters.specifications && Object.keys(filters.specifications).length > 0) {
                for (const [specName, selectedValues] of Object.entries(filters.specifications)) {
                    if (selectedValues.length > 0) {
                        let hasMatch = false;

                        // Buscar en especificaciones técnicas del producto
                        if (product.specifications && Array.isArray(product.specifications)) {
                            product.specifications.forEach(spec => {
                                if (spec.type === 'technical' && spec.title === specName) {
                                    if (selectedValues.includes(spec.description)) {
                                        hasMatch = true;
                                    }
                                }
                            });
                        }

                        // Si no se encontró en especificaciones técnicas, buscar en campos directos
                        if (!hasMatch) {
                            const directFields = {
                                'Color': product.color,
                                'Textura': product.texture,
                                'SKU': product.sku,
                                'Marca': product.brand?.name,
                                'Categoría': product.category?.name,
                                'Subcategoría': product.subcategory?.name,
                                'Colección': product.collection?.name,
                                'Plataforma': product.platform?.name,
                                'Familia': product.family?.name,
                            };

                            if (directFields[specName]) {
                                hasMatch = selectedValues.includes(directFields[specName]);
                            } else {
                                // Para especificaciones extraídas del nombre del producto
                                hasMatch = selectedValues.some(value =>
                                    product.name.toLowerCase().includes(value.toLowerCase())
                                );
                            }
                        }

                        if (!hasMatch) {
                            return false;
                        }
                    }
                }
            }

            return true;
        });
    };

    // Función para procesar especificaciones desde los productos
    const processSpecificationsFromProducts = (products) => {
        console.log('Iniciando procesamiento de especificaciones para', products.length, 'productos');
        const specsMap = {};

        // Validar que products sea un array
        if (!Array.isArray(products) || products.length === 0) {
            console.log('No hay productos para procesar o products no es un array:', products);
            return {};
        }

        products.forEach(product => {
            // Validar que product existe
            if (!product) return;

            // Procesar campos directos del producto que pueden ser filtros
            const directFields = {
                'Color': product.color,
                'Textura': product.texture,
                'SKU': product.sku,
                'Marca': product.brand?.name,
                'Categoría': product.category?.name,
                'Subcategoría': product.subcategory?.name,
                'Colección': product.collection?.name,
                'Plataforma': product.platform?.name,
                'Familia': product.family?.name,
            };

            // Agregar campos directos
            Object.entries(directFields).forEach(([fieldName, fieldValue]) => {
                if (fieldValue && fieldValue.toString().trim() !== '' && fieldValue.toString().trim() !== 'null') {
                    if (!specsMap[fieldName]) {
                        specsMap[fieldName] = new Set();
                    }
                    specsMap[fieldName].add(fieldValue.toString().trim());
                }
            });

            // Procesar especificaciones técnicas del producto (ItemSpecification)
            if (product.specifications && Array.isArray(product.specifications)) {
                console.log(`Procesando especificaciones para producto ${product.name}:`, product.specifications);
                product.specifications.forEach(spec => {
                    // Solo procesar especificaciones de tipo 'technical'
                    if (spec.type === 'technical' && spec.title && spec.description) {
                        const title = spec.title.trim();
                        const description = spec.description.trim();

                        console.log(`Especificación técnica encontrada: ${title} = ${description}`);

                        if (title !== '' && description !== '' && description !== 'null') {
                            if (!specsMap[title]) {
                                specsMap[title] = new Set();
                            }
                            specsMap[title].add(description);
                        }
                    }
                });
            } else {
                console.log(`Producto ${product.name} no tiene especificaciones o no es un array:`, product.specifications);
            }

            // Si el producto tiene un campo specifications como objeto, también procesarlo
            if (product.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications)) {
                Object.entries(product.specifications).forEach(([specName, specValue]) => {
                    if (specValue && specValue.toString().trim() !== '' && specValue.toString().trim() !== 'null') {
                        if (!specsMap[specName]) {
                            specsMap[specName] = new Set();
                        }
                        specsMap[specName].add(specValue.toString().trim());
                    }
                });
            }

            // Extraer especificaciones del nombre del producto (común en productos técnicos)
            if (product.name) {
                const nameSpecs = extractSpecsFromName(product.name);
                Object.entries(nameSpecs).forEach(([specName, specValue]) => {
                    if (!specsMap[specName]) {
                        specsMap[specName] = new Set();
                    }
                    specsMap[specName].add(specValue);
                });
            }
        });

        // Convertir Sets a arrays y ordenar
        const processedSpecs = {};
        Object.entries(specsMap).forEach(([specName, valuesSet]) => {
            if (valuesSet.size > 0) { // Incluir todos los valores, incluso si solo hay uno
                processedSpecs[specName] = Array.from(valuesSet).sort((a, b) => {
                    // Ordenar numéricamente si ambos valores son números
                    const numA = parseFloat(a);
                    const numB = parseFloat(b);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                    }
                    // Ordenar alfabéticamente si no son números
                    return a.localeCompare(b);
                });
            }
        });

        console.log('Especificaciones procesadas:', processedSpecs);
        return processedSpecs;
    };

    // Función para extraer especificaciones del nombre del producto
    const extractSpecsFromName = (name) => {
        const specs = {};

        // Patrones comunes en nombres de productos técnicos Makita
        const patterns = [
            // Potencia
            { regex: /(\d+(?:\.\d+)?)\s*w(?:att)?s?/gi, key: 'Potencia (W)' },
            { regex: /(\d+(?:\.\d+)?)\s*kw/gi, key: 'Potencia (kW)' },

            // Voltaje
            { regex: /(\d+(?:\.\d+)?)\s*v(?:olt)?s?/gi, key: 'Tensión nominal (V)' },

            // Velocidad
            { regex: /(\d+(?:[,.]\d+)?)\s*-\s*(\d+(?:[,.]\d+)?)\s*rpm/gi, key: 'Velocidad (RPM)' },
            { regex: /(\d+(?:[,.]\d+)?)\s*rpm/gi, key: 'Velocidad (RPM)' },
            { regex: /(\d+(?:[,.]\d+)?)\s*min⁻¹/gi, key: 'Velocidad (min⁻¹)' },

            // Peso
            { regex: /(\d+(?:\.\d+)?)\s*kg/gi, key: 'Peso (kg)' },
            { regex: /(\d+(?:\.\d+)?)\s*g(?!r)/gi, key: 'Peso (g)' },

            // Dimensiones
            { regex: /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*mm/gi, key: 'Dimensiones (mm)' },
            { regex: /(\d+(?:\.\d+)?)\s*mm/gi, key: 'Medida (mm)' },
            { regex: /(\d+(?:\.\d+)?)\s*cm/gi, key: 'Medida (cm)' },

            // Torque
            { regex: /(\d+(?:\.\d+)?)\s*nm/gi, key: 'Torque (Nm)' },

            // Pulgadas
            { regex: /(\d+(?:\.\d+)?)\s*"/gi, key: 'Medida (pulgadas)' },
            { regex: /(\d+(?:\.\d+)?)\s*''/gi, key: 'Medida (pulgadas)' },

            // Capacidad
            { regex: /(\d+(?:\.\d+)?)\s*l(?:itros?)?/gi, key: 'Capacidad (L)' },
            { regex: /(\d+(?:\.\d+)?)\s*ml/gi, key: 'Capacidad (ml)' },

            // Capacidad de batería
            { regex: /(\d+(?:\.\d+)?)\s*ah/gi, key: 'Capacidad batería (Ah)' },
            { regex: /(\d+(?:\.\d+)?)\s*mah/gi, key: 'Capacidad batería (mAh)' },

            // Presión
            { regex: /(\d+(?:\.\d+)?)\s*bar/gi, key: 'Presión (bar)' },
            { regex: /(\d+(?:\.\d+)?)\s*psi/gi, key: 'Presión (PSI)' },
            { regex: /(\d+(?:\.\d+)?)\s*mbar/gi, key: 'Presión (mbar)' },

            // Volumen de aire
            { regex: /(\d+(?:\.\d+)?)\s*m³\/min/gi, key: 'Volumen de aire (m³/min)' },
            { regex: /(\d+(?:\.\d+)?)\s*cfm/gi, key: 'Volumen de aire (CFM)' },

            // Nivel de ruido
            { regex: /(\d+(?:\.\d+)?)\s*db\(a\)/gi, key: 'Nivel sonoro (dB(A))' },
            { regex: /(\d+(?:\.\d+)?)\s*db/gi, key: 'Nivel sonoro (dB)' },

            // Frecuencia
            { regex: /(\d+(?:\.\d+)?)\s*hz/gi, key: 'Frecuencia (Hz)' },

            // Temperatura
            { regex: /(\d+(?:\.\d+)?)\s*°c/gi, key: 'Temperatura (°C)' },
            { regex: /(\d+(?:\.\d+)?)\s*°f/gi, key: 'Temperatura (°F)' },
        ];

        patterns.forEach(pattern => {
            const matches = [...name.matchAll(pattern.regex)];
            if (matches.length > 0) {
                matches.forEach(match => {
                    let value;
                    if (pattern.key === 'Dimensiones (mm)' && match[3]) {
                        // Para dimensiones, concatenar todos los valores
                        value = `${match[1]} x ${match[2]} x ${match[3]} mm`;
                    } else if (pattern.key === 'Velocidad (RPM)' && match[2]) {
                        // Para rangos de velocidad
                        value = `${match[1]} - ${match[2]} RPM`;
                    } else {
                        value = match[1] || match[0];
                    }

                    if (value && value.toString().trim() !== '') {
                        if (!specs[pattern.key]) {
                            specs[pattern.key] = value.toString().trim();
                        }
                    }
                });
            }
        });

        return specs;
    };
    // Obtener todos los productos una sola vez
    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const params = {
                take: 10000, // Número grande para obtener todos los productos
                skip: 0,
                requireTotalCount: false,
            };

            console.log('Obteniendo todos los productos...');
            console.log('Parámetros enviados:', params);
            console.log('ItemsRest instance:', itemsRest);

            const response = await itemsRest.paginate(params);
            console.log('Respuesta completa de la API:', response);

            // Validar la respuesta
            if (!response || !response.data) {
                console.error('La respuesta de la API no tiene la estructura esperada:', response);
                setAllProducts([]);
                setFilteredProducts([]);
                setSpecifications({});
                return;
            }

            // Validar la respuesta y extraer productos
            let products = [];
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    products = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    // Algunas APIs devuelven los datos en response.data.data
                    products = response.data.data;
                } else if (response.data.items && Array.isArray(response.data.items)) {
                    // Otras APIs usan response.data.items
                    products = response.data.items;
                }
            }

            console.log('Productos extraídos:', products);

            setAllProducts(products);

            // Procesar especificaciones dinámicas con TODOS los productos
            const processedSpecs = processSpecificationsFromProducts(products);
            console.log('Especificaciones procesadas:', processedSpecs);
            setSpecifications(processedSpecs);

            // Aplicar filtros URL primero
            const urlFiltered = applyURLFilters(products);

            // Luego aplicar filtros de especificaciones
            const finalFiltered = filterProducts(urlFiltered, selectedFilters);
            setFilteredProducts(finalFiltered);

        } catch (error) {
            console.error("Error fetching products:", error);
            // En caso de error, establecer valores por defecto
            setAllProducts([]);
            setFilteredProducts([]);
            setSpecifications({});
        } finally {
            setLoading(false);
        }
    };






    // Función para obtener parámetros URL
    const getURLParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};

        // Obtener parámetros específicos
        const category = urlParams.get('category');
        const platform = urlParams.get('platform');
        const family = urlParams.get('family');
        const brand = urlParams.get('brand');
        const collection = urlParams.get('collection');

        if (category) params.category = category;
        if (platform) params.platform = platform;
        if (family) params.family = family;
        if (brand) params.brand = brand;
        if (collection) params.collection = collection;

        return params;
    };

    // Función para aplicar filtros desde URL
    const applyURLFilters = (products) => {
        const urlParams = getURLParams();

        if (Object.keys(urlParams).length === 0) {
            return products;
        }

        console.log('Aplicando filtros desde URL:', urlParams);

        return products.filter(product => {
            let matches = true;

            // Filtrar por categoría
            if (urlParams.category && product.category?.slug !== urlParams.category) {
                matches = false;
            }

            // Filtrar por plataforma
            if (urlParams.platform && product.platform?.slug !== urlParams.platform) {
                matches = false;
            }

            // Filtrar por familia
            if (urlParams.family && product.family?.slug !== urlParams.family) {
                matches = false;
            }

            // Filtrar por marca
            if (urlParams.brand && product.brand?.slug !== urlParams.brand) {
                matches = false;
            }

            // Filtrar por colección
            if (urlParams.collection && product.collection?.slug !== urlParams.collection) {
                matches = false;
            }

            return matches;
        });
    };

    useEffect(() => {
        // Solo intentar cargar productos si hay datos o si no es la carga inicial
        fetchAllProducts();
    }, []);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        if (Array.isArray(allProducts) && allProducts.length > 0) {
            // Aplicar filtros URL primero
            const urlFiltered = applyURLFilters(allProducts);

            // Luego aplicar filtros de especificaciones
            const finalFiltered = filterProducts(urlFiltered, selectedFilters);
            setFilteredProducts(finalFiltered);
        } else {
            setFilteredProducts([]);
        }
    }, [selectedFilters, allProducts]);
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
    const handleFilterChange = (type, value, specName = null) => {
        setSelectedFilters((prev) => {
            if (type === "specifications") {
                const newSpecifications = { ...prev.specifications };

                if (!newSpecifications[specName]) {
                    newSpecifications[specName] = [];
                }

                const currentValues = newSpecifications[specName];
                const newValues = currentValues.includes(value)
                    ? currentValues.filter((item) => item !== value)
                    : [...currentValues, value];

                if (newValues.length === 0) {
                    delete newSpecifications[specName];
                } else {
                    newSpecifications[specName] = newValues;
                }

                return {
                    ...prev,
                    specifications: newSpecifications,
                };
            }

            return { ...prev, [type]: value };
        });
    };

    // Alternar secciones de filtros
    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Limpiar todos los filtros
    const clearAllFilters = () => {
        setSelectedFilters({
            specifications: {},
            name: GET.search || null,
        });
    };

    const [searchSpecifications, setSearchSpecifications] = useState({});

    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <section className="py-12 bg-sections-color customtext-neutral-dark">
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 pb-4 border-b-2">
                    <h2 className="text-[32px] md:text-4xl font-bold md:w-6/12">
                        {data?.title}
                    </h2>
                    <div className="flex flex-col w-full items-center justify-end gap-4 md:flex-row md:w-5/12">
                        <span className="block md:w-6/12 order-1 md:order-none">
                            Productos encontrados:{" "}
                            <strong>{Array.isArray(filteredProducts) ? filteredProducts.length : 0}</strong>
                            {Array.isArray(allProducts) && allProducts.length > 0 && (
                                <span className="text-gray-500 text-sm"> de {allProducts.length}</span>
                            )}
                        </span>

                        {/* Mostrar filtros activos */}
                        {(Object.keys(selectedFilters.specifications).length > 0 || Object.keys(getURLParams()).length > 0) && (
                            <div className="flex flex-wrap gap-2 text-xs">
                                {/* Filtros URL */}
                                {Object.entries(getURLParams()).map(([paramName, paramValue]) => (
                                    <span
                                        key={`url-${paramName}-${paramValue}`}
                                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"
                                    >
                                        {paramName}: {paramValue}
                                        <span className="text-xs opacity-70">(URL)</span>
                                    </span>
                                ))}

                                {/* Filtros de especificaciones */}
                                {Object.entries(selectedFilters.specifications).map(([specName, values]) =>
                                    values.map(value => (
                                        <span
                                            key={`${specName}-${value}`}
                                            className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                                        >
                                            {specName}: {value}
                                            <button
                                                onClick={() => handleFilterChange("specifications", value, specName)}
                                                className="hover:bg-primary/20 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        )}
                        {/* Controles de vista */}
                        <div className="flex items-center gap-2 mr-2">
                            <button
                                onClick={() => setViewType('grid')}
                                className={`p-2 rounded-md ${viewType === 'grid'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                title="Vista grilla"
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewType('list')}
                                className={`p-2 rounded-md ${viewType === 'list'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                title="Vista lista"
                            >
                                <LucideListTodo className="h-5 w-5" />

                            </button>
                        </div>
                        {/* Ordenación */}
                        {/*<div className="w-full md:w-6/12">
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
                        </div> */}
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
                            <div className="flex items-center gap-2">
                                {/* Botón limpiar filtros */}
                                {Object.keys(selectedFilters.specifications).length > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-primary hover:text-primary-dark underline"
                                    >
                                        Limpiar
                                    </button>
                                )}
                                <button
                                    className="lg:hidden"
                                    onClick={() => setFiltersOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <Filter className="hidden lg:block h-5 w-5" />
                            </div>
                        </div>

                        {/* Contenido principal con scroll */}
                        <div className="flex-1 overflow-y-auto px-4 mt-16 pb-20 lg:mt-0 lg:pb-0 lg:px-0">
                            {/* Campo de búsqueda general */}
                            <div className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-1 focus:ring-primary/50 focus:outline-0"
                                        value={selectedFilters.name || ''}
                                        onChange={(e) => handleFilterChange('name', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Sección Características/Especificaciones Dinámicas */}
                            {Object.keys(specifications || {}).length > 0 ? (
                                <div className="mb-6">
                                    <button
                                        onClick={() => toggleSection("especificaciones")}
                                        className="flex items-center justify-between w-full mb-4 p-2 lg:p-0"
                                    >
                                        <span className="font-medium">Características</span>
                                        <ChevronDown
                                            className={`h-5 w-5 transform transition-transform ${sections.especificaciones ? "" : "-rotate-180"
                                                }`}
                                        />
                                    </button>
                                    {sections.especificaciones && (
                                        <div className="space-y-6">
                                            {(() => {
                                                // Agrupar especificaciones por categorías
                                                const specCategories = {
                                                    'Energía y Alimentación': ['Voltaje de batería', 'Capacidad de batería', 'Potencia', 'Frecuencia'],
                                                    'Dimensiones y Peso': ['Peso', 'Dimensiones', 'Longitud', 'Ancho', 'Alto'],
                                                    'Rendimiento': ['Velocidad', 'Torque', 'Presión de aire', 'Volumen de aire', 'Nivel de presión sonora'],
                                                    'Capacidades': ['Capacidad del tanque de polvo', 'Sellado de succión', 'Potencia de succión', 'Capacidad'],
                                                    'Otros': []
                                                };

                                                // Clasificar especificaciones
                                                const categorizedSpecs = {};
                                                Object.keys(specCategories).forEach(category => {
                                                    categorizedSpecs[category] = {};
                                                });

                                                Object.entries(specifications).forEach(([specName, specValues]) => {
                                                    let assigned = false;
                                                    for (const [category, keywords] of Object.entries(specCategories)) {
                                                        if (keywords.some(keyword => specName.toLowerCase().includes(keyword.toLowerCase()))) {
                                                            categorizedSpecs[category][specName] = specValues;
                                                            assigned = true;
                                                            break;
                                                        }
                                                    }
                                                    if (!assigned) {
                                                        categorizedSpecs['Otros'][specName] = specValues;
                                                    }
                                                });

                                                return Object.entries(categorizedSpecs).map(([category, categorySpecs]) => {
                                                    if (Object.keys(categorySpecs).length === 0) return null;

                                                    return (
                                                        <div key={category} className="bg-gray-50 rounded-lg p-4">
                                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                                {category}
                                                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                                                    {Object.keys(categorySpecs).length} filtros
                                                                </span>
                                                            </h3>
                                                            <div className="space-y-4">
                                                                {Object.entries(categorySpecs).map(([specName, specValues]) => {
                                                                    // Filtrar valores de especificación según búsqueda
                                                                    const searchTerm = searchSpecifications[specName] || "";
                                                                    const filteredSpecValues = specValues.filter(value =>
                                                                        value.toLowerCase().includes(searchTerm.toLowerCase())
                                                                    );

                                                                    return (
                                                                        <div key={specName} className="bg-white rounded-md p-3 border border-gray-200">
                                                                            <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                                                                                <Tag className="h-4 w-4" />
                                                                                {specName}
                                                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                                    {specValues.length}
                                                                                </span>
                                                                                {selectedFilters.specifications[specName]?.length > 0 && (
                                                                                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                                                                                        {selectedFilters.specifications[specName].length} seleccionados
                                                                                    </span>
                                                                                )}
                                                                            </h4>

                                                                            {/* Campo de búsqueda si hay más de 5 opciones */}
                                                                            {specValues.length > 5 && (
                                                                                <div className="relative mb-3">
                                                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder={`Buscar en ${specName.toLowerCase()}`}
                                                                                        className="w-full pl-8 pr-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary/50 focus:outline-0"
                                                                                        value={searchSpecifications[specName] || ""}
                                                                                        onChange={(e) => setSearchSpecifications(prev => ({
                                                                                            ...prev,
                                                                                            [specName]: e.target.value
                                                                                        }))}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            <div className="space-y-2 max-h-[120px] overflow-y-auto">
                                                                                {filteredSpecValues.map((value) => {
                                                                                    const isSelected = selectedFilters.specifications[specName]?.includes(value) || false;
                                                                                    return (
                                                                                        <label
                                                                                            key={`${specName}-${value}`}
                                                                                            className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border border-primary/20' : ''
                                                                                                }`}
                                                                                        >
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="h-4 w-4 rounded border-gray-300 accent-primary"
                                                                                                onChange={() => handleFilterChange("specifications", value, specName)}
                                                                                                checked={isSelected}
                                                                                            />
                                                                                            <span className={`text-sm ${isSelected ? 'text-primary font-medium' : 'text-gray-700'}`}>
                                                                                                {value}
                                                                                            </span>
                                                                                        </label>
                                                                                    );
                                                                                })}
                                                                                {filteredSpecValues.length === 0 && searchTerm && (
                                                                                    <p className="text-sm text-gray-500 italic py-2 text-center">
                                                                                        No se encontraron coincidencias
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                }).filter(Boolean)
                                            })}
                                            </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No hay características disponibles para filtrar</p>
                                    <p className="text-sm">Los filtros se generarán cuando se carguen los productos</p>
                                </div>
                            )}
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
                            <div className={`flex ${viewType === 'grid' ? 'items-center flex-wrap' : 'flex-col gap-6'} transition-all duration-300 ease-in-out`}>
                                {Array.isArray(filteredProducts) &&
                                    filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className={viewType === 'grid'
                                                ? "w-1/2 lg:w-1/3 xl:w-1/3 lg:h-[460px] lg:max-h-[460px] xl:h-[400px] xl:max-h-[400px] 2xl:h-[430px] 2xl:max-h-[430px] flex items-center justify-center"
                                                : "w-full mb-2 flex items-center justify-center shadow-sm hover:shadow-lg transition-shadow duration-200"
                                            }
                                        >
                                            <CardProductMakita
                                                data={data}
                                                product={product}
                                                viewType={viewType}
                                                widthClass="w-full sm:w-full lg:w-full"
                                                cart={cart}
                                                setCart={setCart}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-12">
                                        <NoResults />
                                        {allProducts.length > 0 && (
                                            <p className="text-gray-500 mt-4">
                                                Intenta ajustar los filtros para ver más productos
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FilterMakita;

