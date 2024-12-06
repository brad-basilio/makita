import React from "react"
import SliderBoxed from "./Sliders/SliderBoxed"

const Slider = ({ which, sliders }) => {
  const getSlider = () => {
    switch (which) {
      case 'SliderBoxed':
        return <SliderBoxed sliders={sliders} />
    }
  }
  return getSlider()
}

export default Slider