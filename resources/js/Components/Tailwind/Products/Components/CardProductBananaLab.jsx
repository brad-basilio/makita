import React, { useState } from "react";
import { ShoppingCart } from "lucide-react"; // Icono para la cesta
import Swal from "sweetalert2";
import axios from "axios";
import ItemsRest from "../../../../Actions/ItemsRest";
import CartModal from "../../Components/CartModal";
import { Local } from "sode-extend-react";
import Global from "../../../../Utils/Global";

const itemsRest = new ItemsRest();
const CardProductBananaLab = ({
    data,
    product,
    widthClass = "lg:w-1/4",
    setCart,
    cart,
}) => {
    const [message, setMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${product.name} al carrito`,
            icon: "success",
            timer: 1500,
        });
        setModalOpen(!modalOpen);
    };

    const inCart = cart?.find((x) => x.id == product?.id);
    const finalPrice =
        product?.discount > 0 ? product?.discount : product?.price;

    return (
        <>
            <a
                href={`/product/${product.slug}`}
                key={product.id}
                className={`group px-1 md:px-2 w-1/2 sm:w-1/3  ${widthClass} flex-shrink-0 font-font-secondary cursor-pointer relative`}
            >
                <div className="bg-white rounded-md   ">
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative ">
                        {product.discount != null &&
                            !isNaN(product.discount) && (
                                <span className="absolute top-4 -right-1 bg-[#F93232] text-white text-xs font-medium px-2 py-2 ">
                                    Oferta
                                </span>
                            )}
                        <div className="aspect-square rounded-t-md overflow-hidden flex items-center justify-center ">
                            <img
                                src={`/storage/images/item/${product.image}`}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                                alt={product.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="py-2">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#CD6E56] rounded-full"></div>
                            <div className="w-2 h-2 bg-[#E5C794] rounded-full"></div>
                            <div className="w-2 h-2 bg-[#E37B58] rounded-full"></div>
                        </div>

                        <h3 className="customtext-neutral-dark text-[15px] leading-4 font-semibold mb-2 line-clamp-3  mt-2">
                            {product.name}
                        </h3>
                        {/* Precio */}
                        <div className="flex flex-col items-baseline mt-0 ">
                            <span className="customtext-neutral-dark text-[20px] md:text-2xl font-bold">
                                S/ {product.final_price}
                            </span>
                            <p className="text-[10px]">Más vendidos (100)</p>
                        </div>

                        {/* Botones de acción (ocultos por defecto, aparecen con hover) */}
                        <div className="overflow-hidden max-h-20  lg:max-h-20 pb-4 lg:opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-[max-height,opacity] duration-1000 ease-in-out flex gap-2  transform group-hover:translate-y-0 translate-y-4">
                            <a
                                href={`/product/${product.slug}`}
                                className="flex-1 inline-flex items-center justify-center lg:my-2  text-[8px] lg:text-sm bg-primary text-white  py-1 lg:py-2 rounded-full  shadow-lg transition-all duration-300 hover:opacity-90"
                            >
                                Agregar a carrito
                                <ShoppingCart className="w-4 h-4 ml-2" />
                            </a>
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
