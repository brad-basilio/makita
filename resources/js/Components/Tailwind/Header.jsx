import React from "react"


const HeaderContact = React.lazy(() => import('./Headers/HeaderContact'))
const HeaderSearch = React.lazy(() => import('./Headers/HeaderSearch'))
const HeaderSearchB = React.lazy(() => import('./Headers/HeaderSearchB'))

const Header = ({ data, which, items, generals = [], cart, setCart, pages }) => {
  const getHeader = () => {
    switch (which) {
      case 'HeaderContact':
        return <HeaderContact items={items} generals={generals} cart={cart} setCart={setCart} pages={pages} />
      case 'HeaderSearch':
        return <HeaderSearch data={data} items={items} cart={cart} setCart={setCart} pages={pages} />
      case 'HeaderSearchB':
        return <HeaderSearchB data={data} items={items} cart={cart} setCart={setCart} pages={pages} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getHeader()
}

export default Header