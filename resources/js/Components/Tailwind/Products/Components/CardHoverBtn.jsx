import React, { useState } from "react";
import { LucideEye, ShoppingCart } from "lucide-react"; // Icono para la cesta
import Swal from "sweetalert2";
import axios from "axios";
import ItemsRest from "../../../../Actions/ItemsRest";
import CartModal from "../../Components/CartModal";
import { Local } from "sode-extend-react";
import Global from "../../../../Utils/Global";

const itemsRest = new ItemsRest();
const CardHoverBtn = ({
    data,
    product,
    widthClass = "lg:w-1/5",
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
        /* Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${product.name} al carrito`,
            icon: "success",
            timer: 1500,
        });*/
        setModalOpen(!modalOpen);
        setTimeout(() => setModalOpen(false), 3000);
    };

    const inCart = cart?.find((x) => x.id == product?.id);
    const finalPrice =
        product?.discount > 0 ? product?.discount : product?.price;

    return (
        <>
            <div
                key={product.id}
                className={`group px-1 md:px-2 w-full flex-shrink-0 font-font-secondary cursor-pointer relative`}
            >
                <div
                    className="bg-white rounded-xl shadow-md p-2 md:p-4 "
                    style={{ boxShadow: "0px 0px 6px 0px #00000040" }}
                >
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative ">
                        {product.discount != null &&
                            !isNaN(product.discount) && (
                                <span className="absolute top-2 right-2 bg-[#F93232] text-white text-base font-medium px-2 py-1 rounded-full">
                                    -
                                    {Number(
                                        100 -
                                            Number(
                                                (product?.discount * 100) /
                                                    product?.price
                                            )
                                    ).toFixed(0)}
                                    %
                                </span>
                            )}
                        <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center p-0">
                            <img
                                src={`/storage/images/item/${product.image}`}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                                alt={product.name}
                                className="w-full h-full object-cover bg-slate-100"
                                loading="lazy"
                            />
                        </div>
                        {/* <div className="hidden    pb-4 lg:opacity-0 absolute -bottom-5 w-full  group-hover:opacity-100   group-hover:flex gap-2 my-2 transition-all  duration-500 ">
                            <a
                                href={`/product/${product.slug}`}
                                className="flex-1 inline-flex items-center justify-center font-bold  text-sm bg-primary text-white  rounded-lg shadow-lg transition-all duration-300 hover:opacity-90 "
                            >
                                Ver detalle
                            </a>
                            <button
                                className="py-2 bg-white px-2.5 border border-primary rounded-lg customtext-primary transition-all duration-300  hover:opacity-90"
                                disabled={inCart}
                                onClick={() => {
                                    onAddClicked(product);
                                    setModalOpen(!modalOpen);
                                }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                        */}
                    </div>

                    {/* Botones de acción (ocultos por defecto, aparecen con hover) */}
                    <div className="overflow-hidden max-h-20  lg:max-h-0 pb-4 lg:opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-[max-height,opacity] duration-1000 ease-in-out flex gap-2 my-2 transform ">
                        <a
                            href={`/product/${product.slug}`}
                            className="flex-1 inline-flex items-center justify-center font-bold  text-sm bg-primary text-white py-2 md:py-3 rounded-xl shadow-lg transition-all duration-300 hover:opacity-90"
                        >
                            <span className="hidden md:block">Ver detalle</span>
                            <span className="md:hidden flex gap-2 text-sm items-center" > Ver <LucideEye width="1.1rem" /></span>
                        </a>
                        <button
                        aria-label="Agregar al carrito"
                            className="py-2 px-2.5 border border-primary rounded-lg customtext-primary transition-all duration-300  hover:opacity-90"
                            onClick={() => onAddClicked(product)}
                        >
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Información del producto */}
                    <div>
                        <p className="text-xs customtext-neutral-light font-semibold mb-1">
                            {product?.brand?.name}
                        </p>
                        <h3 className="customtext-neutral-dark text-lg font-semibold mb-2 line-clamp-3 h-20">
                            {product.name}
                        </h3>
                        {/* Precio */}
                        <div className="flex flex-col items-baseline gap-2 md:mb-4">
                            {product.discount != null &&
                                !isNaN(product.discount) && (
                                    <span className="text-xs customtext-neutral-light font-semibold1 line-through">
                                        S/ {product.price}
                                    </span>
                                )}
                            <span className="customtext-neutral-dark text-[20px] md:text-2xl font-bold">
                                S/ {product.final_price}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
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

export default CardHoverBtn;
