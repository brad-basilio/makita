

import { useEffect, useState } from "react"
import { ShoppingCart, Store, Home, Phone, CircleUserRound, ChevronDown, CheckSquare, Plus, ChevronUp } from "lucide-react"

import ItemsRest from "../../../Actions/ItemsRest";

export default function ProductDetail({ item, data, setCart, cart }) {
    const itemsRest = new ItemsRest()
    const [quantity, setQuantity] = useState("01")


    const [selectedImage, setSelectedImage] = useState({ url: item.image, type: "main" });

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


    const features = [
        "Sonido de graves profundos JBL",
        "Aproveche al máximo sus mezclas con audio de alta calidad de auriculares seguros y confiables con controladores de 8 mm con sonido de graves profundos JBL.",
        "Ajuste cómodo",
        "El diseño ergonómico de botones de JBL Vibe Beam se ajusta tan cómodamente que puede olvidar que los lleva puestos. El diseño del botón sella suavemente tus oídos bloqueando los ruidos externos y mejorando el rendimiento de los graves.",
        "Hasta 32 (8h + 24h) horas totales de duración de la batería con carga rápida",
        "Con 8 horas de duración de la batería en los auriculares y 24 en el estuche, los JBL Vibe Beam brindan audio durante todo el día. Y cuando necesite más energía, puede acelerar la carga dos horas más en solo 10 minutos.",
    ]

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart)
        const index = newCart.findIndex(x => x.id == product.id)
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 })
        } else {
            newCart[index].quantity++
        }
        setCart(newCart)

        Swal.fire({
            title: 'Producto agregado',
            text: `Se agregó ${product.name} al carrito`,
            icon: 'success',
            timer: 1500,
        })
    }

    const [associatedItems, setAssociatedItems] = useState([])
    const inCart = cart?.find(x => x.id == item?.id)

    useEffect(() => {
        if (item?.id) {
            obtenerCombo(item);
        }
    }, [item]); // Agregar `item` como dependencia

    const obtenerCombo = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                id: item.id,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.verifyCombo(request);

            // Verificar si la respuesta es válida
            if (!response) {
                console.error('No se encontraron productos asociados.');
                return;
            }
            //  console.log('Productos asociados:', response);
            // Actualizar el estado con los productos asociados
            const associated = response[0].associated_items;
            console.log('Productos asociados:', associated);
            setAssociatedItems(Object.values(associated));
        } catch (error) {
            console.error('Error al obtener el combo:', error.message);
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };

    const total = associatedItems.reduce((sum, product) => sum + parseFloat(product.final_price), 0);
    const [expandedSpecificationMain, setExpanded] = useState(false);
    return (
        <div className="px-primary mx-auto py-12 bg-[#F7F9FB] ">
            <div className="bg-white rounded-xl p-4">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Images and Delivery Options */}
                    <div className="space-y-6">
                        {/* Product Images */}
                        <div className="flex gap-6">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setSelectedImage({ url: item.image, type: "main" })}
                                    className={`w-16 h-16 border rounded-lg p-2 ${selectedImage.url === item.image ? "border-blue-400" : "border-gray-200"}`}
                                >
                                    <img
                                        src={`/api/items/media/${item.image}`}
                                        alt="Main Thumbnail"
                                        className="w-full h-full object-contain"
                                    />
                                </button>
                                {item.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage({ url: image.url, type: "gallery" })}
                                        className={`w-16 h-16 border rounded-lg p-2 ${selectedImage.url === image.url ? "border-blue-400" : "border-gray-200"}`}
                                    >
                                        <img
                                            src={`/api/item_images/media/${image.url}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1">
                                <img
                                    src={selectedImage.type === "main" ? `/api/items/media/${selectedImage.url}` : `/api/item_images/media/${selectedImage.url}`}
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
                                <Phone className="w-5 h-5 customtext-primary" />
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
                            <p className="text-gray-600">Marca: {item.brand.name}</p>
                            <h1 className="text-[32px] font-medium mt-2">{item.name}</h1>
                        </div>

                        {/* SKU and Availability */}
                        <div className="flex items-center gap-8 text-sm mb-6">
                            <span className="text-gray-500">SKU: {item.sku}</span>
                            <span className="text-gray-500">
                                Disponibilidad: <span className="text-gray-900">
                                    {item.stock > 0 ? "En stock" : "Agotado"}
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-8 border-b-2 pb-8">

                            {/* Specifications */}
                            <div className="flex-1 w-6/12 mt-6">
                                <div className="bg-[#F7F9FB] rounded-lg p-6">
                                    <h3 className="font-medium mb-4">Especificaciones principales</h3>
                                    <ul className={`space-y-2 ml-4 customtext-neutral-light mb-4 transition-all duration-300 ${expandedSpecificationMain ? "max-h-full" : "max-h-24 overflow-hidden"}`}>
                                        {item.specifications.map((spec, index) =>
                                            spec.type === "principal" && <li key={index}>{spec.description}</li>
                                        )}
                                    </ul>
                                    <button
                                        className="customtext-primary text-sm font-semibold hover:underline flex items-center gap-1 transition-all duration-300"
                                        onClick={() => setExpanded(!expandedSpecificationMain)}
                                    >
                                        {expandedSpecificationMain ? "Ver menos" : "Ver más especificaciones"}
                                        {expandedSpecificationMain ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className=" w-6/12 ">
                                <p className="text-sm text-gray-500 mb-1">
                                    Precio: <span className="line-through">S/ {item.price}</span>
                                </p>
                                <div className="flex items-center gap-4 ">
                                    <span className="text-[40px] font-medium">S/ {item.final_price}</span>
                                    <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full">-{Number(item.discount_percent).toFixed(1)}%</span>
                                </div>

                                {/* Quantity */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-sm">Cantidad</span>
                                        <div className="inline-flex border rounded">

                                            <input type="number" className="w-12 text-center" min="1" max="10" defaultValue="1" />

                                        </div>
                                        <p className="text-sm text-gray-500">Máximo 10 unidades.</p>
                                    </div>

                                </div>

                                {/* Add to Cart */}
                                <button onClick={() => onAddClicked(item)} className="w-full bg-primary text-white py-3 rounded-xl hover:brightness-90 transition-colors mt-4">
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>

                        {/* Complementary Products */}
                        <div className="mt-8 ">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingCart className="w-6 h-6 customtext-primary" />
                                <h2 className="text-base font-semibold">Completa tu compra con estos productos</h2>
                            </div>

                            <div className=" flex gap-4">
                                <div className="w-2/3 flex gap-2">
                                    {associatedItems.map((product, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <img src={`/api/items/media/${product.image}`} className=" rounded-lg aspect-square w-24 h-24 object-cover bg-[#F7F9FB]" />
                                            {index < associatedItems.length - 1 && <span className="text-2xl font-bold"><Plus /></span>}
                                        </div>
                                    ))}
                                </div>
                                <div className=" w-1/3 flex flex-col justify-between items-end bg-gray-50 p-4 rounded-lg mt-4">
                                    <span className="text-xs font-semibold customtext-neutral-light">Total</span>

                                    <p className="font-bold mb-2 customtext-neutral-dark">S/ {total.toFixed(2)}</p>
                                    <button className="bg-primary text-xs font-semibold text-white w-full py-3 rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-md">
                                        Agregar al carrito
                                    </button>

                                </div>
                            </div>



                            {associatedItems.map((product, index) => (
                                <div key={index} className="flex mt-4 gap-4 p-4 border rounded-lg items-center">

                                    <CheckSquare className="w-5 h-5 customtext-primary" />
                                    <div className="flex-1 font-semibold">
                                        <span className="text-[10px] customtext-neutral-dark block">{product.brand.name}</span>
                                        <p className="text-sm customtext-neutral-light font-medium">{product.name}</p>
                                    </div>
                                    <p className="font-bold customtext-neutral-dark">S/ {parseFloat(product.final_price).toFixed(2)}</p>



                                </div>
                            ))}

                        </div>
                    </div>
                </div>


            </div>
            <div className=" grid gap-8 md:grid-cols-2 bg-white rounded-xl p-4 mt-12">
                {/* Specifications Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 border-b-4 pb-4">Especificaciones</h2>
                    <div className="space-y-1">
                        {item.specifications.map((spec, index) =>
                            spec.type === "general" && (
                                <div key={index} className={`grid grid-cols-2 gap-4 p-4 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                    <div className="text-gray-600">{spec.title}</div>
                                    <div>{spec.description}</div>
                                </div>
                            )
                        )}

                    </div>
                </div>

                {/* Additional Information Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 border-b-4 pb-4">Información adicional</h2>
                    <div className={`space-y-6 ${!isExpanded ? "max-h-[400px] overflow-hidden" : ''}`}>
                        <h3 className="text-xl font-medium">Acerca de este artículo</h3>
                        <div dangerouslySetInnerHTML={{ __html: item.description }} >

                        </div>
                        <div className={`space-y-4 `}>
                            <ul className="list-disc pl-5 space-y-4">
                                {features.map((feature, index) => (
                                    <li key={index} className="text-gray-600">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                    <botton variant="ghost" className="border-2 border-primary w-max px-4 py-2  my-4  rounded-xl flex items-center gap-2 customtext-primary font-semibold cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                        Ver más
                        <ChevronDown className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </botton>
                </div>
            </div>
        </div>
    )
}

