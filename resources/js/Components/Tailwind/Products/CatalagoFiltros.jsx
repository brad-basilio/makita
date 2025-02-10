import React, { useState } from 'react';
import CardHoverBtn from './Components/CardHoverBtn';
import { ChevronDown, Filter, Search, Tag } from 'lucide-react';

const CatalagoFiltros = ({ items, data }) => {
    const [sections, setSections] = useState({
        marca: true,
        precio: true,
        categoria: true,
        colores: true,
    })

    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }
    return (
        <section className="py-12 bg-[#F7F9FB]">
            <div className=" mx-auto px-primary">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2 customborder-neutral-light">
                    <h2 className="text-4xl font-bold  font-font-secondary ">{data?.title}</h2>
                    <a

                        href="#"
                        className="bg-primary text-white border-2 border-none flex flex-row items-center gap-3 px-3 md:px-6 py-3 text-base rounded-lg tracking-wide font-bold"
                    >
                        Ver todos
                        <Tag width={"1rem"} className="rotate-90" />
                    </a>
                </div>

                {/* Catalolgo Products */}
                <div className="relative flex gap-4">
                    <div className='w-3/12'>
                        <div className="w-full max-w-xs bg-white p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Filtros</h2>
                                <Filter className="h-5 w-5" />
                            </div>

                            {/* Marca Section */}
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
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            {["Apple", "Samsung", "Xiaomi", "Poco", "OPPO", "Honor", "Motorola"].map((brand) => (
                                                <label key={brand} className="flex items-center space-x-3">
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                                    <span>{brand}</span>
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
                                        {[
                                            "S/ 100 - S/ 250",
                                            "S/ 250 - S/ 500",
                                            "S/ 500 - S/ 1.000",
                                            "S/ 1.000 - S/ 2.000",
                                            "S/ 2.000 - S/ 5.000",
                                            "Desde S/ 5.000",
                                        ].map((range) => (
                                            <label key={range} className="flex items-center space-x-3">
                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                                <span>{range}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Categoría Section */}
                            <div className="mb-6">
                                <button onClick={() => toggleSection("categoria")} className="flex items-center justify-between w-full mb-4">
                                    <span className="font-medium">Categoría</span>
                                    <ChevronDown
                                        className={`h-5 w-5 transform transition-transform ${sections.categoria ? "" : "-rotate-180"}`}
                                    />
                                </button>
                                {sections.categoria && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar"
                                                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            {Array.from({ length: 10 }, (_, i) => (
                                                <label key={i} className="flex items-center space-x-3">
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                                    <span>{i === 0 ? "Tipo Categoría" : `Sub-Categoría ${i}`}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Colores Section */}
                            <div className="mb-6">
                                <button onClick={() => toggleSection("colores")} className="flex items-center justify-between w-full mb-4">
                                    <span className="font-medium">Colores</span>
                                    <ChevronDown className={`h-5 w-5 transform transition-transform ${sections.colores ? "" : "-rotate-180"}`} />
                                </button>
                                {sections.colores && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar"
                                                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            {["Blanco", "Negro", "Rosado", "Azul", "Gris"].map((color) => (
                                                <label key={color} className="flex items-center space-x-3">
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                                    <span>{color}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                                Aplicar Filtro
                            </button>
                        </div>
                    </div>



                    <div className="w-9/12 py-4">
                        <div
                            className="flex items-center flex-wrap gap-y-8  transition-all duration-300   ease-in-out "

                        >
                            {items.map((product) => (
                                <CardHoverBtn product={product} widthClass='lg:w-1/4' />
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default CatalagoFiltros;