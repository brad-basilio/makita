import React from "react"

const ProductCarousel = React.lazy(() => import('./Products/ProductCarousel'))
const ProductList = React.lazy(() => import('./Products/ProductList'))

const Product = ({ which, data, items, cart, setCart }) => {
  const getProduct = () => {
    switch (which) {
      case 'Carousel':
        return <ProductCarousel data={data} items={items}  cart={cart} setCart={setCart}/>
      case 'List':
        return <ProductList data={data} items={items} cart={cart} setCart={setCart} />
    }
  }
  return getProduct()
}

export default Product