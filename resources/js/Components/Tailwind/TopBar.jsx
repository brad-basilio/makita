import React from "react"

const TopBarSimple = React.lazy(() => import('./TopBars/TopBarSimple'))
const TopBarSocials = React.lazy(() => import('./TopBars/TopBarSocials'))

const TopBar = ({ which, socials, data }) => {
  const getTopBar = () => {
    switch (which) {
      case 'TopBarSimple':
        return <TopBarSimple data={data} />
      case 'TopBarSocials':
        return <TopBarSocials socials={socials} data={data} />
      // case 'TopBarCarrito':
      //   return <TopBarCarrito />
    }
  }
  return getTopBar()
}

export default TopBar