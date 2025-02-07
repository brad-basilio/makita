import React, { lazy } from "react"



const BannerSimple = lazy(() => import('./Banners/BannerSimple'))
const BannerFullWidth = lazy(() => import('./Banners/BannerFullWidth'))
const BannerBeneficio = lazy(() => import('./Banners/BannerBeneficio'))
const BannerPublicitario = lazy(() => import('./Banners/BannerPublicitario'))
const Banner = ({ which, data }) => {
  const getBanner = () => {
    switch (which) {
      case 'BannerSimple':
        return <BannerSimple data={data} />
      case 'BannerBeneficio':
        return <BannerBeneficio data={data} />
      case 'BannerPublicitario':
        return <BannerPublicitario data={data} />
      case 'BannerFullWidth':
        return <BannerFullWidth data={data} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getBanner()
}

export default Banner