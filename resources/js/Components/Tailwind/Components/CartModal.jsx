import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import CartItemRow from "./CartItemRow";
import Number2Currency from "../../../Utils/Number2Currency";
import Global from "../../../Utils/Global";
import { Local } from "sode-extend-react";

ReactModal.setAppElement("#app");

const CartModal = ({ data, cart, setCart, modalOpen, setModalOpen }) => {
    useEffect(() => {
        if (modalOpen) {
            document.body.classList.add("overflow-hidden");
            document.documentElement.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
            document.documentElement.classList.remove("overflow-hidden");
        }
    }, [modalOpen]);

    const totalPrice = cart.reduce((acc, item) => {
        const finalPrice = item.final_price;
        return acc + finalPrice * item.quantity;
    }, 0);

    const isEmpty = cart.length === 0;

    return (
        <ReactModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Términos y condiciones"
            className="absolute Z-[99999] right-0 bg-white p-4 rounded-l-2xl shadow-lg w-[95%] max-w-md mx-auto         lg:mx-0 outline-none h-[100dvh] max-h-[100dvh] lg:h-screen flex flex-col"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[200]"
        >
            <div className="flex flex-col font-font-general flex-1">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Carrito</h2>
                    <button onClick={() => setModalOpen(false)}>
                        <i className="mdi mdi-close text-xl"></i>
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 mb-4 scroll__carrito">
                    {isEmpty ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <i className="mdi mdi-cart-outline text-6xl mb-2"></i>
                            <p>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <table className="w-full font-font-general">
                            <tbody id="itemsCarrito">
                                {cart.map((item, index) => (
                                    <CartItemRow
                                        key={index}
                                        {...item}
                                        setCart={setCart}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <div className="font-font-general flex flex-col gap-2 pt-2 sticky bottom-0 bg-white">
                <div className="text-[#141718] font-semibold text-xl flex justify-between items-center">
                    <b>Total</b>
                    <b id="itemsTotal">S/. {Number2Currency(totalPrice)}</b>
                </div>
                <div>
                    <button
                        onClick={() => window.location.href = data?.link_cart}
                        disabled={isEmpty}
                        className={`font-semibold text-base py-3 px-5 rounded-2xl w-full inline-block text-center transition-all duration-300 ${
                            isEmpty 
                            ? 'bg-gray-300 cursor-not-allowed opacity-50' 
                            : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                        }`}
                    >
                        Ir al Carrito
                    </button>
                </div>
            </div>
        </ReactModal>
    );
};

export default CartModal;
