import React from "react"

const CartSimple = React.lazy(() => import('./Carts/CartSimple'))

const Cart = ({ which, data , cart, setCart}) => {
  const getCart = () => {
    switch (which) {
      case 'CartSimple':
        return <CartSimple data={data} cart={cart} setCart={setCart} />
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getCart()
}

export default Cart