import React from "react"

const CategorySimple = React.lazy(() => import('./Categories/CategorySimple'))
const CategoryCarousel = React.lazy(() => import('./Categories/CategoryCarousel'))

const Category = ({ which, data, items }) => {
  const getCategory = () => {
    switch (which) {
      case 'CategorySimple':
        return <CategorySimple data={data} items={items} />
      case 'CategoryCarousel':
        return <CategoryCarousel data={data} items={items} />
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getCategory()
}

export default Category