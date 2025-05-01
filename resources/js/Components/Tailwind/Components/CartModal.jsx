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
        return acc + finalPrice * item.quantity; // Sumar el precio total por cantidad
    }, 0);

    return (
        <ReactModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Términos y condiciones"
            className="absolute right-0 bg-white p-4 rounded-l-2xl shadow-lg w-[95%] max-w-md outline-none h-screen"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[200]"
        >
            <div className="flex flex-col font-font-general">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Carrito</h2>
                    <button onClick={() => setModalOpen(false)}>
                        <i className="mdi mdi-close text-xl"></i>
                    </button>
                </div>
                <div className="overflow-y-scroll h-[calc(100vh-160px)] scroll__carrito">
                    <table className="w-full font-font-general">
                        <tbody id="itemsCarrito">
                            {cart.map((item, index) => {
                                return (
                                    <CartItemRow
                                        key={index}
                                        {...item}
                                        setCart={setCart}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="font-font-general flex flex-col gap-2 pt-2">
                <div className="text-[#141718] font-semibold text-xl flex justify-between items-center">
                    <b>Total</b>
                    <b id="itemsTotal">S/. {Number2Currency(totalPrice)}</b>
                </div>
                <div>
                    <button
                        href={data?.link_cart}
                        className="font-semibold text-base bg-primary py-3 px-5 rounded-2xl text-white cursor-pointer w-full inline-block text-center"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </ReactModal>
    );
};

export default CartModal;
