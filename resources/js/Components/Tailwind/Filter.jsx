import React from "react"

const FilterSimple = React.lazy(() => import('./Filters/FilterSimple'))

const Filter = ({ which, data, cart, setCart }) => {
  const getFilter = () => {
    switch (which) {
      case 'FilterSimple':
        return <FilterSimple data={data} cart={cart} setCart={setCart} />
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFilter()
}

export default Filter