import React from "react"

const FooterSimple = React.lazy(() => import('./Footer/FooterSimple'))
const FooterSimpleCallToAction = React.lazy(() => import('./Footer/FooterSimpleCallToAction'))
const FooterCallToAction = React.lazy(() => import('./Footer/FooterCallToAction'))

const Footer = ({ which, items, pages }) => {
  const getFooter = () => {
    switch (which) {
      case 'FooterSimpleCallToAction':
        return <FooterSimpleCallToAction socials={items} />
      case 'FooterCallToAction':
        return <FooterCallToAction socials={items} />
      case 'FooterSimple':
        return <FooterSimple socials={items} />
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFooter()
}

export default Footer