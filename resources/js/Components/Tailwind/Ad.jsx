import React from "react"

const AdSubscription = React.lazy(() => import('./Ads/AdSubscription'))

const Ad = ({ which, data, items }) => {
  const getAd = () => {
    switch (which) {
      case 'Subscription':
        return <AdSubscription data={data} items={items} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getAd()
}

export default Ad