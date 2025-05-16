import { useEffect, useState } from "react";
import {
    ShoppingCart,
    Store, 
    Home,
    Phone,
    CircleUserRound,
    ChevronDown,
    CheckSquare,
    Plus,
    ChevronUp,
    CircleCheckIcon,
    Minus
} from "lucide-react";

import ItemsRest from "../../../Actions/ItemsRest";
import { Notify } from "sode-extend-react";
import ProductInfinite from "../Products/ProductInfinite";
import CartModal from "../Components/CartModal";

const ProductDetail = ({ item, data, setCart, cart }) => {
    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    // State management
    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [associatedItems, setAssociatedItems] = useState([]);
    const [relationsItems, setRelationsItems] = useState([]);
    const [expandedSpecificationMain, setExpanded] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    // Quantity handlers
    const incrementQuantity = () => {
        if (quantity < 10) setQuantity(quantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        setQuantity(value);
    };

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: quantity });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 3000);
    };

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
            obtenerCombo(item);
            handleViewUpdate(item);
        }
    }, [item]);

    // API calls
    const handleViewUpdate = async (item) => {
        try {
            const response = await itemsRest.updateViews({ id: item?.id });
            if (!response) return;
        } catch (error) {
            return;
        }
    };

    const obtenerCombo = async (item) => {
        try {
            const response = await itemsRest.verifyCombo({ id: item?.id });
            if (!response) return;
            const associated = response[0].associated_items;
            setAssociatedItems(Object.values(associated));
        } catch (error) {
            return;
        }
    };

    const productosRelacionados = async (item) => {
        try {
            const response = await itemsRest.productsRelations({ id: item?.id });
            if (!response) return;
            setRelationsItems(Object.values(response));
        } catch (error) {
            return;
        }
    };

    const total = associatedItems.reduce(
        (sum, product) => sum + parseFloat(product.final_price),
        0
    );

    const addAssociatedItems = () => {
        setCart((prevCart) => {
            const newCart = structuredClone(prevCart);
            [...associatedItems, item].forEach((product) => {
                const index = newCart.findIndex((x) => x.id === product.id);
                if (index === -1) {
                    newCart.push({ ...product, quantity: quantity });
                } else {
                    newCart[index].quantity++;
                }
            });
            return newCart;
        });
        toast.success("Carrito de Compras", {
            description: `Se agregaron con éxito los productos`,
            icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: "bottom-center",
        });
      
    };

    return (
        <>
            <div className="px-4 md:px-primary mx-auto py-6 md:py-12 bg-[#F7F9FB]">
                <div className="bg-white rounded-xl p-4 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mobile Header */}
                        <div className="md:hidden space-y-4">
                            <p className="text-sm text-gray-500">
                                Marca: <span className="text-gray-900">{item?.brand.name}</span>
                            </p>
                            <h1 className="text-2xl font-bold text-gray-900">{item?.name}</h1>
                        </div>

                        {/* Image Gallery */}
                        <div className="space-y-6">
                            <div className="relative">
                                {/* Main Image */}
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={`/storage/images/item/${selectedImage.url}`}
                                        alt={item?.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                                    />
                                </div>

                                {/* Thumbnails - Horizontal Scroll on Mobile */}
                                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                    <button
                                        onClick={() => setSelectedImage({url: item?.image, type: "main"})}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 p-1
                                            ${selectedImage.url === item?.image ? "border-primary" : "border-gray-200"}`}
                                    >
                                        <img
                                            src={`/storage/images/item/${item?.image}`}
                                            alt="Main"
                                            className="w-full h-full object-contain"
                                            onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                                        />
                                    </button>
                                    {item?.images.filter((image, index, self) => 
                                        index === self.findIndex((img) => img.url === image.url)
                                    ).map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage({url: image.url, type: "gallery"})}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 p-1
                                                ${selectedImage.url === image.url ? "border-primary" : "border-gray-200"}`}
                                        >
                                            <img
                                                src={`/storage/images/item/${image.url}`}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Product Info */}
                            <div className="md:hidden space-y-6">
                                {/* SKU & Stock */}
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>SKU: <span className="text-gray-900">{item?.sku}</span></span>
                                    <span>
                                        Disponibilidad: 
                                        <span className="text-gray-900 ml-1">
                                            {item?.stock > 0 ? "En stock" : "Agotado"}
                                        </span>
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm text-gray-500 line-through">S/ {item?.price}</span>
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                            -{Number(item?.discount_percent).toFixed(1)}%
                                        </span>
                                    </div>
                                    <span className="text-3xl font-bold">S/ {item?.final_price}</span>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">Cantidad</span>
                                    <div className="flex items-center border rounded-lg">
                                        <button 
                                            onClick={decrementQuantity}
                                            className="p-2 hover:bg-gray-100"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={handleChange}
                                            className="w-12 text-center border-x"
                                            min="1"
                                            max="10"
                                        />
                                        <button 
                                            onClick={incrementQuantity}
                                            className="p-2 hover:bg-gray-100"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">Máx. 10</span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => onAddClicked(item)}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90"
                                >
                                    Agregar al carrito
                                </button>

                                {/* Specifications */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium mb-4">Especificaciones principales</h3>
                                    <ul className={`space-y-2 ${!expandedSpecificationMain && "max-h-24 overflow-hidden"}`}>
                                        {item?.specifications
                                            .filter(spec => spec.type === "principal")
                                            .map((spec, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CircleCheckIcon className="text-primary w-5 h-5" />
                                                    <span className="text-sm">{spec.description}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <button
                                        onClick={() => setExpanded(!expandedSpecificationMain)}
                                        className="text-primary text-sm font-medium mt-4 flex items-center gap-1"
                                    >
                                        {expandedSpecificationMain ? "Ver menos" : "Ver más"}
                                        {expandedSpecificationMain ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>

                                {/* Associated Products */}
                                {associatedItems.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="text-primary w-5 h-5" />
                                            <h3 className="font-medium">Productos complementarios</h3>
                                        </div>
                                        
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {associatedItems.map((product, index) => (
                                                <div key={index} className="flex items-center gap-2 flex-shrink-0">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg p-2">
                                                        <img
                                                            src={`/storage/images/item/${product.image}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                                                        />
                                                    </div>
                                                    {index < associatedItems.length - 1 && (
                                                        <Plus className="w-4 h-4" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Associated Products List */}
                                        <div className="space-y-2">
                                            {associatedItems.map((product, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <span className="text-xs text-gray-500">{product.brand.name}</span>
                                                        <p className="text-sm font-medium">{product.name}</p>
                                                    </div>
                                                    <span className="font-bold">S/ {parseFloat(product.final_price).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total and Add Bundle */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-sm text-gray-500">Total</span>
                                                <span className="text-lg font-bold">S/ {total.toFixed(2)}</span>
                                            </div>
                                            <button
                                                onClick={addAssociatedItems}
                                                className="w-full bg-primary text-white py-2 rounded-lg font-medium"
                                            >
                                                Agregar conjunto
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Options */}
                            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                                <div className="text-center">
                                    <div className="bg-gray-50 p-3 rounded-full w-max mx-auto mb-2">
                                        <Home className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">Despacho a domicilio</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-gray-50 p-3 rounded-full w-max mx-auto mb-2">
                                        <Store className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">Retiro en tienda</p>
                                </div>
                            </div>

                            {/* Support */}
                            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium">¿Necesitas ayuda? Llámanos al 012037074</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CircleUserRound className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium">Soporte técnico</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Product Info - Keep existing desktop version */}
                        <div className="hidden md:block">
                            {/* Your existing desktop layout code here */}
                        </div>
                    </div>
                </div>

                {/* Keep existing sections */}
                <div className="grid gap-20 md:grid-cols-2 bg-white rounded-xl p-8 mt-12">
                    {/* Your existing specifications and additional info sections */}
                </div>
            </div>

            {/* Related Products and Cart Modal */}
            {relationsItems.length > 0 && (
                <ProductInfinite
                    data={{ title: "Productos relacionados" }}
                    items={relationsItems}
                    cart={cart}
                    setCart={setCart}
                />
            )}
            
            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
}

export default ProductDetail;