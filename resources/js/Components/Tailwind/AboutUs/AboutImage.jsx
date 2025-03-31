import React from "react"

const AboutImage = ({ data }) => {
    return (
        <div class="container mx-auto px-4 py-12">
            <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div class="relative w-full md:w-1/2 aspect-square max-w-md mx-auto">
                    <img alt="Productos ecológicos Kuchara" decoding="async" data-nimg="fill" class="object-contain w-full aspect-square" src={data?.url_imagen} />
                </div>
                <div class="w-full md:w-1/2 text-left">
                    <h1 class="text-2xl md:text-4xl font-bold text-green-600 mb-4 leading-tight">
                        {data?.title}
                    </h1>
                    <div class="space-y-4 text-gray-800">
                        <p className="whitespace-pre-line">{data?.description}</p>
                        <button class="flex items-center text-sm border h-10 mt-4 bg-[#f5f5e9] text-green-600 border-green-600 hover:bg-green-600 hover:text-white rounded-full px-8">Nosotros</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutImage