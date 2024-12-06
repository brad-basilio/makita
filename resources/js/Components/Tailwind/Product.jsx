import React from "react"

const ProductCarousel = React.lazy(() => import('./Products/ProductCarousel'))
const ProductList = React.lazy(() => import('./Products/ProductList'))

const Product = ({ which, data, items }) => {
  const getProduct = () => {
    switch (which) {
      case 'Carousel':
        return <ProductCarousel data={data} items={items} />
      case 'List':
        return <ProductList data={data} items={items} />
    }
  }
  return getProduct()
}

export default Product