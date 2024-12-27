import React from "react"
import HtmlContent from "../../../Utils/HtmlContent"

const FrameSimple = ({ data }) => {
  return <div className="bg-white">
    <div className="px-[5%] replace-max-w-here w-full mx-auto py-[5%] md:py-[2.5%]">
      <HtmlContent html={data?.['code:html'] ?? ''}/>
    </div>
  </div>
}

export default FrameSimple