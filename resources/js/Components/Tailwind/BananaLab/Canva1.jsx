

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import CardBanana from "./components/CardBanana"


// Datos de ejemplo para los productos
const productos = [
  {
    id: 1,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 2,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 3,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 4,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 5,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 6,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 7,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 8,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 9,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
  {
    id: 10,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Morbi volutput nunc non auctor sodales. Morbi vitae malesuada...",
  },
]

export default function Canva1() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleProductClick = (id) => {
    setSelectedProduct(id)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl font-paragraph">
      {/* Encabezado móvil con botón de regresar - visible solo en móvil */}
      <button className="flex items-center customtext-secondary mb-4 ">
        <ChevronLeft className="h-5 w-5" />
        <span className="ml-1">Regresar</span>
      </button>

      {/* Título */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Elige el diseño predefinido</h1>

      {/* Grid de productos - responsive con Tailwind */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {productos.map((producto) => (
          <CardBanana key={producto.id} producto={producto} onClick={handleProductClick} />
        ))}
      </div>
    </div>
  )
}
