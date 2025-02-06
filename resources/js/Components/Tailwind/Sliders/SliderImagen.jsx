import { useState } from "react"

const SliderImagen = ({ items, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0)



    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % items.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + items.length) % items.length)
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

                    <div className="overflow-hidden w-full">
                        <div
                            className="flex justify-center items-center w-full transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {items.map((brand, index) => (
                                <div key={index} className="flex-shrink-0 sm:w-1/3 lg:w-1/5  flex justify-center items-center">
                                    <img
                                        src={`/api/brands/media/${brand.image}`}
                                        alt={brand.name}
                                        className="h-9 w-full object-contain grayscale invert"

                                    />
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