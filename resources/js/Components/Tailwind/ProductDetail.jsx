import React from "react"


const ProductDetailSimple = React.lazy(() => import('./ProductDetails/ProductDetailSimple'))
const ProductDetailB = React.lazy(() => import('./ProductDetails/ProductDetailB'))

const ProductDetail = ({ which, item, cart, setCart, params }) => {
  const getProductDetail = () => {
    switch (which) {
      case 'ProductDetailSimple':
        return <ProductDetailSimple item={item} cart={cart} setCart={setCart} />
      case 'ProductDetailB':
        return <ProductDetailB item={item} cart={cart} setCart={setCart} params={params} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getProductDetail()
}

export default ProductDetail