import React from "react"

const SliderSimple = React.lazy(() => import('./Sliders/SliderSimple'))
const SliderBoxed = React.lazy(() => import('./Sliders/SliderBoxed'))
const SliderSearch = React.lazy(() => import('./Sliders/SliderSearch'))

const Slider = ({ which, sliders }) => {
  const getSlider = () => {
    switch (which) {
      case 'SliderSimple':
        return <SliderSimple items={sliders} />
      case 'SliderSearch':
        return <SliderSearch items={sliders} />
      case 'SliderBoxed':
        return <SliderBoxed sliders={sliders} />
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getSlider()
}

export default Slider