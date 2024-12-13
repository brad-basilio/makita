import React from "react"

const HeaderContact = React.lazy(() => import('./Headers/HeaderContact'))
const HeaderSearch = React.lazy(() => import('./Headers/HeaderSearch'))

const Header = ({data, which, socials, generals = [], cart, setCart }) => {
  const getHeader = () => {
    switch (which) {
      case 'HeaderContact':
        return <HeaderContact socials={socials} generals={generals} cart={cart} setCart={setCart} />
      case 'HeaderSearch':
        return <HeaderSearch data={data} socials={socials} cart={cart} setCart={setCart} />
    }
  }
  return getHeader()
}

export default Header