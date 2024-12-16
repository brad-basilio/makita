import React, { lazy } from "react"

const BannerSimple = lazy(() => import('./Banners/BannerSimple'))

const Banner = ({ which, data }) => {
  const getBanner = () => {
    switch (which) {
      case 'BannerSimple':
        return <BannerSimple data={data} />
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getBanner()
}

export default Banner