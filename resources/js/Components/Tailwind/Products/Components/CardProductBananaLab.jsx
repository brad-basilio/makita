import React, { useState } from "react";
import { CheckCircleIcon, Heart, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import ItemsRest from "../../../../Actions/ItemsRest";
import CartModal from "../../Components/CartModal";
import { toast, Toaster } from "sonner";


const CardProductBananaLab = ({
    data,
    product,
    widthClass = "lg:w-1/4",
    setCart,
    cart,
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const onAddClicked = (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);

        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }

        setCart(newCart);

        toast.success('Producto agregado', {
            description: `${product.name} se ha añadido al carrito.`,
            icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: 'bottom-center',
          });

        //setModalOpen(true);
    };

    return (
        <>   
        
            <a
                href={`/product/${product.slug}`}
                key={product.id}
                className={`group px-1 md:px-2 w-1/2 sm:w-1/3 ${widthClass} flex-shrink-0 font-font-secondary cursor-pointer relative`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={`
    bg-white rounded-md transition-all duration-300 lg:p-4
    transform-gpu origin-top
    ${
        isHovered
            ? "lg:shadow-xl  lg:rounded-b-2xl"
            : "lg:shadow-sm lg:scale-y-100"
    }
  `}
                >
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative">
                        {product.discount != null &&
                            !isNaN(product.discount) && (
                                <span className="absolute top-3 -right-1 lg:-right-2 bg-[#F93232] text-white text-xs font-bold px-2 py-2 shadow-md z-10">
                                    Oferta
                                </span>
                            )}
                        <div className="aspect-square rounded-t-md overflow-hidden flex items-center justify-center">
                            <img
                                src={`/storage/images/item/${product.image}`}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="p-3">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#CD6E56] rounded-full lg:w-3 lg:h-3"></div>
                            <div className="w-2 h-2 bg-[#E5C794] rounded-full lg:w-3 lg:h-3"></div>
                            <div className="w-2 h-2 bg-[#E37B58] rounded-full lg:w-3 lg:h-3"></div>
                        </div>

                        <div className="flex justify-between items-start w-full mt-2">
                            <h3 className="w-11/12 lg:w-10/12 customtext-neutral-dark text-xs lg:text-[15px] leading-4 font-semibold mb-2 line-clamp-3">
                                {product.name}
                            </h3>
                            <button className="customtext-primary brightness-125 lg:hover:brightness-100 lg:hover:customtext-primary transition-colors duration-200">
                                <Heart width={18} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Precio */}
                        <div className="flex flex-col lg:flex-row lg:justify-between items-baseline mt-1">
                            <span className="customtext-neutral-dark text-[20px] md:text-2xl font-bold">
                                S/ {product.final_price}
                            </span>
                            <p className="text-[10px] lg:text-xs customtext-neutral-dark mt-1">
                                Más vendidos (100)
                            </p>
                        </div>

                        {/* Botón de acción - solo visible en hover con animación mejorada */}
                        <div
                            className={`mt-3 transition-[max-height,opacity] duration-500   `}
                        >
                            <button
                                onClick={(e) => onAddClicked(e, product)}
                                className={`w-full text-[10px] font-light lg:font-normal flex items-center justify-center bg-primary text-white lg:text-sm py-2 lg:py-3 px-4 rounded-full shadow-md lg:hover:shadow-lg transform lg:hover:scale-[1.02] transition-all duration-300 ${
                                    isHovered ? "lg:flex" : "lg:hidden "
                                } `}
                            >
                                <span className="mr-2">Agregar al carrito</span>
                                <ShoppingCart
                                    className="w-3 h-3 lg:w-4 lg:h-4"
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </a>

            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default CardProductBananaLab;
