import React from "react"

const SliderSimple = React.lazy(() => import('./Sliders/SliderSimple'))
const SliderBoxed = React.lazy(() => import('./Sliders/SliderBoxed'))

const Slider = ({ which, sliders }) => {
  const getSlider = () => {
    switch (which) {
      case 'SliderSimple':
        return <SliderSimple items={sliders} />
      case 'SliderBoxed':
        return <SliderBoxed sliders={sliders} />
    }
  }
  return getSlider()
}

export default Slider