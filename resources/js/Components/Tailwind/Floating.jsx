import React from "react"

const WhatsApp = React.lazy(() => import('./Floating/WhatsApp'))

const Floating = ({ which, item,  data }) => {
  const getFloating = () => {
    switch (which) {
      case 'WhatsApp':
        return <WhatsApp data={data} item={item} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFloating()
}

export default Floating;