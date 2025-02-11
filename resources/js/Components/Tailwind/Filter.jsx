import React from "react"

const FilterSimple = React.lazy(() => import('./Filters/FilterSimple'))
const CatalagoFiltros = React.lazy(() => import('./Filters/CatalagoFiltros'))
const Filter = ({ which, items, data, category, brands, subcategory, cart, setCart, prices }) => {
  console.log("Filter props:", { which, items, data, category, subcategory });
  const getFilter = () => {
    switch (which) {
      case 'FilterSimple':
        return <FilterSimple data={data} category={category} subcategory={subcategory} cart={cart} setCart={setCart} />
      case 'CatalagoFiltros':
        return <CatalagoFiltros data={data} items={items} prices={prices} categories={category} brands={brands} cart={cart} setCart={setCart} />

      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFilter()
}

export default Filter