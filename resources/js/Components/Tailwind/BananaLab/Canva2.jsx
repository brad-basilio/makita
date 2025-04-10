

import { useState } from "react"
import { ChevronLeft, ChevronDown } from "lucide-react"

export default function Canva2() {
    const [formData, setFormData] = useState({
        titulo: "Ejm. Momentos que no quiero...",
        paginas: "24 páginas",
        tapa: "Tapa Dura Personalizable",
        acabado: "Limado",
    })

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl font-paragraph">
            {/* Botón Regresar - Solo visible en móvil */}
            <button className="flex items-center customtext-secondary mb-4 ">
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-1">Regresar</span>
            </button>

            {/* Contenedor principal - Cambia a flex en desktop */}
            <div className="md:flex md:gap-8 md:items-start">
                {/* Columna de información y formulario */}
                <div className="md:w-1/2">
                    {/* Título y descripción */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Libro Personalizado <br className="hidden lg:block" /> «Buenos Deseos de Matrimonio»</h1>
                        <p className="text-sm md:text-base text-gray-700">
                            El libro es de 22×22 cm, de tapa dura que tiene un diseño especial de boda personalizable para agregar una
                            foto o imagen, nombres y fecha del evento. En su interior viene con 50 páginas de papel couché de 170 grs.
                            en blanco para que los invitados puedan escribir sus mensajes.
                        </p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-4">
                        {/* Título */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium">Título</label>
                            <input
                                type="text"
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                className="w-full p-3 bg-purple-50 rounded-md text-sm"
                            />
                        </div>

                        {/* Páginas */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium">Páginas</label>
                            <div className="relative">
                                <select
                                    value={formData.paginas}
                                    onChange={(e) => setFormData({ ...formData, paginas: e.target.value })}
                                    className="w-full p-3 bg-purple-50 rounded-md text-sm appearance-none"
                                >
                                    <option value="24 páginas">24 páginas</option>
                                    <option value="50 páginas">50 páginas</option>
                                    <option value="100 páginas">100 páginas</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Tapa */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium">Tapa</label>
                            <div className="relative">
                                <select
                                    value={formData.tapa}
                                    onChange={(e) => setFormData({ ...formData, tapa: e.target.value })}
                                    className="w-full p-3 bg-purple-50 rounded-md text-sm appearance-none"
                                >
                                    <option value="Tapa Dura Personalizable">Tapa Dura Personalizable</option>
                                    <option value="Tapa Blanda">Tapa Blanda</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Acabado de la base */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium">Acabado de la base</label>
                            <div className="relative">
                                <select
                                    value={formData.acabado}
                                    onChange={(e) => setFormData({ ...formData, acabado: e.target.value })}
                                    className="w-full p-3 bg-purple-50 rounded-md text-sm appearance-none"
                                >
                                    <option value="Limado">Limado</option>
                                    <option value="Brillante">Brillante</option>
                                    <option value="Mate">Mate</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Botón Crear proyecto */}
                        <a
                            href="/canva3"

                            type="button"
                            className="block text-center w-full py-3 px-4 bg-primary text-white rounded-full font-medium hover:bg-accent transition-colors"
                        >
                            Crear proyecto
                        </a>
                    </form>
                </div>

                {/* Imagen del libro - Oculta en móvil hasta después del botón, visible a la derecha en desktop */}
                <div className="mt-6 md:mt-0 md:w-1/2">
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                        <img
                            src="/assets/img/backgrounds/resources/default-image.png"
                            alt="Vista previa del libro personalizado"
                            className="max-w-full h-auto max-h-[500px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
