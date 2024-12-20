import React from "react"

const BannerFullWidth = ({ data }) => {
  return <section className="bg-gray-50" style={{
    backgroundImage: `url('/api/banners/media/${data?.background}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}>
    <div className="px-[5%] replace-max-w-here w-full mx-auto px-4 py-[5%] md:py-[2.5%]">
      <div className="grid grid-cols-2 aspect-[3/1]">
        <div className="w-full flex flex-col items-start justify-center">
          <h1 className="text-6xl text-white font-bold mb-6">{data?.name}</h1>
          <p className="text-white mb-4">{data?.description}</p>
          {
            (data?.button_link && data?.button_text) &&
            <button href={data?.button_link} className="px-3 py-2 rounded-full bg-white text-textPrimary shadow-md">
              {data?.button_text}
            </button>
          }
        </div>
        <div className="flex items-center justify-center">
          <img src={`/api/banners/media/${data?.image}`} className="h-full aspect-square object-contain max-h-[320px]" alt="" />
        </div>
      </div>
    </div>
  </section>
}

export default BannerFullWidth