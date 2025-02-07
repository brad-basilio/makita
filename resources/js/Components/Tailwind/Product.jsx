import React from "react"

const ProductCarousel = React.lazy(() => import('./Products/ProductCarousel'))
const ProductList = React.lazy(() => import('./Products/ProductList'))
const InfiniteProduct = React.lazy(() => import('./Products/InfiniteProduct'))
const Product = ({ which, data, items, cart, setCart }) => {
  const getProduct = () => {
    switch (which) {
      case 'Carousel':
        return <ProductCarousel data={data} items={items} cart={cart} setCart={setCart} />
      case 'List':
        return <ProductList data={data} items={items} cart={cart} setCart={setCart} />
      case 'InfiniteProduct':
        return <InfiniteProduct data={data} items={items} cart={cart} setCart={setCart} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getProduct()
}

export default Product