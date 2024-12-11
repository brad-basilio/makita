import React from "react"

const HeaderContact = React.lazy(() => import('./Headers/HeaderContact'))
const HeaderSearch = React.lazy(() => import('./Headers/HeaderSearch'))

const Header = ({ which, socials, generals = [] }) => {
  const getHeader = () => {
    switch (which) {
      case 'HeaderContact':
        return <HeaderContact socials={socials} generals={generals}/>
      case 'HeaderSearch':
        return <HeaderSearch socials={socials} />
    }
  }
  return getHeader()
}

export default Header