"use client"

import { useState } from "react"

const SliderImagen = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const brands = [
        { name: "Canon", logo: "path-to-canon-logo.png" },
        { name: "Motorola", logo: "path-to-motorola-logo.png" },
        { name: "Epson", logo: "path-to-epson-logo.png" },
        { name: "Panasonic", logo: "path-to-panasonic-logo.png" },
    ]

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % brands.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + brands.length) % brands.length)
    }

    return (
        <div className="bg-blue-500 py-8">
            <div className="container mx-auto px-4">
                <div className="relative flex items-center">
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        aria-label="Previous brand"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="overflow-hidden mx-12">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {brands.map((brand, index) => (
                                <div key={brand.name} className="w-full flex-shrink-0 flex justify-center items-center px-4">
                                    <img src={brand.logo || "/placeholder.svg"} alt={`${brand.name} logo`} className="h-12 w-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        aria-label="Next brand"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SliderImagen;