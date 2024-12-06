import React from "react"

const CategorySimple = React.lazy(() => import('./Categories/CategorySimple'))

const Category = ({ which, data, items }) => {
  const getCategory = () => {
    switch (which) {
      case 'Simple':
        return <CategorySimple data={data} items={items} />
    }
  }
  return getCategory()
}

export default Category