import React from "react"

const TopBarSimple = React.lazy(() => import('./TopBars/TopBarSimple'))
const TopBarSocials = React.lazy(() => import('./TopBars/TopBarSocials'))

const TopBar = ({ which, socials }) => {
  const getTopBar = () => {
    switch (which) {
      case 'TopBarSimple':
        return <TopBarSimple />
      case 'TopBarSocials':
        return <TopBarSocials socials={socials} />
      // case 'TopBarCarrito':
      //   return <TopBarCarrito />
    }
  }
  return getTopBar()
}

export default TopBar