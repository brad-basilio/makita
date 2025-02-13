

import { useState } from "react"
import { ShoppingCart, Store, Home, Phone, CircleUserRound, ChevronDown } from "lucide-react"

export default function ProductDetail({ item, data, params }) {
    console.log(params)
    const [quantity, setQuantity] = useState("01")
    const [selectedImage, setSelectedImage] = useState(0)

    const handleQuantityChange = (value) => {
        const current = Number.parseInt(quantity)
        const newValue = current + value
        if (newValue >= 1 && newValue <= 10) {
            setQuantity(newValue.toString().padStart(2, "0"))
        }
    }
    //NO OBTIENE DATOS SOLO PARAMETRO ENVIADO

    /*ESPECIFICACIONES */
    const [isExpanded, setIsExpanded] = useState(false)

    const specifications = [
        { label: "Año de lanzamiento", value: "2024" },
        { label: "Detalle de la garantía", value: "3 mes por desperfecto de fábrica" },
        {
            label: "Resistente al agua",
            value:
                "IPX2 (Protegido contra el agua vertida: goteo, cuando está inclinado hasta 15 grados con respecto a su posición normal)",
        },
        { label: "10", value: "Nuevo" },
        { label: "Dimensiones", value: "15 X 10 X 10" },
        { label: "Detalle de la Condición", value: "Nuevo en caja original" },
    ]

    const features = [
        "Sonido de graves profundos JBL",
        "Aproveche al máximo sus mezclas con audio de alta calidad de auriculares seguros y confiables con controladores de 8 mm con sonido de graves profundos JBL.",
        "Ajuste cómodo",
        "El diseño ergonómico de botones de JBL Vibe Beam se ajusta tan cómodamente que puede olvidar que los lleva puestos. El diseño del botón sella suavemente tus oídos bloqueando los ruidos externos y mejorando el rendimiento de los graves.",
        "Hasta 32 (8h + 24h) horas totales de duración de la batería con carga rápida",
        "Con 8 horas de duración de la batería en los auriculares y 24 en el estuche, los JBL Vibe Beam brindan audio durante todo el día. Y cuando necesite más energía, puede acelerar la carga dos horas más en solo 10 minutos.",
    ]

    return (
        <div className="px-primary mx-auto py-12">
            <div>


                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Images and Delivery Options */}
                    <div className="space-y-6">
                        {/* Product Images */}
                        <div className="flex gap-6">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-4">
                                {[...Array(5)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-16 h-16 border rounded-lg p-2 ${selectedImage === index ? "border-blue-400" : "border-gray-200"
                                            }`}
                                    >
                                        <img
                                            src={`/api/items/media/${item.image}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1">
                                <img
                                    src={`/api/items/media/${params.image}`}
                                    alt="Product main"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        {/* Delivery Options */}
                        <div className="border rounded-lg">
                            <div className="grid grid-cols-2">
                                <div className="p-4 text-center border-r">
                                    <Home className="w-6 h-6 mx-auto mb-1" />
                                    <p className="font-medium">Despacho</p>
                                    <p className="text-sm text-gray-500">a domicilio</p>
                                </div>
                                <div className="p-4 text-center">
                                    <Store className="w-6 h-6 mx-auto mb-1" />
                                    <p className="font-medium">Retira</p>
                                    <p className="text-sm text-gray-500">en tienda</p>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="mt-8 bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <span>¿Necesitas ayuda? Llámanos al 012037074</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CircleUserRound className="w-5 h-5" />
                                <span>Soporte técnico</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div>
                        {/* Brand and Title */}
                        <div className="mb-6">
                            <p className="text-gray-600">Marca: Samsung</p>
                            <h1 className="text-[32px] font-medium mt-2">{item.name}</h1>
                        </div>

                        {/* SKU and Availability */}
                        <div className="flex items-center gap-8 text-sm mb-6">
                            <span className="text-gray-500">SKU: 1826318d860u3e</span>
                            <span className="text-gray-500">
                                Disponibilidad: <span className="text-gray-900">En stock</span>
                            </span>
                        </div>
                        <div className="flex gap-8">

                            {/* Specifications */}
                            <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-medium mb-4">Especificaciones principales</h3>
                                    <ul className="space-y-2 ml-4 list-disc text-gray-600 mb-4">
                                        <li>Quisque in luctus mi.</li>
                                        <li>Maecenas varius rhoncus augue.</li>
                                        <li>Vivamus congue commodo massa.</li>
                                    </ul>
                                    <button className="text-blue-500 text-sm hover:underline">Ver más especificaciones</button>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="w-48">
                                <p className="text-sm text-gray-500 mb-1">
                                    Precio: <span className="line-through">S/ 2.689</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-medium">S/ 1.345</span>
                                    <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded">-20%</span>
                                </div>

                                {/* Quantity */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-sm">Cantidad</span>
                                        <div className="inline-flex border rounded">
                                            <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 border-r">
                                                -
                                            </button>
                                            <input type="text" value={quantity} readOnly className="w-12 text-center" />
                                            <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 border-l">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Máximo 10 unidades.</p>
                                </div>

                                {/* Add to Cart */}
                                <button className="w-full bg-[#19A7CE] text-white py-3 rounded-lg hover:bg-[#19A7CE]/90 transition-colors mt-4">
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>

                        {/* Complementary Products */}
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingCart className="w-6 h-6 text-blue-500" />
                                <h2 className="text-lg">Completa tu compra con estos productos</h2>
                            </div>

                            <div className="space-y-4 flex gap-4">
                                {[
                                    {
                                        name: "Este Producto: Audífonos Bluetooth JBL Vibe BEAM...",
                                        price: "179,00",
                                    },
                                    {
                                        name: "Audífonos Bluetooth JBL T280TWS X2 Rosa y Estuche",
                                        price: "157,00",
                                    },
                                    {
                                        name: "Mini Dron Profesional Portátil E88 Camara HD",
                                        price: "108,00",
                                    },
                                ].map((product, index) => (
                                    <div key={index} className="flex gap-4  border rounded-lg items-start">
                                        <div className="w-24 h-full bg-gray-100 rounded-lg flex-shrink-0" />
                                    </div>
                                ))}
                                <div className="flex flex-col justify-between items-end bg-gray-50 p-4 rounded-lg mt-4">
                                    <span>Total</span>

                                    <p className="font-bold mb-2">S/ 444,00</p>
                                    <button className="bg-[#19A7CE] text-white px-6 py-2 rounded-lg hover:bg-[#19A7CE]/90 transition-colors">
                                        Agregar al carrito
                                    </button>

                                </div>
                            </div>



                            {[
                                {
                                    name: "Este Producto: Audífonos Bluetooth JBL Vibe BEAM...",
                                    price: "179,00",
                                },
                                {
                                    name: "Audífonos Bluetooth JBL T280TWS X2 Rosa y Estuche",
                                    price: "157,00",
                                },
                                {
                                    name: "Mini Dron Profesional Portátil E88 Camara HD",
                                    price: "108,00",
                                },
                            ].map((product, index) => (
                                <div key={index} className="flex mt-4 gap-4 p-4 border rounded-lg items-start">

                                    <div className="flex-1 min-w-0">
                                        <div className="flex gap-2">
                                            <input
                                                type="checkbox"
                                                checked={index === 0}
                                                readOnly
                                                className="mt-1 rounded border-gray-300"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">{product.name}</p>
                                                <p className="font-medium">S/ {product.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>


            </div>
            <div className=" grid gap-8 md:grid-cols-2">
                {/* Specifications Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Especificaciones</h2>
                    <div className="space-y-1">
                        {specifications.map((spec, index) => (
                            <div key={index} className={`grid grid-cols-2 gap-4 p-4 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                <div className="text-gray-600">{spec.label}</div>
                                <div>{spec.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Information Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Información adicional</h2>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium">Acerca de este artículo</h3>
                        <p className="text-gray-600">
                            Lleva tu sonido a todas partes. Con graves que puedes sentir, hasta 32 horas totales de duración de la
                            batería y un diseño seguro y cómodo, el JBL Vibe Beam o Wave Beam resistente a las salpicaduras y al polvo
                            está diseñado para tu entretenimiento diario. Ya sea que esté deambulando por las calles de la ciudad o
                            relajándose en la playa, sus llamadas estéreo con manos libres siempre serán nítidas, mientras que la
                            tecnología Smart Ambient lo mantiene al tanto de su entorno. Y cuando necesite un impulso adicional, puede
                            acelerar la carga de dos horas adicionales de energía en solo 10 minutos.
                        </p>
                        <div className={`space-y-4 ${!isExpanded && "max-h-[400px] overflow-hidden"}`}>
                            <ul className="list-disc pl-5 space-y-4">
                                {features.map((feature, index) => (
                                    <li key={index} className="text-gray-600">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <botton variant="ghost" className="flex items-center gap-2" onClick={() => setIsExpanded(!isExpanded)}>
                            Ver más
                            <ChevronDown className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </botton>
                    </div>
                </div>
            </div>
        </div>
    )
}

