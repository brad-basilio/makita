import React from "react"
import HtmlContent from "../../../Utils/HtmlContent"

const FrameFull = ({ data }) => {
  return <section className="w-full">
    <HtmlContent html={data?.['code:html'] ?? ''} />
  </section>
}

export default FrameFull