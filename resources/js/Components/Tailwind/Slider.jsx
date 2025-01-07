import React from "react"

const SliderSimple = React.lazy(() => import('./Sliders/SliderSimple'))
const SliderBoxed = React.lazy(() => import('./Sliders/SliderBoxed'))
const SliderSearch = React.lazy(() => import('./Sliders/SliderSearch'))

const Slider = ({ which, data, sliders }) => {
  const getSlider = () => {
    switch (which) {
      case 'SliderSimple':
        return <SliderSimple data={data} items={sliders} />
      case 'SliderSearch':
        return <SliderSearch data={data} items={sliders} />
      case 'SliderBoxed':
        return <SliderBoxed data={data} sliders={sliders} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getSlider()
}

export default Slider