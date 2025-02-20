import React from "react"

const TopBarSimple = React.lazy(() => import('./TopBars/TopBarSimple'))
const TopBarSocials = React.lazy(() => import('./TopBars/TopBarSocials'))

const TopBar = ({ which, items }) => {
  const getTopBar = () => {
    switch (which) {
      case 'TopBarSimple':
        return <TopBarSimple key="TopBarSimple" />
      case 'TopBarSocials':
        return <TopBarSocials key="TopBarSocials" items={items} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getTopBar()
}

export default TopBar