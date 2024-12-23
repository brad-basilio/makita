import React from "react"
import HtmlContent from "../../../Utils/HtmlContent"

const ContactSimple = ({ data }) => {
  return <div className="bg-white">
    <div className="px-[5%] replace-max-w-here w-full mx-auto px-4 py-[5%] md:py-[2.5%]">
      <HtmlContent html={data?.['code:html'] ?? ''}/>
    </div>
  </div>
}

export default ContactSimple