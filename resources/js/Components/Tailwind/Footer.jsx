import React from "react"

const FooterCallToAction = React.lazy(() => import('./Footer/FooterCallToAction'))
const FooterSocials = React.lazy(() => import('./Footer/FooterSocials'))

const Footer = ({ which, socials }) => {
  const getFooter = () => {
    switch (which) {
      case 'FooterCallToAction':
        return <FooterCallToAction socials={socials} />
      case 'FooterSocials':
        return <FooterSocials socials={socials} />
    }
  }
  return getFooter()
}

export default Footer