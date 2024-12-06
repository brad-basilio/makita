import React, { lazy } from "react"

const BannerSimple = lazy(() => import('./Banners/BannerSimple'))

const Banner = ({ which, data }) => {
  const getBanner = () => {
    switch (which) {
      case 'BannerSimple':
        return <BannerSimple data={data} />
    }
  }
  return getBanner()
}

export default Banner