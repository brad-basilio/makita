import React from "react"

const HeaderContact = React.lazy(() => import('./Headers/HeaderContact'))
const HeaderSearch = React.lazy(() => import('./Headers/HeaderSearch'))

const Header = ({ data, which, socials, generals = [], cart, setCart, pages }) => {
  const getHeader = () => {
    switch (which) {
      case 'HeaderContact':
        return <HeaderContact socials={socials} generals={generals} cart={cart} setCart={setCart} pages={pages} />
      case 'HeaderSearch':
        return <HeaderSearch data={data} socials={socials} cart={cart} setCart={setCart} pages={pages} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getHeader()
}

export default Header