import { Link } from "@inertiajs/react"
import React from "react"

const BannerSimple = ({ data }) => {
  return <section className="p-[5%] w-full">
    <div className="container w-full aspect-[5/2] rounded-2xl flex flex-col items-center justify-center bg-primary">
      <h1 className="text-2xl text-white font-bold mb-2">{data?.title}</h1>
      <p className="text-white mb-2">{data?.description}</p>
      <Link href={data?.button_link} className="px-3 py-2 rounded-full bg-white text-primary shadow-md">{data?.button_text}</Link>
    </div>
  </section>
}

export default BannerSimple